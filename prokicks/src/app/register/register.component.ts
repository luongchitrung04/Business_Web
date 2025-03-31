import { Component, OnInit } from '@angular/core';
import { ExampleService } from '../services/example.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule,HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  data: any;
  firstname: string = '';
  lastname: string = '';
  password: string = '';
  confirmPassword: string = '';
  email: string = '';
  submitting: boolean = false;
  registrationSuccess: boolean = false;

  constructor(private _server: ExampleService, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  Submit() {
    if (!this.firstname || !this.lastname || !this.email || !this.password || !this.confirmPassword) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (!this.email.endsWith('@gmail.com')) {
      alert("Email không đúng định dạng.");
      return;
    }

    if (this.password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert("Mật khẩu không khớp.");
      return;
    }

    const newUser = {
      firstname: this.firstname,
      lastname: this.lastname,
      password: this.password,
      email: this.email
    };

    this._server.getSubmit(newUser).subscribe({
      next: (data) => {
        alert("Đăng ký thành công!");
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Lỗi khi đăng ký:', err);
        alert("Đăng ký không thành công. Vui lòng thử lại.");
      }
    });
  }

  loadUsers() {
    this._server.getUsers().subscribe({
      next: (data) => {
        this.data = data;
      },
      error: (err) => {
        console.error('Lỗi khi tải người dùng:', err);
      }
    });
  }
}
