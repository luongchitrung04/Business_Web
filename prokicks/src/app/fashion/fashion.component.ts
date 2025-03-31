import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ExampleService } from '../services/example.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-fashion',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './fashion.component.html',
  styleUrls: ['./fashion.component.css']
})
export class FashionComponent implements OnInit, AfterViewInit {
  shoes: any[] = [];
  accessories: any[] = [];
  news: any[] = [];
  selectedId: any;
  discountedShoes: any[] = []; 
  filteredShoes: any[] = [];
  activeTab: string = 'all'; // Tab hiện tại
  
  currentIndex: number = 0;
  images: string[] = [
    './assets/image1.jpg',
    './assets/image2.jpg',
    './assets/image3.jpg',
  ];
  


  // ViewChild cho slider thứ nhất
  @ViewChild('carousel') carousel!: ElementRef;
  // ViewChild cho slider thứ hai
  @ViewChild('carousel2') carousel2!: ElementRef;

  @ViewChild('carousel3') carousel3!: ElementRef;
  @ViewChild('carousel4') carousel4!: ElementRef;

  constructor(private _service: ExampleService,
    private router: Router,
    private activate: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this._service.getAllShoes().subscribe({
      next: (data) => {this.shoes = data;
        this.filterShoes(); // Lọc giày mặc định

      },
      error: (err) => console.error('Error fetching shoes:', err),
    });

    this._service.getAllAccessories().subscribe({
      next: (data) => (this.accessories = data),
      error: (err) => console.error('Error fetching accessories:', err),
    });
    this._service.getAllNews().subscribe({
      next: (data) => (this.news = data),
      error: (err) => console.error('Error fetching news:', err),
    });
    this._service.getDiscountedShoes().subscribe({
      next: (data) => (this.discountedShoes=data),
      error: (err) => console.error('Error fetching discounted shoes:',err),
    })
    this.activate.paramMap.subscribe((param) => {
      let id = param.get('id');
      if (id != null) this.selectedId = parseInt(id);
    });
  }
  goToProductDetails(id: string): void {
    if (id) {
      this.router.navigate(['/product-details', id]); // Điều hướng đến chi tiết sản phẩm
    } else {
      console.error('Invalid product ID:', id);
    }
  }
  goToAccessoryDetails(id: string): void {
    if (id) {
      this.router.navigate(['/accessory-details', id]); // Điều hướng đến chi tiết accessories
    } else {
      console.error('Invalid accessory ID:', id);
    }
  }
  goToNewDetails(id: string): void {
    if (id) {
      this.router.navigate(['/new-details', id]); // Điều hướng đến chi tiết accessories
    } else {
      console.error('Invalid accessory ID:', id);
    }
  }
  changeTab(tab: string): void {
    this.activeTab = tab;
    this.filterShoes(); // Lọc giày theo tab
  }
  filterShoes(): void {
    if (this.activeTab === 'all') {
      // Hiển thị tất cả giày, sắp xếp theo ngày mới nhất
      this.filteredShoes = [...this.shoes].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    } else if (this.activeTab === 'new') {
      // Lọc giày mới về, sắp xếp theo ngày mới nhất
      this.filteredShoes = [...this.shoes]
        .sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        })
        .slice(0, 10); // Lấy 10 sản phẩm mới nhất
    } else {
      // Lọc giày theo category
      let category = '';
      if (this.activeTab === 'new') category = 'Hàng mới về';
      else if (this.activeTab === 'synthetic') category = 'giày sân nhân tạo';
      else if (this.activeTab === 'natural') category = 'giày sân tự nhiên';
      else if (this.activeTab === 'futsal') category = 'giày futsal';
      this.filteredShoes = this.shoes
      .filter((shoe) => shoe.category === category)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  }
  


  ngAfterViewInit(): void { }

  // Điều khiển slider thứ nhất
  nextSlide() {
    if (this.carousel) {
      this.carousel.nativeElement.scrollLeft += 300;
    }
  }

  previousSlide() {
    if (this.carousel) {
      this.carousel.nativeElement.scrollLeft -= 300;
    }
  }

  // Điều khiển slider thứ hai
  nextSlide2() {
    if (this.carousel2) {
      this.carousel2.nativeElement.scrollLeft += 300;
    }
  }

  previousSlide2() {
    if (this.carousel2) {
      this.carousel2.nativeElement.scrollLeft -= 300;
    }
  }
  nextSlide3() {
    if (this.carousel3) {
      this.carousel3.nativeElement.scrollLeft += 300;
    }
  }

  previousSlide3() {
    if (this.carousel3) {
      this.carousel3.nativeElement.scrollLeft -= 300;
    }
  }
  nextSlide4() {
    if (this.carousel4) {
      this.carousel4.nativeElement.scrollLeft += 300;
    }
  }

  previousSlide4() {
    if (this.carousel4) {
      this.carousel4.nativeElement.scrollLeft -= 300;
    }
  }

  // Điều khiển hình ảnh
  nextImage(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prevImage(): void {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }
  
}
