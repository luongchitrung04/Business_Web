import { Component } from '@angular/core';
import { ExampleService } from '../services/example.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private _service: ExampleService, private router: Router, private location: Location) {}

  login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Vui lòng điền đầy đủ thông tin';
      return;
    }
  
    const user = { email: this.email.trim(), password: this.password };
    this._service.login(user).subscribe({
      next: (response) => {
        // console.log('Đăng nhập thành công', response);
        this.goBack(); // Chỉ gọi goBack khi đăng nhập thành công
        // alert('Đăng nhập thành công!');

        // Điều hướng đến trang mong muốn sau khi đăng nhập thành công
        // const redirectUrl = this._service.getRedirectUrl();
        // this._service.clearRedirectUrl();
        // this.router.navigate([redirectUrl]);
      },
      error: (err: Error) => {
        console.error('Lỗi đăng nhập:', err.message);
        this.errorMessage = err.message; // Hiển thị thông báo lỗi từ service
      },
    });
  }
  goBack(): void {
    const redirectUrl = this._service.getRedirectUrl();
    if (redirectUrl && redirectUrl !== '/login') {
      this.router.navigate([redirectUrl]); // Điều hướng đến URL đã lưu trước đó
      this._service.clearRedirectUrl(); // Xóa redirectUrl sau khi sử dụng
    } else {
      this.router.navigate(['/home']); // Nếu không có URL lưu trữ, điều hướng về trang chủ
    }
  }
  
  

}