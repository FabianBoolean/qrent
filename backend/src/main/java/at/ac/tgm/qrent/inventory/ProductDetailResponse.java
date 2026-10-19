package at.ac.tgm.qrent.inventory;

import java.util.List;

public record ProductDetailResponse(Long id, String code, String name, String description,
                                    NamedRef category, NamedRef subcategory, List<ItemResponse> items) {

    public record ItemResponse(Long id, String inventoryNumber, String notes) {
    }

    static ProductDetailResponse from(Product product) {
        Subcategory subcategory = product.getSubcategory();
        Category category = subcategory.getCategory();
        return new ProductDetailResponse(
                product.getId(),
                product.getCode(),
                product.getName(),
                product.getDescription(),
                new NamedRef(category.getId(), category.getName()),
                new NamedRef(subcategory.getId(), subcategory.getName()),
                product.getItems().stream()
                        .map(i -> new ItemResponse(i.getId(), i.getInventoryNumber(), i.getNotes()))
                        .toList());
    }
}