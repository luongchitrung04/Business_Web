import { RouterModule, Routes } from '@angular/router';
import { FashionComponent } from './fashion/fashion.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductComponent } from './product/product.component';
import { AccessoryComponent } from './accessory/accessory.component';
import { AccessoryDetailsComponent } from './accessory-details/accessory-details.component';
import { NewDetailsComponent } from './new-details/new-details.component';
import { NewComponent } from './new/new.component';
import { SalesComponent } from './sales/sales.component';
import { AboutComponent } from './about/about.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { OrderComponent } from './order/order.component';
import { NgModule } from '@angular/core';
import { SearchComponent } from './search/search.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: FashionComponent },
  { path: 'product', component: ProductComponent },
  { path: 'accessory', component: AccessoryComponent },
  { path: 'new', component: NewComponent },
  { path: 'about', component: AboutComponent },
  { path: 'cart', component: CartComponent },
  { path: 'sales', component: SalesComponent },
  { path: 'search', component: SearchComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'order', component: OrderComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'confirmation', component: ConfirmationComponent },
  { path: 'fashion', component: FashionComponent },
  { path: 'accessory/:id', component: AccessoryDetailsComponent },
  { path: 'product-details/:id', component: ProductDetailsComponent},
  { path: 'accessory-details/:id', component: AccessoryDetailsComponent},
  { path: 'new-details/:id', component: NewDetailsComponent},
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports:[RouterModule.forRoot(routes)],
  exports:[RouterModule]
})
export class AppRoutingModule{}