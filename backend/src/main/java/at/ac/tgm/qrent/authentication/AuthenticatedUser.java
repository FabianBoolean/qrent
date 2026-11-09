package at.ac.tgm.qrent.authentication;

import at.ac.tgm.qrent.authorization.Role;
import java.io.Serializable;

public record AuthenticatedUser(
        String email,
        String firstName,
        String lastName,
        String schoolClass,
        Role role
) implements Serializable {
}
