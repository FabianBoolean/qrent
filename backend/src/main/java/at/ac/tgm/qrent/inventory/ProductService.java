package at.ac.tgm.qrent.inventory;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductSummaryResponse> getAllProducts() {
        return productRepository.findAllByOrderByNameAsc().stream()
                .map(ProductSummaryResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductDetailResponse getProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Produkt mit ID " + id + " wurde nicht gefunden."));
        return ProductDetailResponse.from(product);
    }
}