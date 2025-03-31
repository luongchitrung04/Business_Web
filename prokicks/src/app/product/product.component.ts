import { Component, OnInit } from '@angular/core';
import { ExampleService } from '../services/example.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = []; // Thêm mảng này để lưu danh sách sản phẩm đã lọc
  displayedProducts: any[] = [];
  // paginatedProducts: any[] = [];
  currentPage = 1;
  itemsPerPage = 32;
  totalPages = 1;
  pages: number[] = [];
  sortOrder = 'default';
  selectedId: any;
  filters: any = {
    brand: null,
    price: null,
    color: null,
    category: null
  };

  constructor(private _service: ExampleService, private router: Router, private activate: ActivatedRoute) {}

  ngOnInit(): void {
    this._service.getAllShoes().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = this.products;
        this.updatePagination();
        this.updateDisplayedProducts(); 
      },
      error: (err) => console.error(err)
    });
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
  applyFilter(filter: { type: string; value: any }) {
    this.filters[filter.type] = filter.value || null;
    this.filterProducts();
  }
  onCheckboxChange(event: Event, type: string, value: any) {
    const checkbox = event.target as HTMLInputElement;
    this.applyFilter({ type, value: checkbox.checked ? value : null });
  }
  filterProducts() {
    this.filteredProducts = this.products.filter(product => {
      // Tính giá cuối cùng sau khi giảm giá (nếu có)
      const finalPrice = product.discount 
      ? product.price - (product.price * product.discount / 100) 
      : product.price;
      // Lọc theo thương hiệu
      if (this.filters.brand && product.brand !== this.filters.brand) {
        return false;
      }
      if (this.filters.category && product.category !== this.filters.category) {
        return false;
      }
      // Lọc theo mức giá
      if (this.filters.price) {
        const { min, max } = this.filters.price;
        if (finalPrice < min || finalPrice > max) {
          return false;
        }
      }
      // Lọc theo màu sắc
      if (this.filters.color && product.color !== this.filters.color) {
        return false;
      }
      return true;
    });
  
    // Sau khi lọc, cập nhật lại phân trang và danh sách hiển thị
    this.currentPage = 1;
    this.updatePagination();
    this.updateDisplayedProducts();
  }
  
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  
    const pageWindow = 2;
    const startPage = Math.max(1, this.currentPage - pageWindow);
    const endPage = Math.min(this.totalPages, this.currentPage + pageWindow);
  
    this.pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    this.updateDisplayedProducts();
  }
  
  updateDisplayedProducts(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedProducts = this.filteredProducts.slice(start, end);
  }
  

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }
  changePage(page: any): void {
    if (page === 'first') {
      this.currentPage = 1;
    } else if (page === 'prev') {
      this.currentPage = Math.max(1, this.currentPage - 1);
    } else if (page === 'next') {
      this.currentPage = Math.min(this.pages.length, this.currentPage + 1);
    } else if (page === 'last') {
      this.currentPage = this.pages.length;
    } else {
      this.currentPage = page;
    }
    this.updateDisplayedProducts();
  }
  sortProducts(event: Event): void {
    const criteria = (event.target as HTMLSelectElement).value;
  
    switch (criteria) {
      case 'newest':
        this.filteredProducts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'oldest':
        this.filteredProducts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'name-asc':
        this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        this.filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      default:
        this.filteredProducts = [...this.products]; // Trở lại danh sách ban đầu
        break;
    }
  
    // Cập nhật lại danh sách hiển thị và phân trang sau khi sắp xếp
    this.updatePagination();
    this.updateDisplayedProducts();
  }
  

  // sortProducts() {
  //   if (this.sortOrder === 'name-asc') {
  //     this.products.sort((a, b) => a.name.localeCompare(b.name));
  //   } else if (this.sortOrder === 'name-desc') {
  //     this.products.sort((a, b) => b.name.localeCompare(a.name));
  //   } else if (this.sortOrder === 'newest') {
  //     this.products.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  //   } else if (this.sortOrder === 'oldest') {
  //     this.products.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  //   }
  //   this.updatePagination();
  // }
}
