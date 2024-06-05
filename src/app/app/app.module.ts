import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//primeng
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { OrderListModule } from 'primeng/orderlist';
import {PanelMenuModule} from 'primeng/panelmenu'



import { RouterModule } from '@angular/router';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { AppRoutingModule } from '../app.routes';
import { JwtModule } from '@auth0/angular-jwt';

import { ProductComponent } from '../product/product.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProductsComponent } from './pages/products/products.component';
import { AppComponent } from '../app.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { ProducteditComponent } from './pages/productedit/productedit.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { SignupComponent } from './pages/signup/signup.component';
import { OrderListComponent } from '../order-list/order-list.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { SigninComponent } from './pages/signin/signin.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AddItemComponent } from './pages/add-item/add-item.component';
import { CartDropdownComponent } from '../cart-dropdown/cart-dropdown.component';


function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ProductDetailComponent,
    ProductsComponent,
    ProductComponent,
    ProducteditComponent,
    NavbarComponent,
    FooterComponent,
    SignupComponent,
    SigninComponent,
    AddItemComponent,
    OrderListComponent,
    CartDropdownComponent,
    
    AdminDashboardComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    BrowserAnimationsModule,
    //primeng
    ButtonModule,
    AvatarModule,
    SidebarModule,
    TableModule,
    CalendarModule,
    ConfirmPopupModule,
    ToastModule,
    OrderListModule,
    PanelMenuModule,
    // PrimeIcons,
    BadgeModule,

    MatIconModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["example.com"],  // Lista i domini per cui i token sono validi
        disallowedRoutes: ["http://example.com/examplebadroute/"],  // Lista le rotte dove non includere il token
      }
    })
  ],
  providers: [CurrencyPipe, DatePipe, provideAnimationsAsync(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export { AppRoutingModule };
