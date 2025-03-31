import { Component, OnInit } from '@angular/core';
import { ExampleService } from '../services/example.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit {
  userId: string | null = null;
  orders: any[] = [];
  filteredOrders: any = {
    'Chờ xác nhận': [],
    'Chờ giao hàng': [],
    'Đã giao': [],
    'Đã hủy': []
  };
  selectedTab: string = 'Chờ xác nhận';
  

  constructor(private _service: ExampleService, private router : Router){}
  ngOnInit(): void {
    this.userId = this._service.getUserId();
    if (this.userId) {
      this._service.getUserOrders(this.userId).subscribe({
        next: (orders) => {
          this.orders = orders;
          this.filterOrders();
        },
        error: (err) => console.error('Lỗi khi tải danh sách đơn hàng:', err)
      });
    }
  }
  filterOrders() {
    // Sắp xếp đơn hàng theo ngày gần nhất (giảm dần)
    this.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    this.filteredOrders = {
      'Chờ xác nhận': this.orders.filter(order => order.status === 'Chờ xác nhận'),
      'Chờ giao hàng': this.orders.filter(order => order.status === 'Chờ giao hàng'),
      'Đã giao': this.orders.filter(order => order.status === 'Đã giao'),
      'Đã hủy': this.orders.filter(order => order.status === 'Đã hủy')
    };
  }
  cancelOrder(orderId: string) {
    if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      this._service.cancelOrder(orderId).subscribe({
        next: () => {
          alert('Đơn hàng đã được hủy thành công.');
          this.orders = this.orders.map(order =>
            order.orderId === orderId ? { ...order, status: 'Đã hủy' } : order
          );
          this.filterOrders();
        },
        error: (err) => console.error('Lỗi khi hủy đơn hàng:', err)
      });
    }
  }
  selectTab(tab: string) {
    this.selectedTab = tab;
  }
  goToDetails(item: any): void {
    if (item && item.productId) {
      if (item.type && item.type.toLowerCase() === 'giày') {
        // Nếu là giày thì điều hướng đến product-details
        this.router.navigate(['/product-details', item.productId]);
      } else {
        // Nếu không phải giày thì điều hướng đến accessory-details
        this.router.navigate(['/accessory-details', item.productId]);
      }
    } else {
      console.error('Invalid item or missing productId:', item);
    }
  }
  reorder(order: any) {
    if (!order) return;
    localStorage.removeItem('reorderDetails');
    localStorage.removeItem('directPurchase');
    
    // Lưu thông tin đơn hàng vào localStorage
    const reorderItems = order.items.map((item: any) => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      selectedSize: item.selectedSize,
      image: item.image,
      type: item.type
    }));
  
    const reorderDetails = {
      customerName: order.customerName,
      phone: order.phone,
      address: order.address,
      paymentMethod: order.paymentMethod,
      items: reorderItems
    };
  
    // Chuyển thông tin mua lại sang trang checkout
    localStorage.setItem('reorderDetails', JSON.stringify(reorderDetails));
    this.router.navigate(['/checkout']);
  }
  
  

}
