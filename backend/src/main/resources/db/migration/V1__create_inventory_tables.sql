CREATE TABLE categories (
                            id   BIGINT AUTO_INCREMENT PRIMARY KEY,
                            code CHAR(2)      NOT NULL UNIQUE,
                            name VARCHAR(100) NOT NULL
);

CREATE TABLE subcategories (
                               id          BIGINT AUTO_INCREMENT PRIMARY KEY,
                               category_id BIGINT       NOT NULL,
                               code        CHAR(2)      NOT NULL,
                               name        VARCHAR(100) NOT NULL,
                               CONSTRAINT fk_subcategory_category FOREIGN KEY (category_id) REFERENCES categories (id),
                               CONSTRAINT uq_subcategory_code UNIQUE (category_id, code)
);

CREATE TABLE products (
                          id             BIGINT AUTO_INCREMENT PRIMARY KEY,
                          subcategory_id BIGINT       NOT NULL,
                          code           CHAR(4)      NOT NULL,
                          name           VARCHAR(200) NOT NULL,
                          description    TEXT,
                          CONSTRAINT fk_product_subcategory FOREIGN KEY (subcategory_id) REFERENCES subcategories (id),
                          CONSTRAINT uq_product_code UNIQUE (subcategory_id, code)
);

CREATE TABLE equipment_items (
                                 id               BIGINT AUTO_INCREMENT PRIMARY KEY,
                                 product_id       BIGINT  NOT NULL,
                                 inventory_number CHAR(8) NOT NULL UNIQUE,
                                 notes            TEXT,
                                 CONSTRAINT fk_item_product FOREIGN KEY (product_id) REFERENCES products (id)
);