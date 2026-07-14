/**
 * Author: Shannon Kueneke
 * Date: 07/14/2026
 * File: ims-client/src/app/Inventory/inventory-item-delete/inventory-item-delete.component.ts
 * Description: Angular component that deletes a single inventory item by
 * ID.
 *
 * Reached as /inventory-items/:id/delete (a deep link from the row-level
 * Delete action in the inventory list). On click, the Delete button opens
 * a native browser confirm() alert; if the user confirms, DELETE
 * /api/inventory-items/:id is called and an on-page success or error
 * message is shown below the button — no navigation away from the page.
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-inventory-item-delete',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="page-content">
      <h2>Delete Inventory Item</h2>
      <div class="form-card">
        <p>Item ID: <strong>{{ id }}</strong></p>

        <div class="form-actions">
          <button
            type="button"
            class="btn btn--delete"
            [disabled]="deleting || successMessage"
            (click)="onDeleteClick()"
          >
            {{ deleting ? 'Deleting...' : 'Delete Item' }}
          </button>
          <button
            type="button"
            class="btn btn--secondary"
            routerLink="/inventory-items"
          >
            Cancel
          </button>
        </div>

        <p *ngIf="successMessage" class="delete-success">
          {{ successMessage }}
        </p>
        <p *ngIf="errorMessage" class="form-error">{{ errorMessage }}</p>
      </div>
    </section>
  `,
  styles: `
    .delete-success {
      margin-top: var(--space-4, 16px);
      color: var(--color-success-text, #15803d);
      background-color: var(--color-success-bg, #dcfce7);
      padding: var(--space-3, 12px);
      border-radius: var(--radius-sm, 4px);
    }

    .form-error {
      margin-top: var(--space-4, 16px);
    }
  `,
})
export class InventoryItemDeleteComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  // Id of the item to delete, taken from the route (/inventory-items/:id/delete).
  id = '';

  deleting = false;
  successMessage = '';
  errorMessage = '';

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
  }

  // Handles the Delete button click: confirms with the user first, and
  // only proceeds to call the API if they accept the confirm() dialog.
  onDeleteClick(): void {
    const confirmed = this.confirmDelete();

    if (!confirmed) {
      return;
    }

    this.performDelete();
  }

  // Wraps window.confirm so it can be spied on/stubbed in unit tests.
  confirmDelete(): boolean {
    return window.confirm(
      'Are you sure you want to delete this inventory item?'
    );
  }

  private performDelete(): void {
    this.deleting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.http
      .delete(`${environment.apiBaseUrl}/api/inventory-items/${this.id}`)
      .subscribe({
        next: () => {
          this.successMessage = 'Inventory item deleted successfully.';
          this.deleting = false;
        },
        error: () => {
          this.errorMessage = 'Unable to delete inventory item. Please try again.';
          this.deleting = false;
        },
      });
  }
}
