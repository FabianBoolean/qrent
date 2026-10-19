package at.ac.tgm.qrent.inventory;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "CHAR(2)")
    private String code;

    @Column(nullable = false, length = 100)
    private String name;

    @OneToMany(mappedBy = "category")
    @OrderBy("code")
    private List<Subcategory> subcategories = new ArrayList<>();

    protected Category() {
        // Wird von JPA benötigt
    }

    public Long getId() { return id; }
    public String getCode() { return code; }
    public String getName() { return name; }
    public List<Subcategory> getSubcategories() { return subcategories; }
}