/**
 * Author: Inventory Management System Team Group 3
 * Date: 07/08/2026
 * File: app.routes.ts
 * Description: This file defines the routes for the Angular application, including routes for inventory management, categories, and suppliers. Each route is associated with a specific component that will be rendered when the route is accessed. The routes are exported as separate arrays for better organization and maintainability.
 */
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { InventoryItemAddComponent } from './Inventory/inventoryItem-add/inventoryItem-add.component';
import { InventoryItemListComponent } from './Inventory/inventory-item-list/inventory-item-list.component';
import { InventoryItemAddComponent } from './inventory/inventory-item-add/inventory-item-add.component';

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
        path: '**',
        redirectTo: ''
    }
];

