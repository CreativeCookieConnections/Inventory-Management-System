/**
 * Author: Shannon Kueneke
 * Date: 07/09/2026
 * File: ims-client/src/app/Inventory/inventoryItem-read/inventoryItem-read.component.ts
 * Description: Angular component that looks up and displays a single
 * inventory item by ID (US-04, TDD Section 1.5; component spec in
 * Section 4.2 — selector app-read-inventory-item, route
 * /inventory-items/:id, dependencies: HttpClient, ActivatedRoute).
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
 * Note: the TDD component description also calls for resolving and
 * displaying the linked category name and supplier name. There is no
 * "read category by ID" endpoint in the API design (Section 3.2) and the
 * suppliers routes are not implemented yet, so this component currently
 * shows the raw categoryId/supplierId. Swap in name lookups once those
 * endpoints exist.
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  imports: [CommonModule, ReactiveFormsModule],
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
            <dl>
              <dt>Category ID</dt>
              <dd>{{ item.categoryId }}</dd>
              <dt>Supplier ID</dt>
              <dd>{{ item.supplierId }}</dd>
              <dt>Quantity</dt>
              <dd>{{ item.quantity }}</dd>
              <dt>Price</dt>
              <dd>{{ item.price | currency }}</dd>
              <dt>Date Created</dt>
              <dd>{{ item.dateCreated | date }}</dd>
              <dt>Date Modified</dt>
              <dd>{{ item.dateModified | date }}</dd>
            </dl>
          </div>
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
  `,
})
export class ReadInventoryItemComponent implements OnInit {
  // Bug fix: `fb`/`route`/`http` must be assigned before the `lookupForm`
  // field initializer runs (it calls `this.fb.group(...)`). Constructor
  // parameter properties are assigned too late relative to other field
  // initializers, which TypeScript flags as "used before initialization".
  // Using `inject()` at the top of the class body avoids the ordering
  // problem entirely and is the standard pattern for standalone components.
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
        },
        error: () => {
          this.error = 'Inventory item not found.';
          this.loading = false;
        },
      });
  }
}
