/**
 * Author: Aisha Keller
 * Date: 07/08/2026
 * File: app.routes.ts
 * Description: This file defines the routes for the Angular application, including routes for inventory management, categories, and suppliers. Each route is associated with a specific component that will be rendered when the route is accessed. The routes are exported as separate arrays for better organization and maintainability.
 */
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CategoriesComponent } from './categories/categories.component';
import { InventoryManagementComponent } from './inventory/inventory-management/inventory-management.component';
import { suppliersComponent } from './suppliers/suppliers.component';
import { InventoryItemAddComponent } from './inventory/inventoryItem-add/inventoryItem-add.component';


// Export inventory-management routes
export const inventoryManagementRoutes: Routes = [
    {
        path: '',
        redirectTo: 'inventory-management',
        pathMatch: 'full'
    },
    {
        path: 'inventory-management',
        component: InventoryManagementComponent,
    },

    // Path for adding a new inventory item Sprint 1 Week 6
    {
        path: 'inventory/add',
        component: InventoryItemAddComponent,
    },

    // Add more inventory management routes here as needed
];

// Export categories routes
export const categoriesRoutes: Routes = [
    {
        path: '',
        redirectTo: 'categories',
        pathMatch: 'full'
    },
    {
        path: 'categories',
        component: CategoriesComponent,
    },

    // Add more categories routes here as needed
];

// Export suppliers routes
export const suppliersRoutes: Routes = [
    {
        path: '',
        redirectTo: 'suppliers',
        pathMatch: 'full'
    },
    {  
        path: 'suppliers',
        component: suppliersComponent,
    },

    // Add more suppliers routes here as needed
];

