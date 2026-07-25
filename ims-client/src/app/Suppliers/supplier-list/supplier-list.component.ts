/**
 * Author: Nicholas Skelton
 * Date: 07/23/2026
 * File: supplier-list.component.ts
 * Description: Fetches and displays all suppliers. Acts as the
 * functional "home" for the Supplier feature — links to Create, View,
 * Edit, and Delete for each supplier, per the project sitemap. Styled to
 * match the shared IMS stylesheet (page-content / data-table / btn
 * variants) used across the rest of the app.
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

// Shape of a single supplier as returned by the API.
// Mirrors the Mongoose schema fields used on the server.
interface Supplier {
  _id: string;
  supplierId: number;
  supplierName: string;
  contactInformation: string;
  address: string;
}

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="page-content">
      <div class="page-header page-header--with-action">
        <h2 class="page-header__title">Suppliers</h2>
        <div class="page-header__actions">
          <a class="btn btn--primary" routerLink="/suppliers/search">
            Search
          </a>
          <a class="btn btn--primary" routerLink="/suppliers/add">
            + Create New
          </a>
        </div>
      </div>

      <p *ngIf="loading">Loading suppliers...</p>
      <p *ngIf="!loading && error" class="form-error">{{ error }}</p>

      <div
        class="data-table-wrapper"
        *ngIf="!loading && !error && suppliers.length > 0"
      >
        <table class="data-table">
          <thead>
            <tr>
              <th (click)="setSort('supplierName')" class="sortable">
                Supplier Name
                <span class="sort-arrow">{{ arrowFor('supplierName') }}</span>
              </th>
              <th (click)="setSort('supplierId')" class="sortable">
                Supplier ID
                <span class="sort-arrow">{{ arrowFor('supplierId') }}</span>
              </th>
              <th>Contact Information</th>
              <th>Address</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let supplier of sortedSuppliers">
              <td>
                <div class="item-name">{{ supplier.supplierName }}</div>
              </td>
              <td>{{ supplier.supplierId }}</td>
              <td>{{ supplier.contactInformation }}</td>
              <td>{{ supplier.address }}</td>
              <td>
                <div class="data-table__actions">
                  <a
                    [routerLink]="['/suppliers', supplier._id]"
                    class="btn btn--sm btn--view"
                  >
                    View
                  </a>
                  <a
                    [routerLink]="['/suppliers', supplier._id, 'edit']"
                    class="btn btn--sm btn--edit"
                  >
                    Edit
                  </a>
                  <a
                    [routerLink]="['/suppliers', supplier._id, 'delete']"
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
        *ngIf="!loading && !error && suppliers.length === 0"
      >
        No suppliers found.
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

    .page-header__actions {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .page-header--with-action .btn {
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
export class SupplierListComponent implements OnInit {
  // Suppliers fetched from the API, in their original (unsorted) order.
  suppliers: Supplier[] = [];

  // UI state flags for the loading/error/empty views in the template.
  loading = false;
  error = '';

  // Current sort column and direction. Defaults to Supplier Name, ascending.
  sortField: 'supplierName' | 'supplierId' = 'supplierName';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Load the list as soon as the component is created.
    this.loadSuppliers();
  }

  // Fetches all suppliers from the API and updates loading/error state.
  loadSuppliers(): void {
    this.loading = true;
    this.error = '';

    // GET /api/suppliers — populates the table, or sets `error`
    // if the request fails (e.g. server down, network issue).
    this.http
      .get<Supplier[]>(`${environment.apiBaseUrl}/api/suppliers`)
      .subscribe({
        next: (data) => {
          this.suppliers = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'Unable to load suppliers. Please try again.';
          this.loading = false;
        }
      });
  }

  // Called when a sortable column header is clicked. Clicking the column
  // that's already active flips the direction; clicking a new column
  // switches to it and resets to ascending.
  setSort(field: 'supplierName' | 'supplierId'): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
  }

  // Returns the arrow to display next to a column header — empty string
  // if that column isn't the active sort field.
  arrowFor(field: 'supplierName' | 'supplierId'): string {
    if (this.sortField !== field) {
      return '';
    }
    return this.sortDirection === 'asc' ? '▲' : '▼';
  }

  // Computed, sorted copy of suppliers — recalculated automatically whenever
  // suppliers, sortField, or sortDirection change. Does not mutate `suppliers`.
  get sortedSuppliers(): Supplier[] {
    const field = this.sortField;
    const direction = this.sortDirection === 'asc' ? 1 : -1;

    return [...this.suppliers].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];

      // Supplier Name is a string — compare alphabetically.
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * direction;
      }

      // Supplier ID is a number — compare numerically.
      return ((aValue as number) - (bValue as number)) * direction;
    });
  }
}
