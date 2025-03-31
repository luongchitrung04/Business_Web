import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError, tap, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ExampleService {
  todoApiUrl: string = 'https://jsonplaceholder.typicode.com/todos';
  productApiUrl: string = 'https://fakestoreapi.com/products';
  phoneApiUrl: string = 'https://dummyjson.com/products/category/smartphones';
  myApiUrl: string = 'https://dummyjson.com/products/category/smartphones'
  private cart: any[] = []; // Giỏ hàng được lưu trữ trong mảng
  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());
  isLoggedIn$ = this.loggedIn.asObservable();


  constructor(private _http: HttpClient, private router: Router) { }



  getAllProduct(): Observable<any> {
    return this._http.get<any>(this.productApiUrl);
  }

  getAllPhones(): Observable<any> {
    return this._http
      .get<any>(this.phoneApiUrl)
      .pipe(retry(2), catchError(this.handleError));
  }


  handleError(err: HttpErrorResponse) {
    return throwError(() => new Error(err.message));
  }

  getBeerList(): Observable<any> {
    return this._http
      .get(this.myAPI + 'products')
      .pipe(retry(2), catchError(this.handleError));
  }

  myAPI: string = 'http://localhost:3000';
  getSubmit(newUser: any): Observable<any> {
    return this._http.post(`${this.myAPI}/users`, newUser).pipe(
      catchError(this.handleError)
    );
  }


  // Lấy danh sách người dùng
  getUsers(): Observable<any> {
    return this._http.get(`${this.myAPI}/users`).pipe(
      catchError(this.handleError)
    );
  }
  // Phương thức đăng nhập
  login(user: any): Observable<any> {
    return this._http.post(`${this.myAPI}/login`, user).pipe(
        tap((response: any) => {
            if (response.token && response.userId) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('userId', response.userId);
                this.getUserProfile(response.userId).subscribe(userData => {
                    console.log("Lưu thông tin người dùng:", userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                });
                this.loggedIn.next(true);
                // Lấy redirectUrl hoặc gán mặc định là '/home'
                // const redirectUrl = this.getRedirectUrl();
                // this.clearRedirectUrl(); // Xóa redirectUrl sau khi sử dụng
                // this.router.navigate([redirectUrl]); // Điều hướng đến trang trước đó

            }
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
              // Lỗi xác thực (Email hoặc mật khẩu sai)
              console.error('Lỗi đăng nhập: Email hoặc mật khẩu không chính xác');
              return throwError(() => new Error('Email hoặc mật khẩu không chính xác'));
          } else if (error.status === 404) {
              // Người dùng không tồn tại
              console.error('Lỗi đăng nhập: Người dùng không tồn tại');
              return throwError(() => new Error('Người dùng không tồn tại'));
          } else {
              // Các lỗi khác
              console.error('Lỗi server:', error.message);
              return throwError(() => new Error('Lỗi server, vui lòng thử lại sau.'));
          }
      })
    );
}
  setRedirectUrl(currentUrl: string): void {
    if (!this.isLoggedIn() && currentUrl !== '/login') { // Chỉ đặt khi chưa đăng nhập
      localStorage.setItem('redirectUrl', currentUrl);
    }
  }


  getRedirectUrl(): string {
    return localStorage.getItem('redirectUrl') || '/home';
  }

  clearRedirectUrl(): void {
    localStorage.removeItem('redirectUrl');
  }

  // Quên mật khẩu
  sendPasswordResetEmail(email: string): Observable<any> {
    return this._http.post(`${this.myAPI}/password-reset`, { email }).pipe(
      catchError(this.handleError)
    );
  }
  

  saveUserData(token: string, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
  }
  getUserId(): string | null {
    return localStorage.getItem('userId');
  }


  getToken(): string | null {
    return localStorage.getItem('token');
  }
  // Kiểm tra trạng thái đăng nhập

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  // Phương thức đăng xuất

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.loggedIn.next(false); // Cập nhật trạng thái đăng xuất
  }
  getUser(): any {
    try {
      const user = localStorage.getItem('user');
      if (user && user !== 'undefined' && user !== 'null') {
        return JSON.parse(user);
      } else {
        console.warn('Dữ liệu người dùng không hợp lệ trong localStorage');
        return null;
      }
    } catch (error) {
      console.error("Lỗi khi parse JSON từ localStorage:", error);
      return null;
    }
  }


  getUserProfile(userId: string): Observable<any> {
    return this._http.get(`${this.myAPI}/users/${userId}`).pipe(
      catchError(this.handleError)
    );
  }

  updateUserProfile(userId: string, userData: any): Observable<any> {
    const url = `${this.myAPI}/users/${userId}`;
    console.log('Đang gửi yêu cầu cập nhật tới:', url);
    console.log('Dữ liệu gửi:', userData);

    return this._http.patch(url, userData).pipe(
        tap(() => console.log('Yêu cầu cập nhật đã gửi:', userData)),
        catchError(this.handleError)
    );
  }
  // Thêm phương thức lưu đơn hàng
  saveOrder(orderData: any): Observable<any> {
    return this._http.post(`${this.myAPI}/orders`, orderData).pipe(
      catchError(this.handleError)
    );
  }

  // Thêm phương thức lấy lịch sử đơn hàng của người dùng
  getUserOrders(userId: string): Observable<any> {
    return this._http.get(`${this.myAPI}/orders/${userId}`).pipe(
      catchError(this.handleError)
    );
  }
  // hủy đơn hàng
  cancelOrder(orderId: string) {
    return this._http.patch(`${this.myAPI}/orders/cancel/${orderId}`, {});
  }
  

