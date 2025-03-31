import { Component, OnInit } from '@angular/core';
import { ExampleService } from '../services/example.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  user: any = {
    firstname: '',
    lastname: '',
    email: '',
    address: '',
    phonenumber: ''
  };
  userId: string = '';
  isEditing: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  
  constructor(private _service: ExampleService) {
    this.userId = localStorage.getItem('userId') || '';
  }
  ngOnInit(): void {
      this.loadUserProfile();
  }
  loadUserProfile() {
    const storedUser = this._service.getUser();
    if (storedUser) {
      this.user = storedUser;
    } else {
      const userId = this._service.getUserId();
      if (userId) {
        this._service.getUserProfile(userId).subscribe({
          next: (data) => {
            this.user = data;
            localStorage.setItem('user', JSON.stringify(data));
          },
          error: (err) => {
            this.errorMessage = 'Lỗi khi lấy thông tin người dùng';
            console.error(err);
          }
        });
      }
    }
  }


  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.successMessage = '';
      this.errorMessage = '';
    }
  }

  updateProfile() {
    const userId = this._service.getUserId();
    if (!userId) {
        this.errorMessage = 'Không tìm thấy người dùng';
        console.error('Không tìm thấy userId trong localStorage');
        return;
    }

    console.log('Cập nhật thông tin với userId:', userId);
    console.log('Dữ liệu cập nhật:', this.user);

    this._service.updateUserProfile(userId, this.user).subscribe({
        next: (response) => {
            this.successMessage = 'Cập nhật thành công!';
            this.isEditing = false;
            console.log('Phản hồi từ server:', response);
        },
        error: (err) => {
            this.errorMessage = 'Cập nhật thất bại';
            console.error('Lỗi khi cập nhật:', err);
        }
    });
}


}
