package at.ac.tgm.qrent.inventory;

import jakarta.persistence.*;

@Entity
@Table(name = "equipment_items")
public class EquipmentItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(nullable = false, columnDefinition = "CHAR(8)")
    private String inventoryNumber;

    @Column(columnDefinition = "TEXT")
    private String notes;

    protected EquipmentItem() {
        // Wird von JPA benötigt
    }

    public Long getId() { return id; }
    public Product getProduct() { return product; }
    public String getInventoryNumber() { return inventoryNumber; }
    public String getNotes() { return notes; }
}