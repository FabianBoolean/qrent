package at.ac.tgm.qrent.inventory;

import java.util.List;

public record CategoryResponse(Long id, String code, String name, List<SubcategoryResponse> subcategories) {

    public record SubcategoryResponse(Long id, String code, String name) {
    }

    static CategoryResponse from(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getCode(),
                category.getName(),
                category.getSubcategories().stream()
                        .map(s -> new SubcategoryResponse(s.getId(), s.getCode(), s.getName()))
                        .toList());
    }
}