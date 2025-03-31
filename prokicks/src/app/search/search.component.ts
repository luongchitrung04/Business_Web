import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExampleService } from '../services/example.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit{
  searchQuery: string = '';
  filteredProducts: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _service: ExampleService
  ){}
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      if (this.searchQuery) {
        this.searchProducts();
      }
    });
  }
  searchProducts() {
    this._service.searchProducts(this.searchQuery).subscribe({
      next: (data) => {
        this.filteredProducts = data;
      },
      error: (err) => console.error('Error fetching search results:', err)
    });
  }

  goToDetails(item: any): void {
    if (item.type && item.type.toLowerCase() === 'giày') {
      // Nếu là giày thì điều hướng đến product-details
      this.router.navigate(['/product-details', item._id]);
    } else {
      // Nếu không phải giày thì điều hướng đến accessory-details
      this.router.navigate(['/accessory-details', item._id]);
    }
  }
  

}
