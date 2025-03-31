import { Component, OnInit } from '@angular/core';
import { ExampleService } from '../services/example.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accessory-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accessory-details.component.html',
  styleUrls: ['./accessory-details.component.css']
})

export class AccessoryDetailsComponent implements OnInit {
  selectedAccessory: any;
  accessoryId: string | null = null;
  selectedSize: number | null = null;
  mainImageSrc: string = '';
  relatedAccessories: any[] = []; // Lưu danh sách phụ kiện liên quan


  constructor(private _service: ExampleService, private activate: ActivatedRoute, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Lấy ID từ URL
    this.route.paramMap.subscribe((params) => {
      this.accessoryId = params.get('id');
      if (this.accessoryId) {
        // Gọi API để lấy chi tiết sản phẩm
        this._service.getAccessoryById(this.accessoryId).subscribe({
          next: (data) => {
            this.selectedAccessory = data; // Lưu thông tin sản phẩm
            this.mainImageSrc = this.selectedAccessory.image1;
            this._service.getRelatedAccessoriesByType(this.selectedAccessory.type, this.selectedAccessory._id).subscribe({
              next: (related) => {
                this.relatedAccessories = related;
              },
              error: (err) => {
                console.error('Error fetching related accessories:', err);
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
  goToAccessoryDetails(id: string): void {
    if (id) {
      this.router.navigate(['/accessory-details', id]); // Điều hướng đến chi tiết accessories
    } else {
      console.error('Invalid accessory ID:', id);
    }
  }
  changeImage(src: string): void {
    this.mainImageSrc = src;
  }

  // Điều hướng về trang sản phẩm
  // Thêm phụ kiện vào giỏ hàng
  addToCart() {
    const userId = this._service.getUserId();
    if (!userId) {
      this._service.setRedirectUrl(this.router.url);
      alert('Vui lòng đăng nhập trước khi thêm vào giỏ hàng.');
      this.router.navigate(['/login']);
      return;
    }

    const accessoryToAdd = {
      productId: this.selectedAccessory._id,
      name: this.selectedAccessory.name,
      price: this.selectedAccessory.price,
      quantity: 1,
      image: this.selectedAccessory.image1,
      category: 'accessory'
    };

    this._service.addToCart(userId, accessoryToAdd).subscribe({
      next: () => {
        alert('Phụ kiện đã được thêm vào giỏ hàng!');
      },
      error: (err) => {
        console.error('Lỗi khi thêm vào giỏ hàng:', err);
      },
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
  
  
    const productToBuy = {
      productId: this.selectedAccessory._id,
      name: this.selectedAccessory.name,
      price: this.selectedAccessory.price,
      quantity: 1,
      image: this.selectedAccessory.image1,
      description: this.selectedAccessory.description,
      brand: this.selectedAccessory.brand,
      type: this.selectedAccessory.type
    };
  
    // Chuyển đến trang checkout với thông tin sản phẩm
    localStorage.setItem('directPurchase', JSON.stringify(productToBuy));
    this.router.navigate(['/checkout']);
  }
}
  


