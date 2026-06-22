package com.spendwise.web;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.RSASSAVerifier;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.security.cert.CertificateFactory;
import java.security.cert.CertificateException;
import java.security.interfaces.RSAPublicKey;
import java.security.cert.X509Certificate;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class FirebaseTokenService {

    private static final URI CERTS_URI = URI.create("https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com");

    @Value("${firebase.project-id:}")
    private String projectId;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final Map<String, CachedCert> certCache = new ConcurrentHashMap<>();

    public FirebasePrincipal verify(String idToken) {
        if (projectId == null || projectId.isBlank()) {
            throw new IllegalStateException("Firebase project id is not configured");
        }

        try {
            SignedJWT jwt = SignedJWT.parse(idToken);
            JWSHeader header = jwt.getHeader();
            if (!JWSAlgorithm.RS256.equals(header.getAlgorithm())) {
                throw new IllegalArgumentException("Unsupported Firebase token algorithm");
            }

            RSAKey rsaKey = getRsaKey(header.getKeyID());

            RSAPublicKey publicKey = rsaKey.toRSAPublicKey();
            if (!jwt.verify(new RSASSAVerifier(publicKey))) {
                throw new IllegalArgumentException("Invalid Firebase token signature");
            }

            JWTClaimsSet claims = jwt.getJWTClaimsSet();
            validateClaims(claims);

            return new FirebasePrincipal(
                claims.getSubject(),
                stringClaim(claims, "email"),
                stringClaim(claims, "name"),
                stringClaim(claims, "picture")
            );
        } catch (JOSEException error) {
            throw new IllegalArgumentException("Invalid Firebase token signature", error);
        } catch (Exception error) {
            if (error instanceof IllegalArgumentException) {
                throw (IllegalArgumentException) error;
            }

            throw new IllegalArgumentException("Invalid Firebase token", error);
        }
    }

    private RSAKey getRsaKey(String keyId) throws Exception {
        if (keyId == null || keyId.isBlank()) {
            throw new IllegalArgumentException("Firebase token missing key id");
        }

        CachedCert cached = certCache.get(keyId);
        if (cached != null && cached.expiresAt.isAfter(Instant.now())) {
            return cached.key;
        }

        HttpRequest request = HttpRequest.newBuilder(CERTS_URI).GET().build();
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new IllegalStateException("Unable to load Firebase signing certificates");
        }

        long maxAgeSeconds = response.headers()
            .firstValue("cache-control")
            .map(this::parseMaxAge)
            .orElse(300L);

        Instant expiresAt = Instant.now().plusSeconds(maxAgeSeconds);
        Map<String, RSAKey> keys = parseCertificates(response.body());
        keys.forEach((id, key) -> certCache.put(id, new CachedCert(key, expiresAt)));

        CachedCert refreshed = certCache.get(keyId);
        if (refreshed == null) {
            throw new IllegalArgumentException("Firebase signing key not found");
        }

        return refreshed.key;
    }

    private Map<String, RSAKey> parseCertificates(String body) throws Exception {
        if (body == null || body.isBlank()) {
            return Map.of();
        }

        Map<String, String> certMap = objectMapper.readValue(body, new TypeReference<>() {});
        CertificateFactory factory = CertificateFactory.getInstance("X.509");

        return certMap.entrySet().stream().collect(java.util.stream.Collectors.toMap(
            Map.Entry::getKey,
            entry -> {
                try {
                    String pem = entry.getValue()
                        .replace("-----BEGIN CERTIFICATE-----", "")
                        .replace("-----END CERTIFICATE-----", "")
                        .replaceAll("\\s+", "");
                    byte[] decoded = java.util.Base64.getDecoder().decode(pem);
                    X509Certificate certificate = (X509Certificate) factory.generateCertificate(
                        new java.io.ByteArrayInputStream(decoded)
                    );
                    return new RSAKey.Builder((RSAPublicKey) certificate.getPublicKey())
                        .keyID(entry.getKey())
                        .build();
                } catch (CertificateException error) {
                    throw new RuntimeException(error);
                }
            }
        ));
    }

    private void validateClaims(JWTClaimsSet claims) {
        String issuer = "https://securetoken.google.com/" + projectId;
        if (!issuer.equals(claims.getIssuer())) {
            throw new IllegalArgumentException("Invalid Firebase token issuer");
        }

        List<String> audience = claims.getAudience();
        if (audience == null || audience.isEmpty() || !projectId.equals(audience.get(0))) {
            throw new IllegalArgumentException("Invalid Firebase token audience");
        }

        Date expiration = claims.getExpirationTime();
        if (expiration == null || expiration.toInstant().isBefore(Instant.now())) {
            throw new IllegalArgumentException("Firebase token has expired");
        }

        if (claims.getSubject() == null || claims.getSubject().isBlank()) {
            throw new IllegalArgumentException("Firebase token missing subject");
        }
    }

    private String stringClaim(JWTClaimsSet claims, String name) {
        Object value = claims.getClaim(name);
        return value == null ? null : String.valueOf(value);
    }

    private long parseMaxAge(String cacheControl) {
        for (String part : cacheControl.split(",")) {
            String trimmed = part.trim();
            if (trimmed.startsWith("max-age=")) {
                try {
                    return Long.parseLong(trimmed.substring("max-age=".length()));
                } catch (NumberFormatException ignored) {
                    return 300L;
                }
            }
        }
        return 300L;
    }

    private record CachedCert(RSAKey key, Instant expiresAt) {}

    public record FirebasePrincipal(String uid, String email, String name, String picture) {}
}
