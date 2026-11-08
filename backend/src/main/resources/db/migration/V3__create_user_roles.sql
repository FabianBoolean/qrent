CREATE TABLE user_roles (
    email VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    PRIMARY KEY (email),
    CONSTRAINT chk_user_roles_role
        CHECK (role IN ('TEACHER', 'ADMIN'))
 );