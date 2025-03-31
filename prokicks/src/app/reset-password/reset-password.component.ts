import { Component } from '@angular/core';
import { ExampleService } from '../services/example.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  email: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private _service: ExampleService, private router: Router){}

  sendResetLink() {
    if (!this.email.trim()) {
      this.errorMessage = 'Vui lòng nhập email';
      return;
    }

    this._service.sendPasswordResetEmail(this.email.trim()).subscribe({
      next: () => {
        this.successMessage = 'Liên kết khôi phục mật khẩu đã được gửi tới email của bạn.';
        this.errorMessage = '';
      },
      error: (err) => {
        console.error('Lỗi khôi phục mật khẩu:', err);
        this.successMessage = '';
        if (err.status === 404) {
          this.errorMessage = 'Email không tồn tại trong hệ thống';
        } else {
          this.errorMessage = 'Đã xảy ra lỗi, vui lòng thử lại';
        }
      },
    });
  }

}
