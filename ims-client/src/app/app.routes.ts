import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { InventoryItemAddComponent } from './inventory/inventoryItem-add/inventoryItem-add.component';


export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    
    // Route to create form for adding a new inventory item
    {
        path: 'inventory/add',
        component: InventoryItemAddComponent,
    },

    // add more routes here as needed
];



