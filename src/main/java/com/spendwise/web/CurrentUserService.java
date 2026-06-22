package com.spendwise.web;

import com.spendwise.model.AppUser;
import com.spendwise.repo.AppUserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CurrentUserService {

    private static final String FIREBASE_PASSWORD_PLACEHOLDER = "__firebase_managed_user__";

    private final AppUserRepository users;
    private final FirebaseTokenService firebaseTokenService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public CurrentUserService(AppUserRepository users, FirebaseTokenService firebaseTokenService) {
        this.users = users;
        this.firebaseTokenService = firebaseTokenService;
    }

    public AppUser requireUser(String authorizationHeader) {
        String idToken = extractBearerToken(authorizationHeader);

        if (idToken.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Login is required");
        }

        try {
            return syncFirebaseUser(firebaseTokenService.verify(idToken));
        } catch (IllegalArgumentException error) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, error.getMessage());
        } catch (IllegalStateException error) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, error.getMessage());
        }
    }

    public AppUser syncFirebaseUser(FirebaseTokenService.FirebasePrincipal token) {
        String email = normalizeEmail(token.email());

        if (email.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Firebase account must have an email");
        }

        AppUser user = users.findByFirebaseUid(token.uid())
            .or(() -> users.findByEmail(email))
            .orElseGet(AppUser::new);

        user.setEmail(email);
        user.setFirebaseUid(token.uid());
        user.setDisplayName(token.name());
        user.setPhotoUrl(token.picture());
        if (user.getPasswordHash() == null) {
            user.setPasswordHash(passwordEncoder.encode(FIREBASE_PASSWORD_PLACEHOLDER));
        }

        return users.save(user);
    }

    private String extractBearerToken(String authorizationHeader) {
        if (authorizationHeader == null) {
            return "";
        }

        String prefix = "Bearer ";
        if (!authorizationHeader.startsWith(prefix)) {
            return "";
        }

        return authorizationHeader.substring(prefix.length()).trim();
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }
}
