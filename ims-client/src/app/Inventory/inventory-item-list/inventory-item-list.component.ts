/**
 * Author: Nicholas Skelton
 * Date: 07/09/2026
 * File: inventory-item-list.component.ts
 * Description: This file defines the InventoryItemListComponent, which fetches
 * and displays all inventory items. Acts as the functional "home" for the
 * Inventory feature — provides links to Create, View, Edit, and Delete for
 * each item, per the project sitemap.
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface InventoryItem {
  _id: string;
  categoryId: number;
  supplierId: number;
  name: string;
  description: string;
  quantity: number;
  price: number;
}

@Component({
  selector: 'app-inventoryitem-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="inventory-list">
      <div class="inventory-list__header">
        <h2>Inventory Items</h2>
        <a class="btn btn--primary" routerLink="/inventory-items/add">+ Create Item</a>
      </div>

      <p *ngIf="isLoading">Loading inventory items...</p>
      <p *ngIf="errorMessage" class="error">{{ errorMessage }}</p>
      <p *ngIf="!isLoading && !errorMessage && items.length === 0">
        No inventory items found.
      </p>

      <table class="table" *ngIf="!isLoading && items.length > 0">
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of items">
            <td>{{ item.name }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.price | currency }}</td>
            <td class="actions">
              <a [routerLink]="['/inventory-items', item._id]">View</a>
              <a [routerLink]="['/inventory-items', item._id, 'edit']">Edit</a>
              <a [routerLink]="['/inventory-items', item._id, 'delete']" class="danger">Delete</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: `
    .inventory-list {
      max-width: 900px;
      margin: 1rem auto;
      padding: 1rem;
    }

    .inventory-list__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .btn {
      display: inline-block;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
    }

    .btn--primary {
      background: #2b6cb0;
      color: #fff;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
    }

    .table th,
    .table td {
      text-align: left;
      padding: 0.5rem;
      border-bottom: 1px solid #ddd;
    }

    .actions a {
      margin-right: 0.75rem;
      font-size: 0.9rem;
    }

    .actions .danger {
      color: #b00020;
    }

    .error {
      color: #b00020;
    }
  `
})
export class InventoryItemListComponent implements OnInit {
  items: InventoryItem[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.http.get<InventoryItem[]>(`${environment.apiBaseUrl}/api/inventory-items`).subscribe({
      next: (data) => {
        this.items = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load inventory items. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
