/**
 * Author: Shannon Kueneke
 * Date: 07/09/2026
 * File: ims-client/src/app/Inventory/inventoryItem-read/inventoryItem-read.component.ts
 * Description: Angular component that looks up and displays a single
 * inventory item by ID
 *
 * This component also contains an ID search form
 *   - Visited as /inventory-items/:id (a deep link) — the id comes from
 *     the route, the form is pre-filled with it, and the item is fetched
 *     and displayed automatically.
 *   - Visited as /inventory-items/lookup (no id in the route) — the form
 *     starts empty; entering an id and clicking Search fetches and
 *     displays the item inline, below the form, without navigating away.
 * Both paths share the same fetch logic and the same result markup.
 *
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

// Shape of a single inventoryItems document — see TDD Section 2.4
// (NoSQL Data Structure) and src/models/inventory-item.js on the server.
export interface InventoryItem {
  _id: string;
  categoryId: number;
  supplierId: number;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  dateCreated: string;
  dateModified: string;
}

@Component({
  selector: 'app-read-inventory-item',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="page-content">
      <h2>Lookup Inventory Item by ID</h2>
      <div class="form-card">
        <!-- ID search form -->
        <form [formGroup]="lookupForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label class="form-label" for="itemId">
              Inventory Item ID
              <span class="form-label__required">*</span>
            </label>
            <input
              id="itemId"
              class="form-input"
              type="text"
              formControlName="id"
              placeholder="e.g. 6a4854e94c76763dc2628ca0"
            />
            <!-- Inline validation error — only shown after the field has been touched -->
            <p
              class="form-error"
              *ngIf="idControl.invalid && idControl.touched"
            >
              Please enter an inventory item ID.
            </p>
          </div>

          <div class="form-actions">
            <button
              class="btn btn--primary"
              type="submit"
              [disabled]="lookupForm.invalid"
            >
              Search
            </button>
          </div>
        </form>

        <!--
          Result area — rendered below the search form on the same page.
          Populated either automatically (id came from the route) or after
          a manual search submission.
        -->
        <div *ngIf="hasSearched" class="lookup-result">
          <p *ngIf="loading">Loading inventory item...</p>

          <p *ngIf="!loading && error" class="form-error">{{ error }}</p>

          <div *ngIf="!loading && !error && item">
            <h2>{{ item.name }}</h2>
            <p *ngIf="item.description">{{ item.description }}</p>
            <div class="data-table-wrapper">
              <table class="data-table">
                <tbody>
                  <tr>
                    <th>Category ID</th>
                    <td>{{ item.categoryId }}</td>
                  </tr>
                  <tr>
                    <th>Supplier ID</th>
                    <td>{{ item.supplierId }}</td>
                  </tr>
                  <tr>
                    <th>Quantity</th>
                    <td>{{ item.quantity }}</td>
                  </tr>
                  <tr>
                    <th>Price</th>
                    <td>{{ item.price | currency }}</td>
                  </tr>
                  <tr>
                    <th>Date Created</th>
                    <td>{{ item.dateCreated | date }}</td>
                  </tr>
                  <tr>
                    <th>Date Modified</th>
                    <td>{{ item.dateModified | date }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <button
            routerLink="/inventory-items"
            class="btn btn--secondary"
          >
            Back
          </button>
        </div>
      </div>
    </section>
  `,
  styles: `
    /* Visually separates the result from the form above it */
    .lookup-result {
      margin-top: var(--space-5, 24px);
      padding-top: var(--space-5, 24px);
      border-top: 1px solid var(--color-border-light, #e2e8f0);
    }

    /* This table uses th as a row label (not a column header), so override
       the global .data-table th header styling (blue bg, white uppercase
       text) with plain black label text, and stripe the first row instead
       of the second. */
    .lookup-result .data-table th {
      background-color: transparent;
      color: var(--color-text-primary, #1f2937);
      text-transform: none;
      letter-spacing: normal;
    }

    .lookup-result .data-table tbody tr:nth-child(odd) {
      background-color: var(--color-bg-surface-alt, #f8f9fb);
    }

    .lookup-result .data-table tbody tr:nth-child(even) {
      background-color: var(--color-bg-surface, #ffffff);
    }

    .btn.btn--secondary {
      margin-top: 1em;
    }
  `,
})
export class ReadInventoryItemComponent implements OnInit {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  // Reactive form with a single required "id" field, shared by both the
  // route-driven lookup and the manual search submission.
  lookupForm = this.fb.group({
    id: ['', [Validators.required]],
  });

  // Result state, rendered inline below the form
  item: InventoryItem | null = null;
  loading = false;
  error: string | null = null;
  hasSearched = false;

  // Convenience getter used by the template for validation display
  get idControl() {
    return this.lookupForm.controls.id;
  }

  ngOnInit(): void {
    // Route param name ("id") matches the /inventory-items/:id path
    // registered in app.routes.ts. When present (a deep link), pre-fill
    // the form and search immediately; when absent (/inventory-items/lookup),
    // leave the form empty and wait for a manual submission.
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.lookupForm.patchValue({ id });
      this.performSearch(id);
    }
  }

  // Triggered by the form's (ngSubmit) — validates, then delegates to the
  // same fetch logic used for a route-provided id.
  onSubmit(): void {
    if (this.lookupForm.invalid) {
      this.idControl.markAsTouched();
      return;
    }

    const id = (this.lookupForm.value.id ?? '').trim();
    this.performSearch(id);
  }

  // Shared fetch logic: calls GET /api/inventory-items/:id and renders the
  // result inline below the form, whether the search was triggered by the
  // route or by the user clicking Search.
  private performSearch(id: string): void {
    this.hasSearched = true;
    this.loading = true;
    this.error = null;
    this.item = null;

    this.http
      .get<InventoryItem>(`${environment.apiBaseUrl}/api/inventory-items/${id}`)
      .subscribe({
        next: (result) => {
          this.item = result;
          this.loading = false;
        },
        error: () => {
          this.error = 'Inventory item not found.';
          this.loading = false;
        },
      });
  }
}
