package at.ac.tgm.qrent.inventory;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "subcategory_id")
    private Subcategory subcategory;

    @Column(nullable = false, columnDefinition = "CHAR(4)")
    private String code;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "product")
    @OrderBy("inventoryNumber")
    private List<EquipmentItem> items = new ArrayList<>();

    protected Product() {
        // Wird von JPA benötigt
    }

    public Long getId() { return id; }
    public Subcategory getSubcategory() { return subcategory; }
    public String getCode() { return code; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public List<EquipmentItem> getItems() { return items; }
}