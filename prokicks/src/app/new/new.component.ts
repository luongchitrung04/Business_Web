import { Component, OnInit } from '@angular/core';
import { ExampleService } from '../services/example.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './new.component.html',
  styleUrl: './new.component.css'
})
export class NewComponent implements OnInit{
  news: any[] = [];
  paginatedNews: any[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  pages: number[] = [];
  sortOrder = 'default';
  selectedId: any;

  constructor(private _service: ExampleService,private router: Router,private activate: ActivatedRoute){}

  ngOnInit(): void {
    this._service.getAllNews().subscribe({
      next: (data) => {
        this.news = data;
        this.updatePagination();
      },
      error: (err) => console.error(err)
    });
    this.activate.paramMap.subscribe((param) => {
      let id = param.get('id');
      if (id != null) this.selectedId = parseInt(id);
    });
    
  }
  goToNewDetails(id: string): void {
    if (id) {
      this.router.navigate(['/new-details', id]); // Điều hướng đến chi tiết sản phẩm
    } else {
      console.error('Invalid new ID:', id);
    }
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.news.length / this.itemsPerPage);

    const pageWindow = 2; // Số trang hiển thị xung quanh trang hiện tại
    const startPage = Math.max(1, this.currentPage - pageWindow);
    const endPage = Math.min(this.totalPages, this.currentPage + pageWindow);

    this.pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    this.paginatedNews = this.news.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
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


}
