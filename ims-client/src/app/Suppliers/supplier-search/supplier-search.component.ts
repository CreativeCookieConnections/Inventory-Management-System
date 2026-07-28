/**
 * Author: Nicholas Skelton
 * Date: 07/24/2026
 * File: supplier-search.component.ts
 * Description: Lets the user search suppliers by name and/or supplier ID,
 * calling GET /api/suppliers/search. Mirrors InventoryItemSearchComponent's
 * filters/ngModel form pattern and data-table layout.
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface Supplier {
  _id: string;
  supplierId: number;
  supplierName: string;
  contactInformation: string;
  address: string;
}

@Component({
  selector: 'app-supplier-search',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <section class="page-content">
      <div class="page-header page-header--with-action">
        <h2 class="page-header__title">Search Suppliers</h2>
        <a class="btn btn--primary" routerLink="/suppliers/add">
          + Create New
        </a>
      </div>
      <div class="form-card">
        <form class="search-row" (ngSubmit)="search()">
          <label>
            Supplier Name:
            <input
              type="text"
              name="name"
              placeholder="e.g. Acme"
              [(ngModel)]="filters.name"
            />
          </label>

          <label>
            Supplier ID:
            <input
              type="number"
              name="supplierId"
              placeholder="e.g. 1"
              [(ngModel)]="filters.supplierId"
            />
          </label>

          <div class="search-actions">
            <button type="submit" class="btn btn--primary">Search</button>
            <button type="button" class="btn btn--md" (click)="clear()">Clear</button>
          </div>
        </form>

        <p *ngIf="loading">Searching suppliers...</p>
        <p *ngIf="!loading && error" class="form-error">{{ error }}</p>

        <div class="data-table-wrapper" *ngIf="!loading && !error && suppliers.length > 0">
          <table class="data-table">
            <thead>
              <tr>
                <th>Supplier Name</th>
                <th>Supplier ID</th>
                <th>Contact Information</th>
                <th>Address</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let supplier of suppliers">
                <td>
                  <div class="item-name">{{ supplier.supplierName }}</div>
                </td>
                <td>{{ supplier.supplierId }}</td>
                <td>{{ supplier.contactInformation }}</td>
                <td>{{ supplier.address }}</td>
                <td>
                  <div class="data-table__actions">
                    <a [routerLink]="['/suppliers', supplier.supplierId]" class="btn btn--sm btn--view">
                      View
                    </a>
                    <a [routerLink]="['/suppliers', supplier.supplierId, 'edit']" class="btn btn--sm btn--edit">
                      Edit
                    </a>
                    <a [routerLink]="['/suppliers', supplier.supplierId, 'delete']" class="btn btn--sm btn--delete">
                      Delete
                    </a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="data-table__empty" *ngIf="!loading && !error && searched && suppliers.length === 0">
          No suppliers match your search.
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
      width: 317px;
      border-radius: 6px;
      padding: 5px 9px;
    }

    .search-actions {
      display: flex;
      gap: 12px;
    }

    .item-name {
      font-weight: 700;
      font-size: 1.05rem;
    }
  `,
})
export class SupplierSearchComponent {
  // Search filter form state, bound to the input fields via ngModel.
  filters = {
    name: '',
    supplierId: null as number | null
  };

  suppliers: Supplier[] = [];
  loading = false;
  error = '';
  searched = false;

  constructor(private http: HttpClient) {}

  // Builds the query params from any filled-in filters and calls GET /api/suppliers/search.
  search(): void {
    const hasName = this.filters.name.trim().length > 0;
    const hasId = this.filters.supplierId !== null;

    if (!hasName && !hasId) {
      return;
    }

    this.loading = true;
    this.error = '';

    let params = new HttpParams();
    if (hasName) {
      params = params.set('name', this.filters.name.trim());
    }
    if (hasId) {
      params = params.set('supplierId', this.filters.supplierId as number);
    }

    this.http
      .get<Supplier[]>(`${environment.apiBaseUrl}/api/suppliers/search`, { params })
      .subscribe({
        next: (data) => {
          this.suppliers = data;
          this.loading = false;
          this.searched = true;
        },
        error: () => {
          this.error = 'Unable to search suppliers. Please try again.';
          this.loading = false;
        }
      });
  }

  // Clear to completely reset form and results
  clear(): void {
    this.filters = { name: '', supplierId: null };
    this.suppliers = [];
    this.searched = false;
    this.error = '';
  }
}
