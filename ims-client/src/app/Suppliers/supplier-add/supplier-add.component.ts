/**
 * Author: Aisha Keller
 * Date: 07/22/2026
 * File: ims-client/src/app/Suppliers/supplier-add/supplier-add.component.ts
 * Description: Angular component that provides a form for creating a new supplier.
 * The form includes fields for supplier ID, name, contact information, and address.
 * It performs client-side validation and submits the data to the server via an HTTP POST request.
 */


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-supplier-add',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="supplier-add">
        <h2>Create Supplier</h2>
        <form [formGroup]="supplierForm" (ngSubmit)="onSubmit()" novalidate>
        <div>
            <label for="supplierId">Supplier ID</label>
            <input id="supplierId" type="number" formControlName="supplierId" />
            <small *ngIf="supplierForm.get('supplierId')?.touched && supplierForm.get('supplierId')?.invalid">
                Supplier ID is required and must be at least 1.
            </small>
        </div>

        <div>
            <label for="supplierName">Supplier Name</label>
            <input id="supplierName" type="text" formControlName="supplierName" />
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

        <div>
            <label for="contactInformation">Contact Information</label>
            <input id="contactInformation" type="text" formControlName="contactInformation" />
            <small *ngIf="supplierForm.get('contactInformation')?.touched && supplierForm.get('contactInformation')?.errors?.['required']">
                Contact information is required.
            </small>
            <small *ngIf="supplierForm.get('contactInformation')?.touched && supplierForm.get('contactInformation')?.errors?.['minlength']">
                Contact information must be at least 2 characters.
            </small>
            <small *ngIf="supplierForm.get('contactInformation')?.touched && supplierForm.get('contactInformation')?.errors?.['maxlength']">
                Contact information cannot exceed 100 characters.
            </small>
        </div>

        <div>
            <label for="address">Address</label>
            <textarea id="address" formControlName="address"></textarea>
            <small *ngIf="supplierForm.get('address')?.touched && supplierForm.get('address')?.errors?.['maxlength']">
                Address cannot exceed 250 characters.
            </small>
        </div>

        <button type="submit" [disabled]="supplierForm.invalid || isSubmitting">
            {{ isSubmitting ? 'Saving...' : 'Create Supplier' }}
        </button>
        </form>

        <p *ngIf="successMessage">{{ successMessage }}</p>
        <p *ngIf="errorMessage">{{ errorMessage }}</p>
    </div>
    `,
    styles: `
    .supplier-add {
        max-width: 560px;
        margin: 1rem auto;
        padding: 1rem;
        border: 1px solid #ddd;
        border-radius: 8px;
    }

    form {
        display: grid;
        gap: 0.75rem;
    }

    label {
        display: block;
        font-weight: 600;
        margin-bottom: 0.25rem;
    }

    input,
    textarea,
    button {
        width: 100%;
        padding: 0.5rem;
        box-sizing: border-box;
    }

    small {
        color: #b00020;
        display: block;
        margin-top: 0.25rem;
    }
    `
})
export class SupplierAddComponent {
    isSubmitting = false;
    successMessage = '';
    errorMessage = '';

    supplierForm;

    constructor(private fb: FormBuilder, private http: HttpClient) {
        this.supplierForm = this.fb.group({
            supplierId: [1, [Validators.required, Validators.min(1)]],
            supplierName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
            contactInformation: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
            address: ['', [Validators.maxLength(250)]]
        });
    }

    onSubmit(): void {
        this.successMessage = '';
        this.errorMessage = '';

        if (this.supplierForm.invalid) {
            this.supplierForm.markAllAsTouched();
            return;
        }

        this.isSubmitting = true;

        this.http.post(`${environment.apiBaseUrl}/api/suppliers`, this.supplierForm.value).subscribe({
            next: () => {
                this.successMessage = 'Supplier created successfully.';
                this.errorMessage = '';
                this.isSubmitting = false;
                this.supplierForm.reset({
                    supplierId: 1,
                    supplierName: '',
                    contactInformation: '',
                    address: ''
                });
            },
            error: (error) => {
                this.errorMessage = error?.error?.message || 'Unable to create supplier. Please try again.';
                this.successMessage = '';
                this.isSubmitting = false;
            }
        });
    }
}