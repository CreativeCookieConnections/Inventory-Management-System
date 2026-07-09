/**
 * Author: Aisha Keller
 * Date: 07/08/2026
 * File: inventoryItem-add.component.ts
 * Description: This file defines the InventoryItemAddComponent, which is responsible for adding new inventory items to the system. It includes form validation and submission logic.
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
		selector: 'app-inventoryitem-add',
		standalone: true,
		imports: [CommonModule, ReactiveFormsModule],
		template: `
		<div class="inventory-add">
			<h2>Create Inventory Item</h2>

			<form [formGroup]="itemForm" (ngSubmit)="onSubmit()" novalidate>
				<div>
					<label for="categoryId">Category ID</label>
					<input id="categoryId" type="number" formControlName="categoryId" />
					<small *ngIf="itemForm.get('categoryId')?.touched && itemForm.get('categoryId')?.invalid">
						Category ID is required and must be at least 1.
					</small>
				</div>

				<div>
					<label for="supplierId">Supplier ID</label>
					<input id="supplierId" type="number" formControlName="supplierId" />
					<small *ngIf="itemForm.get('supplierId')?.touched && itemForm.get('supplierId')?.invalid">
						Supplier ID is required and must be at least 1.
					</small>
				</div>

				<div>
					<label for="name">Name</label>
					<input id="name" type="text" formControlName="name" />
					<small *ngIf="itemForm.get('name')?.touched && itemForm.get('name')?.errors?.['required']">
						Name is required.
					</small>
					<small *ngIf="itemForm.get('name')?.touched && itemForm.get('name')?.errors?.['minlength']">
						Name must be at least 2 characters.
					</small>
					<small *ngIf="itemForm.get('name')?.touched && itemForm.get('name')?.errors?.['maxlength']">
						Name cannot exceed 100 characters.
					</small>
				</div>

				<div>
					<label for="description">Description</label>
					<textarea id="description" formControlName="description"></textarea>
					<small *ngIf="itemForm.get('description')?.touched && itemForm.get('description')?.errors?.['maxlength']">
						Description cannot exceed 250 characters.
					</small>
				</div>

				<div>
					<label for="quantity">Quantity</label>
					<input id="quantity" type="number" formControlName="quantity" />
					<small *ngIf="itemForm.get('quantity')?.touched && itemForm.get('quantity')?.invalid">
						Quantity is required and must be 0 or greater.
					</small>
				</div>

				<div>
					<label for="price">Price</label>
					<input id="price" type="number" step="0.01" formControlName="price" />
					<small *ngIf="itemForm.get('price')?.touched && itemForm.get('price')?.invalid">
						Price is required and must be 0 or greater.
					</small>
				</div>

				<button type="submit" [disabled]="itemForm.invalid || isSubmitting">
					{{ isSubmitting ? 'Saving...' : 'Create Item' }}
				</button>
			</form>

			<p *ngIf="successMessage">{{ successMessage }}</p>
			<p *ngIf="errorMessage">{{ errorMessage }}</p>
		</div>
	`,
		styles: `
		.inventory-add {
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
export class InventoryItemAddComponent {
		isSubmitting = false;
		successMessage = '';
		errorMessage = '';

	itemForm;

	constructor(private fb: FormBuilder, private http: HttpClient) {
		this.itemForm = this.fb.group({
			categoryId: [1, [Validators.required, Validators.min(1)]],
			supplierId: [1, [Validators.required, Validators.min(1)]],
			name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
			description: ['', [Validators.maxLength(250)]],
			quantity: [0, [Validators.required, Validators.min(0)]],
			price: [0, [Validators.required, Validators.min(0)]]
		});
	}

		onSubmit(): void {
				this.successMessage = '';
				this.errorMessage = '';

				if (this.itemForm.invalid) {
						this.itemForm.markAllAsTouched();
						return;
				}

				this.isSubmitting = true;

				this.http.post(`${environment.apiBaseUrl}/api/inventoryItems`, this.itemForm.value).subscribe({
						next: () => {
								this.successMessage = 'Inventory item created successfully.';
								this.itemForm.reset({
										categoryId: 1,
										supplierId: 1,
										name: '',
										description: '',
										quantity: 0,
										price: 0
								});
								this.isSubmitting = false;
						},
						error: () => {
								this.errorMessage = 'Unable to create inventory item. Please try again.';
								this.isSubmitting = false;
						}
				});
		}
}




