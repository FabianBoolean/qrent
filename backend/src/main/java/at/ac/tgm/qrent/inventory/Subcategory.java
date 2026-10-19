package at.ac.tgm.qrent.inventory;

import jakarta.persistence.*;

@Entity
@Table(name = "subcategories")
public class Subcategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(nullable = false, columnDefinition = "CHAR(2)")
    private String code;

    @Column(nullable = false, length = 100)
    private String name;

    protected Subcategory() {
        // Wird von JPA benötigt
    }

    public Long getId() { return id; }
    public Category getCategory() { return category; }
    public String getCode() { return code; }
    public String getName() { return name; }
}