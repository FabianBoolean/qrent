package at.ac.tgm.qrent.authentication;

import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.Map;

/**
 * Development-only mock authentication. Do not expose this service as a
 * production login mechanism or deploy its hard-coded test credentials.
 */
@Service
public class MockAuthService {

    private static final Map<String, MockUser> USERS = Map.of(
            "schueler1@tgm.ac.at", new MockUser("student123", "Max", "Mustermann", "5CHIT"),
            "schueler2@tgm.ac.at", new MockUser("student123", "Anna", "Beispiel", "4AHIT"),
            "lehrer1@tgm.ac.at", new MockUser("teacher123", "Thomas", "Lehrer", null),
            "lehrer2@tgm.ac.at", new MockUser("teacher123", "Maria", "Lehrerin", null),
            "admin1@tgm.ac.at", new MockUser("admin123", "System", "Administrator", null),
            "admin2@tgm.ac.at", new MockUser("admin123", "System", "Administrator 2", null)
    );

    public AuthenticatedIdentity authenticate(String email, String password) {
        if (email == null || password == null) {
            throw new AuthenticationException("Ungültige Zugangsdaten");
        }

        String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);
        MockUser user = USERS.get(normalizedEmail);

        if (user == null || !user.password().equals(password)) {
            throw new AuthenticationException("Ungültige Zugangsdaten");
        }

        return new AuthenticatedIdentity(
                normalizedEmail,
                user.firstName(),
                user.lastName(),
                user.schoolClass()
        );
    }

    private record MockUser(
            String password,
            String firstName,
            String lastName,
            String schoolClass
    ) {
    }
}
