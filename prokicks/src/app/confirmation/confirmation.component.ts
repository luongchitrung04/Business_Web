import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {
  orderDetails: any;
  totalAmount: number = 0;
  shippingFee: number = 30000; // Phí vận chuyển mặc định
  discountAmount: number = 0; // Số tiền giảm giá


  constructor(private router: Router) {}

  ngOnInit(): void {
    // Lấy thông tin đơn hàng từ localStorage
    const orderData = localStorage.getItem('orderDetails');
    if (orderData) {
      this.orderDetails = JSON.parse(orderData);
      // Lấy số tiền giảm giá từ đơn hàng (nếu có)
      this.discountAmount = this.orderDetails.discountAmount || 0;
      this.calculateTotal();
    } else {
      // Nếu không có dữ liệu, quay lại trang giỏ hàng
      this.router.navigate(['/cart']);
    }
  }

  calculateTotal() {
    this.totalAmount = this.orderDetails.items.reduce(
      (acc: number, item: any) => acc + item.price * item.quantity,
      0
    );
  
    // Kiểm tra nếu tổng giá trị đơn hàng >= 1 triệu thì miễn phí vận chuyển
    if (this.totalAmount >= 1000000) {
      this.shippingFee = 0;
    }
  }
  
  getTotalPrice(): number {
    return this.totalAmount + this.shippingFee - this.discountAmount;
  }
  
}
