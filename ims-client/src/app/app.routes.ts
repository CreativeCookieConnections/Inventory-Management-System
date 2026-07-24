/**
 * Author: Inventory Management System Team Group 3
 * Date: 07/08/2026
 * File: app.routes.ts
 * Description: This file defines the routes for the Angular application, including routes for inventory management, categories, and suppliers. Each route is associated with a specific component that will be rendered when the route is accessed. The routes are exported as separate arrays for better organization and maintainability.
 */
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { InventoryItemListComponent } from './inventory/inventory-item-list/inventory-item-list.component';
import { InventoryItemAddComponent } from './inventory/inventory-item-add/inventory-item-add.component';
import { ReadInventoryItemComponent } from './inventory/inventory-item-read/inventory-item-read.component';
import { InventoryItemUpdateComponent } from './inventory/inventory-item-update/inventory-item-update.component';
import { InventoryItemDeleteComponent } from './inventory/inventory-item-delete/inventory-item-delete.component';
import { InventoryItemSearchComponent } from './Inventory/inventory-item-search/inventory-item-search.component';
import { SupplierListComponent } from './Suppliers/supplier-list/supplier-list.component';
import { ReadSupplierComponent } from './Suppliers/supplier-read/supplier-read.component';
import { SupplierAddComponent } from './Suppliers/supplier-add/supplier-add.component';

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
        path: 'inventory-items/:id/delete',
        component: InventoryItemDeleteComponent
    },
    {
        path: 'inventory-items/search',
        component: InventoryItemSearchComponent
    },
    {
        path: 'inventory-items/:id',
        component: ReadInventoryItemComponent
    },
    {
        path: 'inventory-items/:id/edit',
        component: InventoryItemUpdateComponent
    },
    {
        path: 'suppliers',
        component: SupplierListComponent
    },
    {
        path: 'suppliers/add',
        component: SupplierAddComponent
    },
    {
        path: 'suppliers/lookup',
        component: ReadSupplierComponent
    },
    {
        path: 'suppliers/:id',
        component: ReadSupplierComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];

