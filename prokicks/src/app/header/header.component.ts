import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ExampleService } from '../services/example.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,CommonModule,FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  isLoggedIn: boolean = false;
  userName: string = '';
  showDropdown: boolean = false; // Thêm dòng này
  searchQuery: string = '';

  isNavbarActive: boolean = false;
  
  constructor(private router: Router, private _service:ExampleService){}
  ngOnInit(): void {
    this._service.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      const user = this._service.getUser();
      console.log("User data:", user);
      if (user) {
          this.userName = user.email;
      } else {
          this.userName = '';
      }
  });
  
  }
  logout() {
    this._service.logout();
    this.router.navigate(['/login']);
  }
  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
    }
  }
  toggleNavbar() {
    this.isNavbarActive = !this.isNavbarActive;
    console.log('Navbar toggled:', this.isNavbarActive); // Log trạng thái navbar
  }
  
  closeNavbar() {
    // Đóng navbar khi menu được chọn
    this.isNavbarActive = false;
  }
  


}
