package at.ac.tgm.qrent.authorization;

import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class RoleService {

    private final UserRoleRepository repository;

    public RoleService(UserRoleRepository repository) {
        this.repository = repository;
    }

    public Role getRole(String email) {
        String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);

        return repository.findById(normalizedEmail)
                .map(UserRole::getRole)
                .orElse(Role.STUDENT);
    }

    public boolean hasRole(String email, Role requiredRole) {
        return getRole(email).includes(requiredRole);
    }
}