package at.ac.tgm.qrent.authentication;

import at.ac.tgm.qrent.authorization.Role;
import at.ac.tgm.qrent.authorization.RoleService;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    private final MockAuthService mockAuthService;
    private final RoleService roleService;

    public AuthenticationService(MockAuthService mockAuthService, RoleService roleService) {
        this.mockAuthService = mockAuthService;
        this.roleService = roleService;
    }

    public AuthenticatedUser authenticate(String email, String password) {
        AuthenticatedIdentity identity = mockAuthService.authenticate(email, password);
        Role role = roleService.getRole(identity.email());
        return new AuthenticatedUser(
                identity.email(), identity.firstName(), identity.lastName(),
                identity.schoolClass(), role
        );
    }
}
