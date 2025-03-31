import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ExampleService } from '../services/example.service';

@Component({
  selector: 'app-new-details',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './new-details.component.html',
  styleUrl: './new-details.component.css'
})
export class NewDetailsComponent implements OnInit{
  selectedNew: any; // Lưu thông tin sản phẩm
  newId: string | null = null;
  relatedNews: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _service: ExampleService,
    private location: Location
  ){}
  ngOnInit(): void {
      this.route.paramMap.subscribe((params)=>
      {
        this.newId = params.get('id');
        if (this.newId){
          this._service.getNewById(this.newId).subscribe({
            next:(data)=>{
              this.selectedNew = data;
               // Lấy các bài viết liên quan
          this._service.getRelatedNews(this.selectedNew._id).subscribe({
            next: (related) => {
              this.relatedNews = related;
            },
            error: (err) => {
              console.error('Error fetching related news:', err);
            }
          });
            },
            error: (err) => {
              console.error('Error fetching new details:', err);
            },
          });
        } else{
          console.error('New ID is missing!')
        }
      });
  }
  goToNewDetails(id: string): void {
    if (id) {
      this.router.navigate(['/new-details', id]); // Điều hướng đến chi tiết accessories
    } else {
      console.error('Invalid accessory ID:', id);
    }
  }
  goBack(): void {
    this.location.back();
  }
}
