/**
 * Author: Shannon Kueneke
 * Date: 07/20/2026
 * File: ims-client/src/app/Suppliers/supplier-read/supplier-read.component.ts
 * Description: Angular component that looks up and displays a single
 * supplier by ID, mirroring ReadInventoryItemComponent.
 *
 * This component also contains an ID search form
 *   - Visited as /suppliers/:id (a deep link) — the id comes from the
 *     route, the form is pre-filled with it, and the supplier is fetched
 *     and displayed automatically.
 *   - Visited as /suppliers/lookup (no id in the route) — the form starts
 *     empty; entering an id and clicking Search fetches and displays the
 *     supplier inline, below the form, without navigating away.
 * Both paths share the same fetch logic and the same result markup.
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

// Shape of a single suppliers document — see src/models/supplier.js on the server.
export interface Supplier {
  _id: string;
  supplierId: number;
  supplierName: string;
  contactInformation: string;
  address?: string;
  dateCreated: string;
  dateModified: string;
}

@Component({
  selector: 'app-read-supplier',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="page-content">
      <h2>Lookup Supplier by ID</h2>
      <div class="form-card">
        <!-- ID search form -->
        <form [formGroup]="lookupForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label class="form-label" for="supplierId">
              Supplier ID
              <span class="form-label__required">*</span>
            </label>
            <input
              id="supplierId"
              class="form-input"
              type="text"
              formControlName="id"
              placeholder="e.g. 1"
            />
            <!-- Inline validation error — only shown after the field has been touched -->
            <p
              class="form-error"
              *ngIf="idControl.invalid && idControl.touched"
            >
              Please enter a supplier ID.
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
          <p *ngIf="loading">Loading supplier...</p>

          <p *ngIf="!loading && error" class="form-error">{{ error }}</p>

          <div *ngIf="!loading && !error && supplier">
            <h2>{{ supplier.supplierName }}</h2>
            <div class="data-table-wrapper">
              <table class="data-table">
                <tbody>
                  <tr>
                    <th>Supplier ID</th>
                    <td>{{ supplier.supplierId }}</td>
                  </tr>
                  <tr>
                    <th>Supplier Name</th>
                    <td>{{ supplier.supplierName }}</td>
                  </tr>
                  <tr>
                    <th>Contact Information</th>
                    <td>{{ supplier.contactInformation }}</td>
                  </tr>
                  <tr>
                    <th>Address</th>
                    <td>{{ supplier.address }}</td>
                  </tr>
                  <tr>
                    <th>Date Created</th>
                    <td>{{ supplier.dateCreated | date }}</td>
                  </tr>
                  <tr>
                    <th>Date Modified</th>
                    <td>{{ supplier.dateModified | date }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <button
            routerLink="/suppliers"
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
export class ReadSupplierComponent implements OnInit {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  // Reactive form with a single required "id" field, shared by both the
  // route-driven lookup and the manual search submission.
  lookupForm = this.fb.group({
    id: ['', [Validators.required]],
  });

  // Result state, rendered inline below the form
  supplier: Supplier | null = null;
  loading = false;
  error: string | null = null;
  hasSearched = false;

  // Convenience getter used by the template for validation display
  get idControl() {
    return this.lookupForm.controls.id;
  }

  ngOnInit(): void {
    // Route param name ("id") matches the /suppliers/:id path registered
    // in app.routes.ts, and holds the supplier's business supplierId (a
    // small unique number, e.g. 1, 22 — not MongoDB's internal _id). When
    // present (a deep link), pre-fill the form and search immediately;
    // when absent (/suppliers/lookup), leave the form empty and wait for
    // a manual submission.
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

  // Shared fetch logic: calls GET /api/suppliers/:id and renders the
  // result inline below the form, whether the search was triggered by the
  // route or by the user clicking Search.
  private performSearch(id: string): void {
    this.hasSearched = true;
    this.loading = true;
    this.error = null;
    this.supplier = null;

    this.http
      .get<Supplier>(`${environment.apiBaseUrl}/api/suppliers/${id}`)
      .subscribe({
        next: (result) => {
          this.supplier = result;
          this.loading = false;
        },
        error: () => {
          this.error = 'Supplier not found.';
          this.loading = false;
        },
      });
  }
}
