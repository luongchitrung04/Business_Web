import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExampleService } from '../services/example.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  selectedProduct: any;
  productId: string | null = null;
  selectedSize: number | null = null;
  mainImageSrc: string = '';
  relatedProducts: any[] = []; // Lưu danh sách sản phẩm liên quan


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _service: ExampleService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.productId = params.get('id');
      if (this.productId) {
        this._service.getShoeById(this.productId).subscribe({
          next: (data) => {
            this.selectedProduct = data;
            this.mainImageSrc = this.selectedProduct.image1;
            // lấy danh sách sản phẩm liên quan theo thương hiệu
            this._service.getRelatedProductsByBrand(this.selectedProduct.brand, this.selectedProduct._id).subscribe({
              next: (related) => {
                  this.relatedProducts = related; // Cập nhật danh sách sản phẩm liên quan
              },
              error: (err) => {
                  console.error('Error fetching related products:', err);
              },
          });          
          },
          error: (err) => {
            console.error('Error fetching product details:', err);
          },
        });
      } else {
        console.error('Product ID is missing!');
      }
    });
  }
  goToProductDetails(id: string): void {
    if (id) {
      this.router.navigate(['/product-details', id]); // Điều hướng đến chi tiết sản phẩm
    } else {
      console.error('Invalid product ID:', id);
    }
  }

  changeImage(src: string): void {
    this.mainImageSrc = src;
  }

  selectSize(size: number): void {
    this.selectedSize = size;
  }

  isSelected(size: number): boolean {
    return this.selectedSize === size;
  }

  // Thêm sản phẩm vào giỏ hàng
  addToCart() {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const userId = this._service.getUserId();
    if (!userId) {
      this._service.setRedirectUrl(this.router.url);
      alert('Vui lòng đăng nhập trước khi thêm vào giỏ hàng.');
      this.router.navigate(['/login']);
      return;
    }
  
    if (!this.selectedSize) {
      alert('Vui lòng chọn kích cỡ trước khi thêm vào giỏ hàng!');
      return;
    }
  
    // Tạo đối tượng sản phẩm với đầy đủ thông tin
    const productToAdd = {
      productId: this.selectedProduct._id,
      name: this.selectedProduct.name,
      price: this.selectedProduct.price - (this.selectedProduct.price * this.selectedProduct.discount / 100),
      quantity: 1,
      selectedSize: this.selectedSize,
      image: this.selectedProduct.image1 // Lưu hình ảnh chính của sản phẩm
    };
  
    // Gọi hàm addToCart từ service
    this._service.addToCart(userId, productToAdd).subscribe({
      next: () => {
        alert('Sản phẩm đã được thêm vào giỏ hàng!');
      },
      error: (err) => {
        console.error('Lỗi khi thêm vào giỏ hàng:', err);
      }
    });
  }
  addToCartAndCheckout() {
    const userId = this._service.getUserId();
    if (!userId) {
      this._service.setRedirectUrl(this.router.url);
      alert('Vui lòng đăng nhập trước khi mua sản phẩm.');
      this.router.navigate(['/login']);
      return;
    }
  
    if (!this.selectedSize) {
      alert('Vui lòng chọn kích cỡ trước khi mua sản phẩm!');
      return;
    }
  
    const productToBuy = {
      productId: this.selectedProduct._id,
      name: this.selectedProduct.name,
      price: this.selectedProduct.price - (this.selectedProduct.price * this.selectedProduct.discount / 100),
      quantity: 1,
      selectedSize: this.selectedSize,
      image: this.selectedProduct.image1,
      description: this.selectedProduct.description,
      brand: this.selectedProduct.brand,
      type: this.selectedProduct.type
    };
    // Xóa các sản phẩm đã chọn từ giỏ hàng trong localStorage
    localStorage.removeItem('selectedCartItems');
    localStorage.removeItem('reorderDetails');

  
    // Chuyển đến trang checkout với thông tin sản phẩm
    localStorage.setItem('directPurchase', JSON.stringify(productToBuy));
    this.router.navigate(['/checkout']);
  }
  
  
  
  
}
