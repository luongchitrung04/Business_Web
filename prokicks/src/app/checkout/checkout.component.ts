import { Component, OnInit } from '@angular/core';
import { ExampleService } from '../services/example.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartItems: any[] = [];
  directPurchaseItem: any = null;

  customerName: string = '';
  email: string = '';
  phone: string = '';
  address: string = '';
  paymentMethod: string = 'COD';

  totalAmount: number = 0;
  shippingFee: number = 30000; 
  discountCode: string = '';
  discountAmount: number = 0;

  userId: string | null = null;

  discountError: boolean = false; // Thêm thuộc tính này



  constructor(private _service: ExampleService, private router: Router) {}

  ngOnInit(): void {
    // Lấy userId từ localStorage
    this.userId = this._service.getUserId();

    if (this.userId) {
      // Tự động điền thông tin người dùng vào form
      this._service.getUserProfile(this.userId).subscribe({
        next: (userData) => {
          this.customerName = `${userData.firstname} ${userData.lastname}`;
          this.email = userData.email;
          this.phone = userData.phonenumber;
          this.address = userData.address;
        },
        error: (err) => console.error('Lỗi khi tải thông tin người dùng:', err)
      });
    }
   // Kiểm tra sản phẩm được chọn từ giỏ hàng
  

    // Kiểm tra xem có thông tin mua lại từ localStorage không
  const reorderDetails = localStorage.getItem('reorderDetails');
  if (reorderDetails) {
    const parsedReorder = JSON.parse(reorderDetails);
    this.cartItems = parsedReorder.items || [];
    this.customerName = parsedReorder.customerName || this.customerName;
    this.phone = parsedReorder.phone || this.phone;
    this.address = parsedReorder.address || this.address;
    this.paymentMethod = parsedReorder.paymentMethod || 'COD';
  } else {
    // Nếu không có thông tin mua lại, kiểm tra giỏ hàng
    const directPurchase = localStorage.getItem('directPurchase');
    if (directPurchase) {
      this.directPurchaseItem = JSON.parse(directPurchase);
      this.cartItems = [this.directPurchaseItem];
    } 
  
    // else if (this.userId) {
    //     this._service.getUserCart(this.userId).subscribe({
    //       next: (cart) => {
    //         this.cartItems = cart || [];
    //         this.calculateTotal();
    //       },
    //       error: (err) => console.error('Lỗi khi tải giỏ hàng:', err)
    //     });
    // }
  }
  const selectedItems = localStorage.getItem('selectedCartItems');
  if (selectedItems) {
     this.cartItems = JSON.parse(selectedItems); // Chỉ lấy sản phẩm đã chọn
     this.calculateTotal();
     return;
   }

  this.calculateTotal();
}

calculateTotal() {
  this.totalAmount = this.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  if (this.totalAmount > 1000000) {
    this.shippingFee = 0; // Miễn phí vận chuyển
  }
}

applyDiscount() {
  if (this.discountCode.trim().toUpperCase() === 'SALE2024') {
    this.discountAmount = 100000;
    this.discountError = false; // Tắt lỗi nếu mã giảm giá đúng
  } else {
    this.discountAmount = 0;
    this.discountError = true; // Hiển thị lỗi nếu mã giảm giá sai
  }
}


  getTotalPrice(): number {
    return this.totalAmount + this.shippingFee - this.discountAmount;
  }


  confirmOrder() {
    if (!this.cartItems || this.cartItems.length === 0) {
      alert('Không có sản phẩm nào để thanh toán.');
      return;
    }
    const orderId = 'ORD-' + Math.floor(Math.random() * 1000000);
  
    const orderDetails = {
      userId: this._service.getUserId(),
      orderId: orderId,
      customerName: this.customerName,
      phone: this.phone,
      address: this.address,
      paymentMethod: this.paymentMethod,
      items: this.cartItems,
      totalAmount: this.getTotalPrice()
    };
  
    // Lưu đơn hàng vào database
    this._service.saveOrder(orderDetails).subscribe({
      next: () => {
        localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
        localStorage.removeItem('directPurchase');
        this.removeSelectedItemsFromCart();
        this.router.navigate(['/confirmation']);
      },
      error: (err) => console.error('Lỗi khi lưu đơn hàng:', err)
    });
  }
  private removeSelectedItemsFromCart() {
    const userId = this.userId;
    if (!userId) {
      console.error('Không tìm thấy userId. Không thể xóa sản phẩm khỏi giỏ hàng.');
      return;
    }

    this.cartItems.forEach((item) => {
      this._service.removeProductFromCart(userId, item.productId).subscribe({
        next: () => console.log(`Sản phẩm với ID ${item.productId} đã bị xóa khỏi giỏ hàng`),
        error: (err) => console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', err),
      });
    });

    // Xóa các sản phẩm đã chọn khỏi localStorage
    localStorage.removeItem('selectedCartItems');
  }
}
