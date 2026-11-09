package at.ac.tgm.qrent.authentication;

public record AuthenticatedIdentity(
        String email,
        String firstName,
        String lastName,
        String schoolClass
) {
}
