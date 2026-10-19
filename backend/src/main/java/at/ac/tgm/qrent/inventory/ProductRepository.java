package at.ac.tgm.qrent.inventory;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @EntityGraph(attributePaths = {"subcategory.category", "items"})
    List<Product> findAllByOrderByNameAsc();
}