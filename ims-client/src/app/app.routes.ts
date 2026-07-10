/**
 * Author: Inventory Management System Team Group 3
 * Date: 07/08/2026
 * File: app.routes.ts
 * Description: This file defines the routes for the Angular application, including routes for inventory management, categories, and suppliers. Each route is associated with a specific component that will be rendered when the route is accessed. The routes are exported as separate arrays for better organization and maintainability.
 */
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { InventoryItemListComponent } from './Inventory/inventory-item-list/inventory-item-list.component';
import { InventoryItemAddComponent } from './Inventory/inventory-item-add/inventory-item-add.component';
import { ReadInventoryItemComponent } from './Inventory/inventory-item-read/inventory-item-read.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'inventory-items',
        component: InventoryItemListComponent
    },
    {
        path: 'inventory-items/add',
        component: InventoryItemAddComponent
    },
    {
        path: 'inventory-items/lookup',
        component: ReadInventoryItemComponent
    },
    {
        path: 'inventory-items/:id',
        component: ReadInventoryItemComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];

