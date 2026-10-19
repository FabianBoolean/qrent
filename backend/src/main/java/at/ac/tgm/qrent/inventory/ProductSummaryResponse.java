package at.ac.tgm.qrent.inventory;

public record ProductSummaryResponse(Long id, String code, String name,
                                     NamedRef category, NamedRef subcategory, int itemCount) {

    static ProductSummaryResponse from(Product product) {
        Subcategory subcategory = product.getSubcategory();
        Category category = subcategory.getCategory();
        return new ProductSummaryResponse(
                product.getId(),
                product.getCode(),
                product.getName(),
                new NamedRef(category.getId(), category.getName()),
                new NamedRef(subcategory.getId(), subcategory.getName()),
                product.getItems().size());
    }
}