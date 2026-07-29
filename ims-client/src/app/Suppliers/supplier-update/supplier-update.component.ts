/**
 * Author: Aisha Keller
 * Date: 07/28/2026
 * File: ims-client/src/app/Suppliers/supplier-update/supplier-update.component.ts
 * Description: Angular component that provides a form for updating an existing supplier.
 * The form includes fields for supplier ID, name, contact information, and address.
 * It performs client-side validation and submits the updated data to the server via an HTTP PUT request.
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

interface Supplier {
    _id: string;
    supplierId: number;
    supplierName: string;
    contactInformation: string;
    address?: string;
}

@Component({
    selector: 'app-supplier-update',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    template: `
    <section class="page-content">
        <h2>Update Supplier</h2>
        <div class="form-card supplier-update-card">
            <p *ngIf="loading">Loading supplier...</p>
            <form *ngIf="!loading" [formGroup]="supplierForm" (ngSubmit)="onSubmit()" novalidate>
            <div class="form-group">
                <label class="form-label" for="supplierName">Supplier Name</label>
                <input id="supplierName" class="form-input" type="text" formControlName="supplierName" />
                <small *ngIf="supplierForm.get('supplierName')?.touched && supplierForm.get('supplierName')?.errors?.['required']">
                    Supplier name is required.
                </small>
                <small *ngIf="supplierForm.get('supplierName')?.touched && supplierForm.get('supplierName')?.errors?.['minlength']">
                    Supplier name must be at least 2 characters.
                </small>
                <small *ngIf="supplierForm.get('supplierName')?.touched && supplierForm.get('supplierName')?.errors?.['maxlength']">
                    Supplier name cannot exceed 100 characters.
                </small>
            </div>

            <div class="form-group">
                <label class="form-label" for="contactInformation">Contact Information</label>
                <input id="contactInformation" class="form-input" type="text" formControlName="contactInformation" />
                <small *ngIf="supplierForm.get('contactInformation')?.touched && supplierForm.get('contactInformation')?.errors?.['required']">
                    Contact information is required.
                </small>
                <small *ngIf="supplierForm.get('contactInformation')?.touched && supplierForm.get('contactInformation')?.errors?.['maxlength']">
                    Contact information cannot exceed 100 characters.
                </small>
            </div>

            <div class="form-group">
                <label class="form-label" for="address">Address</label>
                <input id="address" class="form-input" type="text" formControlName="address" />
                <small *ngIf="supplierForm.get('address')?.touched && supplierForm.get('address')?.errors?.['maxlength']">
                    Address cannot exceed 250 characters.
                </small>
            </div>

            <div class="form-actions">
                <button class="btn btn--primary" type="submit" [disabled]="supplierForm.invalid || isSubmitting">
                    {{ isSubmitting ? 'Saving...' : 'Update Supplier' }}
                </button>
                <button class="btn btn--secondary" type="button" routerLink="/suppliers">Cancel</button>
            </div>
            </form>

            <div *ngIf="successMessage" class="success-message">{{ successMessage }}</div>
            <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>
        </div>
    </section>
    `,
    styles: [`
        .supplier-update-card {
            max-width: 720px;
            margin: auto;
        }

        small {
            display: block;
            margin-top: 6px;
            color: var(--color-error-text, #b91c1c);
        }

        .success-message {
            margin-top: var(--space-4, 16px);
            color: var(--color-success-text, #15803d);
            background-color: var(--color-success-bg, #dcfce7);
            padding: var(--space-3, 12px);
            border-radius: var(--radius-sm, 4px);
        }

        .error-message {
            margin-top: var(--space-4, 16px);
            color: var(--color-error-text, #b91c1c);
            background-color: var(--color-error-bg, #fee2e2);
            padding: var(--space-3, 12px);
            border-radius: var(--radius-sm, 4px);
        }
    `]

})
export class SupplierUpdateComponent implements OnInit {
    private fb = inject(FormBuilder);
    private http = inject(HttpClient);
    private route = inject(ActivatedRoute);

    supplierId = '';
    loading = false;
    isSubmitting = false;
    successMessage = '';
    errorMessage = '';

    supplierForm = this.fb.group({
        supplierName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
        contactInformation: ['', [Validators.required, Validators.maxLength(100)]],
        address: ['', [Validators.maxLength(250)]]
    });

    ngOnInit(): void {
        this.supplierId = this.route.snapshot.paramMap.get('id') ?? '';

        if (!this.supplierId) {
            this.errorMessage = 'Supplier id is missing.';
            return;
        }

        this.loadSupplier();
    }

    private loadSupplier(): void {
        this.loading = true;
        this.errorMessage = '';

        this.http
            .get<Supplier>(`${environment.apiBaseUrl}/api/suppliers/${this.supplierId}`)
            .subscribe({
                next: (supplier) => {
                    this.supplierForm.patchValue({
                        supplierName: supplier.supplierName,
                        contactInformation: supplier.contactInformation,
                        address: supplier.address ?? ''
                    });
                    this.loading = false;
                },
                error: () => {
                    this.errorMessage = 'Unable to load supplier. Please try again.';
                    this.loading = false;
                }
            });
    }

    onSubmit(): void {
        this.successMessage = '';
        this.errorMessage = '';

        if (this.supplierForm.invalid) {
            this.supplierForm.markAllAsTouched();
            return;
        }

        if (!this.supplierId) {
            this.errorMessage = 'Supplier id is missing.';
            return;
        }

        this.isSubmitting = true;

        this.http
            .put(`${environment.apiBaseUrl}/api/suppliers/${this.supplierId}`, this.supplierForm.value)
            .subscribe({
                next: () => {
                    this.successMessage = 'Supplier updated successfully.';
                    this.errorMessage = '';
                    this.isSubmitting = false;
                },
                error: () => {
                    this.errorMessage = 'Unable to update supplier. Please try again.';
                    this.successMessage = '';
                    this.isSubmitting = false;
                }
            });
    }
}