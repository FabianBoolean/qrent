package at.ac.tgm.qrent.authentication;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Profile("!prod")
@RequestMapping("/api/auth")
public class AuthController {

    public static final String SESSION_USER = "qrentUser";

    private final AuthenticationService authenticationService;

    public AuthController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/login")
    public AuthenticatedUser login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        AuthenticatedUser user = authenticationService.authenticate(request.email(), request.password());

        HttpSession oldSession = httpRequest.getSession(false);
        if (oldSession != null) {
            oldSession.invalidate();
        }

        HttpSession session = httpRequest.getSession(true);
        session.setAttribute(SESSION_USER, user);
        return user;
    }

    @GetMapping("/me")
    public ResponseEntity<AuthenticatedUser> me(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Object value = session.getAttribute(SESSION_USER);
        if (!(value instanceof AuthenticatedUser user)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(user);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<String> handleAuthenticationException(AuthenticationException exception) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Ungültige Zugangsdaten");
    }
}
