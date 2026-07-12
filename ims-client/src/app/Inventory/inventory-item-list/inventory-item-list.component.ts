/**
 * Author: Nicholas Skelton
 * Date: 07/09/2026
 * File: inventory-item-list.component.ts
 * Description: Fetches and displays all inventory items. Acts as the
 * functional "home" for the Inventory feature — links to Create, View,
 * Edit, and Delete for each item, per the project sitemap. Styled to
 * match the shared IMS stylesheet (page-content / data-table / btn
 * variants) used across the rest of the app.
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

// Shape of a single inventory item as returned by the API.
// Mirrors the Mongoose schema fields used on the server.
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
  selector: 'app-inventory-item-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="page-content">
      <div class="page-header page-header--with-action">
        <h2 class="page-header__title">Inventory Items</h2>
        <a class="btn btn--primary" routerLink="/inventory-items/add">
          + Create New
        </a>
      </div>

      <p *ngIf="loading">Loading inventory items...</p>
      <p *ngIf="!loading && error" class="form-error">{{ error }}</p>

      <div
        class="data-table-wrapper"
        *ngIf="!loading && !error && items.length > 0"
      >
        <table class="data-table">
          <thead>
            <tr>
              <th (click)="setSort('name')" class="sortable">
                Name
                <span class="sort-arrow">{{ arrowFor('name') }}</span>
              </th>
              <th (click)="setSort('quantity')" class="sortable">
                Quantity
                <span class="sort-arrow">{{ arrowFor('quantity') }}</span>
              </th>
              <th (click)="setSort('price')" class="sortable">
                Price
                <span class="sort-arrow">{{ arrowFor('price') }}</span>
              </th>
              <th (click)="setSort('totalValue')" class="sortable">
                Total Value
                <span class="sort-arrow">{{ arrowFor('totalValue') }}</span>
              </th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of sortedItems">
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
                  <a
                    [routerLink]="['/inventory-items', item._id]"
                    class="btn btn--sm btn--view"
                  >
                    View
                  </a>
                  <a
                    [routerLink]="['/inventory-items', item._id, 'edit']"
                    class="btn btn--sm btn--edit"
                  >
                    Edit
                  </a>
                  <a
                    [routerLink]="['/inventory-items', item._id, 'delete']"
                    class="btn btn--sm btn--delete"
                  >
                    Delete
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        class="data-table__empty"
        *ngIf="!loading && !error && items.length === 0"
      >
        No inventory items found.
      </div>
    </section>
  `,
  styles: `
    /* Scoped to this component only — lays the title and Create button
       side by side within the shared .page-header band, without altering
       .page-header for any other page that doesn't need this layout. */
    .page-header--with-action {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #f5f7fa;
    }

    .page-header--with-action .btn--primary {
      text-decoration: none;
      border-radius: 10px;
      font-size: 1.05rem;
      line-height: 1;
      padding: var(--space-3) var(--space-6);
    }

    .item-name {
      font-weight: 700;
      font-size: 1.05rem;
    }

    .sortable {
      cursor: pointer;
      user-select: none;
    }

    .sortable:hover {
      opacity: 0.85;
    }

    .sort-arrow {
      display: inline-block;
      margin-left: 4px;
      font-size: 0.75em;
    }
  `
})
export class InventoryItemListComponent implements OnInit {
  // Items fetched from the API, in their original (unsorted) order.
  items: InventoryItem[] = [];

  // UI state flags for the loading/error/empty views in the template.
  loading = false;
  error = '';

  // Current sort column and direction. Defaults to Name, ascending.
  sortField: 'name' | 'quantity' | 'price' | 'totalValue' = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Load the list as soon as the component is created.
    this.loadItems();
  }

  // Fetches all inventory items from the API and updates loading/error state.
  loadItems(): void {
    this.loading = true;
    this.error = '';

    // GET /api/inventory-items — populates the table, or sets `error`
    // if the request fails (e.g. server down, network issue).
    this.http
      .get<InventoryItem[]>(`${environment.apiBaseUrl}/api/inventory-items`)
      .subscribe({
        next: (data) => {
          this.items = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'Unable to load inventory items. Please try again.';
          this.loading = false;
        }
      });
  }

  // Called when a sortable column header is clicked. Clicking the column
  // that's already active flips the direction; clicking a new column
  // switches to it and resets to ascending.
  setSort(field: 'name' | 'quantity' | 'price' | 'totalValue'): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
  }

  // Returns the arrow to display next to a column header — empty string
  // if that column isn't the active sort field.
  arrowFor(field: 'name' | 'quantity' | 'price' | 'totalValue'): string {
    if (this.sortField !== field) {
      return '';
    }
    return this.sortDirection === 'asc' ? '▲' : '▼';
  }

  // Computed, sorted copy of items — recalculated automatically whenever
  // items, sortField, or sortDirection change. Does not mutate `items`.
  get sortedItems(): InventoryItem[] {
    const field = this.sortField;
    const direction = this.sortDirection === 'asc' ? 1 : -1;

    return [...this.items].sort((a, b) => {
      // Total Value isn't a real field on the item, so compute it here
      // rather than trying to read a[field]/b[field].
      if (field === 'totalValue') {
        const aTotal = a.price * a.quantity;
        const bTotal = b.price * b.quantity;
        return (aTotal - bTotal) * direction;
      }

      const aValue = a[field];
      const bValue = b[field];

      // Name is a string — compare alphabetically.
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * direction;
      }

      // Quantity/Price are numbers — compare numerically.
      return ((aValue as number) - (bValue as number)) * direction;
    });
  }
}
