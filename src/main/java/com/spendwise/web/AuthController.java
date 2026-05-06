package com.spendwise.web;

import com.spendwise.model.AppUser;
import com.spendwise.repo.AppUserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AppUserRepository users;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthController(AppUserRepository users) {
        this.users = users;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody AuthRequest request) {
        String email = normalizeEmail(request.email());

        if (email.isBlank() || request.password() == null || request.password().length() < 6) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Email and 6+ character password are required"));
        }

        if (users.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorResponse("Account already exists"));
        }

        AppUser saved = users.save(new AppUser(email, passwordEncoder.encode(request.password())));
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(saved));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        String email = normalizeEmail(request.email());

        return users.findByEmail(email)
            .filter(user -> passwordEncoder.matches(request.password(), user.getPasswordHash()))
            .<ResponseEntity<?>>map(user -> ResponseEntity.ok(toResponse(user)))
            .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse("Invalid credentials")));
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    private AuthUserResponse toResponse(AppUser user) {
        return new AuthUserResponse(user.getId(), user.getEmail());
    }

    public record AuthRequest(String email, String password) {}

    public record AuthUserResponse(Long id, String email) {}

    public record ErrorResponse(String message) {}
}
