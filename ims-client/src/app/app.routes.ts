import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { InventoryComponent } from './inventory/inventory.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { CategoriesComponent } from './categories/categories.component';


export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'inventory',
        component: InventoryComponent,
    },
    {
        path: 'suppliers',
        component: SuppliersComponent,
    },
    {
        path: 'categories',
        component: CategoriesComponent,
    },
];



