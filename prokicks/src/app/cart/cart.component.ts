import { Component, OnInit } from '@angular/core';
import { ExampleService } from '../services/example.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{
  cartItems: any[] = [];
  userId: string = '';
  includeInvoice: boolean = false;
  showErrorMessage: boolean = false;

  constructor(private _service : ExampleService,private router: Router){
    this.userId = localStorage.getItem('userId') || '';
  }
  ngOnInit(): void {
    if (!this.userId) {
       // Lưu URL hiện tại trước khi điều hướng đến trang đăng nhập
      alert('Vui lòng đăng nhập để truy cập giỏ hàng.');
      this.router.navigate(['/login']);
      return;
    }
    else{
      this.loadCart();
    }

    // Xóa thông tin mua ngay nếu người dùng truy cập vào giỏ hàng
    localStorage.removeItem('directPurchase');
    localStorage.removeItem('reorderDetails');

  }

  // Tải giỏ hàng từ database
  loadCart() {
    this._service.getUserCart(this.userId).subscribe({
      next: (cart) => {
        console.log('Dữ liệu giỏ hàng từ API:', cart);
        this.cartItems = cart || [];
      },
      error: (err) => {
        console.error('Lỗi khi tải giỏ hàng:', err);
      }
    });
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  removeItem(productId: string) {
    const userId = this._service.getUserId();
  
    if (!userId) {
      console.error('Người dùng chưa đăng nhập.');
      return;
    }
  
    if (!productId) {
      console.error('Không tìm thấy `productId`.');
      return;
    }
  
    console.log(`Sending DELETE request for userId: ${userId}, productId: ${productId}`);
  
    this._service.removeProductFromCart(userId, productId).subscribe({
      next: () => {
        console.log(`Sản phẩm với ID ${productId} đã được xóa`);
        // Cập nhật giỏ hàng sau khi xóa
        this.cartItems = this.cartItems.filter(item => item.productId !== productId);
      },
      error: (err) => {
        console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', err);
      }
    });
  }
  getSelectedTotalPrice(): number {
    return this.cartItems
      .filter(item => item.selected)
      .reduce((total, item) => total + item.price * item.quantity, 0);
  }
  hasSelectedItems(): boolean {
    return this.cartItems.some(item => item.selected);
  }
  checkoutSelectedItems() {
    const selectedItems = this.cartItems.filter(item => item.selected);
    if (selectedItems.length === 0) {
      console.log('Không có sản phẩm nào được chọn'); // Debug
      this.showErrorMessage = true;
      alert('Vui lòng chọn ít nhất một sản phẩm trước khi đặt hàng!'); // Sử dụng alert
      return;
      
    }
    this.showErrorMessage = false; // Ẩn thông báo lỗi nếu có sản phẩm được chọn
    localStorage.setItem('selectedCartItems', JSON.stringify(selectedItems));
    this.router.navigate(['/checkout']);
  }
  increaseQuantity(index: number) {
    this.cartItems[index].quantity++;
    this.updateCart();
  }
  decreaseQuantity(index: number) {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--;
      this.updateCart();
    }
  }
  // Cập nhật giỏ hàng khi số lượng thay đổi
  updateCart() {
    this._service.updateUserCart(this.userId, this.cartItems).subscribe({
      next: () => {
        console.log('Giỏ hàng đã được cập nhật');
        localStorage.setItem('cartItems', JSON.stringify(this.cartItems)); // Lưu vào localStorage
      },
      error: (err) => console.error('Lỗi khi cập nhật giỏ hàng:', err)
    });
  }

}
