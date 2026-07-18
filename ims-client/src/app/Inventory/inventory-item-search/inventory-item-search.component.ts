/**
 * Author: Nicholas Skelton
 * Date: 07/16/2026
 * File: inventory-item-search.component.ts
 * Description: Lets the user search inventory items by name and
 * optional category/supplier filters, calling GET /api/inventory-items/search.
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
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
  selector: 'app-inventory-item-search',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <section class="page-content">
      <div class="page-header page-header--with-action">
        <h2 class="page-header__title">Search Inventory Items</h2>
        <a class="btn btn--primary" routerLink="/inventory-items/add">
          + Create New
        </a>
      </div>
      <div class="form-card">
        <form (ngSubmit)="search()">
          <label>
            Name:
            <input
              type="text"
              name="name"
              placeholder="e.g. keyboard"
              [(ngModel)]="filters.name"
            />
          </label>

          <label>
            Category ID:
            <input
              type="number"
              name="categoryId"
              placeholder="Enter ID"
              [(ngModel)]="filters.categoryId"
            />
          </label>

          <label>
            Supplier ID:
            <input
              type="number"
              name="supplierId"
              placeholder="Enter ID"
              [(ngModel)]="filters.supplierId"
            />
          </label>

          <button type="submit" class="btn btn--primary">Search</button>
          <button type="button" class="btn btn--md" (click)="clear()">Clear</button>
        </form>

        <p *ngIf="loading">Searching inventory items...</p>
        <p *ngIf="!loading && error" class="form-error">{{ error }}</p>

        <div class="data-table-wrapper" *ngIf="!loading && !error && items.length > 0">
          <table class="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total Value</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of items">
                <td>
                  <div class="item-name">{{ item.name }}</div>
                  <div class="text-secondary" *ngIf="item.description">
                    {{ item.description }}
                  </div>
                </td>
                <td>{{ item.quantity }}</td>
                <td>{{ item.price | currency }}</td>
                <td>{{ item.price * item.quantity | currency }}</td>
                <td>
                  <div class="data-table__actions">
                    <a [routerLink]="['/inventory-items', item._id]" class="btn btn--sm btn--view">
                      View
                    </a>
                    <a [routerLink]="['/inventory-items', item._id, 'edit']" class="btn btn--sm btn--edit">
                      Edit
                    </a>
                    <a [routerLink]="['/inventory-items', item._id, 'delete']" class="btn btn--sm btn--delete">
                      Delete
                    </a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="data-table__empty" *ngIf="!loading && !error && searched && items.length === 0">
          No inventory items match your search.
        </div>
      </div>
    </section>
  `,
  styles: `
    .page-header--with-action {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #f5f7fa;
    }

    .page-header--with-action .btn {
      text-decoration: none;
      border-radius: 10px;
      font-size: 1.05rem;
      line-height: 1;
      padding: var(--space-3) var(--space-6);
    }

    label {
      font-weight: 500;
      font-size: 1.05rem;
    }

    form {
      display: flex;
      align-items: center;
      gap: 19px;
      margin-bottom: 24px;
    }

    .form-card input {
      border-radius: 6px;
      padding: 5px 9px;
    }

    .item-name {
      font-weight: 700;
      font-size: 1.05rem;
    }
  `,
})
export class InventoryItemSearchComponent {
  // Search filter form state, bound to the input fields via ngModel.
  filters = {
    name: '',
    categoryId: null as number | null, // Optional filters set to null
    supplierId: null as number | null
  };

  items: InventoryItem[] = [];
  loading = false;
  error = '';
  searched = false;

  constructor(private http: HttpClient) {}

  // Builds the query params from any filled-in filters and calls GET /api/inventory-items/search.
  search(): void {
    this.loading = true;
    this.error = '';

    let params = new HttpParams();
    if (this.filters.name.trim()) {
      params = params.set('name', this.filters.name.trim());
    }
    if (this.filters.categoryId !== null) {
      params = params.set('categoryId', this.filters.categoryId);
    }
    if (this.filters.supplierId !== null) {
      params = params.set('supplierId', this.filters.supplierId);
    }

    this.http
      .get<InventoryItem[]>(`${environment.apiBaseUrl}/api/inventory-items/search`, { params })
      .subscribe({
        next: (data) => {
          this.items = data;
          this.loading = false;
          this.searched = true;
        },
        error: () => {
          this.error = 'Unable to search inventory items. Please try again.';
          this.loading = false;
        }
      });
  }

  // Clear to completely reset form and results
  clear(): void {
    this.filters = { name: '', categoryId: null, supplierId: null };
    this.items = [];
    this.searched = false;
    this.error = '';
  }
}