// 2 cách chèn biến id vào hàm như sau
updateProduct(product: any): Observable<any> {
  return this._http.patch(`${this.myAPI}/product/${product._id}`, product);
}


  getDiscountedShoes(): Observable<any[]> {
    return this._http.get<any[]>(`${this.myAPI}/shoes/discount`);
  }
  getAllShoes(): Observable<any> {
    return this._http.get<any>(`${this.myAPI}/shoes`)
      .pipe(retry(2), catchError(this.handleError));
  }
  getShoeById(id: string) {
    return this._http.get(`${this.myAPI}/shoes/${id}`);
  }
  // Thêm sản phẩm vào giỏ hàng trong database
  addToCart(userId: string, product: any): Observable<any> {
    return this.getUserCart(userId).pipe(
      tap((cart: any[]) => {
        const existingProductIndex = cart.findIndex(
          (item) =>
            item.productId === product.productId &&
            item.selectedSize === product.selectedSize
        );
  
        if (existingProductIndex !== -1) {
          // Nếu sản phẩm đã tồn tại, tăng số lượng
          cart[existingProductIndex].quantity += product.quantity;
        } else {
          // Nếu sản phẩm chưa tồn tại, thêm sản phẩm mới
          cart.push(product);
        }
  
        // Cập nhật lại giỏ hàng trong cơ sở dữ liệu
        this.updateUserCart(userId, cart).subscribe({
          next: () => console.log('Giỏ hàng đã được cập nhật trên server'),
          error: (err) => console.error('Lỗi khi cập nhật giỏ hàng:', err),
        });
      })
    );
  }
  
  
  getUserCart(userId: string): Observable<any> {
    return this._http.get(`${this.myAPI}/cart/${userId}`).pipe(
      catchError(this.handleError)
    );
  }
  updateUserCart(userId: string, cart: any[]): Observable<any> {
    return this._http.post(`${this.myAPI}/cart/${userId}`, { cart }).pipe(
      catchError(this.handleError)
    );
  } 

  // Lấy giỏ hàng từ bộ nhớ tạm thời
  getCartItems() {
    return this.cart;
  }

  // Xóa sản phẩm khỏi giỏ hàng
  removeProductFromCart(userId: string, productId: string): Observable<any> {
    const url = `${this.myAPI}/cart/${userId}/${productId}`;
    console.log(`Sending DELETE request to: ${url}`);
    return this._http.delete(url).pipe(
      catchError(this.handleError)
    );
  }
  

  // Xóa toàn bộ giỏ hàng
  clearCart(): void {
    this.cart = [];
  }
  clearCartInDatabase(userId: string): Observable<any> {
    return this._http.post(`${this.myAPI}/cart/${userId}`, { cart: [] }).pipe(
      tap(() => console.log('Giỏ hàng đã được xóa')),
      catchError(this.handleError)
    );
  }
  
  // tìm kiếm sản phẩm 
  // Tìm kiếm sản phẩm
  searchProducts(query: string): Observable<any[]> {
    return this._http.get<any[]>(`${this.myAPI}/api/products/search?q=${query}`).pipe(
      catchError(this.handleError)
    );
  }
  // lấy sản phẩm có liên quan theo brand
  getRelatedProductsByBrand(brand: string, excludeId: string): Observable<any[]> {
    return this._http.get<any[]>(`${this.myAPI}/products/related/${brand}/${excludeId}`);
}
  // lấy phụ kiện theo type
  getRelatedAccessoriesByType(type: string, excludeId: string): Observable<any[]> {
    return this._http.get<any[]>(`${this.myAPI}/accessories/related/${type}/${excludeId}`);
  }
  // lấy news mới nhất 
  getRelatedNews(excludeId: string): Observable<any[]> {
    return this._http.get<any[]>(`${this.myAPI}/news/latest/${excludeId}`);
  }
  

  getAllAccessories(): Observable<any> {
    return this._http.get<any>(`${this.myAPI}/accessories`)
      .pipe(retry(2), catchError(this.handleError));
  }
  getAccessoryById(id: string) {
    return this._http.get<any>(`${this.myAPI}/accessories/${id}`);  // Cập nhật URL API của bạn
  }

  getAllNews(): Observable<any> {
    return this._http.get<any>(`${this.myAPI}/news`)
      .pipe(retry(2), catchError(this.handleError));
  }
  getNewById(id: string) {
    return this._http.get(`${this.myAPI}/news/${id}`); // Sửa đường dẫn API nếu cần
  }


  getAllProducts(): Observable<any> {
    return this._http.get<any>(`${this.myAPI}/products`)
      .pipe(retry(2), catchError(this.handleError));
  }

  addProduct(product: any): Observable<any> {
    return this._http.post(`${this.myAPI}/product`, product);
  }

  // Phương thức xóa sản phẩm

  deleteProduct(id: string): Observable<any> {
    return this._http.delete(`${this.myAPI}/product/${id}`); // Đảm bảo rằng myAPI trỏ đến đúng địa chỉ
  }
  
}