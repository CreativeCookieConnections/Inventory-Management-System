import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { InventoryItemAddComponent } from './inventory-add/inventory-item-add.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'inventory/add',
        component: InventoryItemAddComponent,
    }
];



