package at.ac.tgm.qrent.authorization;

public enum Role {

    STUDENT,
    TEACHER,
    ADMIN;

    public boolean includes(Role requiredRole) {
        return this.ordinal() >= requiredRole.ordinal();
    }
}