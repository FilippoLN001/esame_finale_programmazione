import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './app/pages/dashboard/dashboard.component';
import { ProductsComponent } from './app/pages/products/products.component';
import { ProductDetailComponent } from './app/pages/product-detail/product-detail.component';
import { SignupComponent } from './app/pages/signup/signup.component';
import { SigninComponent } from '../app/app/pages/signin/signin.component'  
import { AuthGuard } from './auth/auth.guard';
import { AdminDashboardComponent } from './app/pages/admin-dashboard/admin-dashboard.component';
import { AccesDeniedComponent } from './app/pages/acces-denied/acces-denied.component';
import { NotFoundComponent } from './app/pages/not-found/not-found.component';
import { ProducteditComponent } from './app/pages/productedit/productedit.component';


export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent }, //pagina iniziale
    { path: 'signup', component: SignupComponent }, //pagina di registrazione
    { path: 'login', component: SigninComponent }, //pagina di login
    { path: 'products', component: ProductsComponent}, //pagina dei prodotti
    { path: 'products/:id', component: ProductDetailComponent, canActivate: [AuthGuard] }, //visializzazione del prodotto specifico solo se si e' autenticato
    { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard], data: { role: 'Admin' }}, //pagina di accesso solo admin
    { path: 'edit-product/:id', component: ProducteditComponent,canActivate: [AuthGuard], data: { role: 'Admin' } },
    { path: 'access-denied', component: AccesDeniedComponent },  // Rotta per l'accesso negato
    { path: 'not-found', component: NotFoundComponent },  // Rotta per pagina non trovata
    { path: '**', redirectTo: '/not-found' }  // Wildcard route per una navigazione non definita
];


@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}
