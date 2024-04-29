import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './app/pages/dashboard/dashboard.component';
import { ProductsComponent } from './app/pages/products/products.component';
import { ProductDetailComponent } from './app/pages/product-detail/product-detail.component';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'products', component: ProductsComponent },
    { path: 'products/:id', component: ProductDetailComponent },
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
  })
  export class AppRoutingModule {}
