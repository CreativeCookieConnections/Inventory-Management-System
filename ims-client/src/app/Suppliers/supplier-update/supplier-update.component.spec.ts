/**
 * Author: Aisha Keller
 * Date: 07/28/2026
 * File: ims-client/src/app/Suppliers/supplier-update/supplier-update.component.spec.ts
 * Description: Unit tests for SupplierUpdateComponent.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
	HttpClientTestingModule,
	HttpTestingController,
} from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SupplierUpdateComponent } from './supplier-update.component';
import { environment } from '../../../environments/environment';

const supplierId = '1';
const expectedUrl = `${environment.apiBaseUrl}/api/suppliers/${supplierId}`;

const mockSupplier = {
	_id: '650c1f1e1c9d440000a1b1c1',
	supplierId: 1,
	supplierName: 'Acme Supplies',
	contactInformation: 'acme@example.com',
	address: '123 Main St',
};

describe('SupplierUpdateComponent', () => {
	let component: SupplierUpdateComponent;
	let fixture: ComponentFixture<SupplierUpdateComponent>;
	let httpMock: HttpTestingController;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				SupplierUpdateComponent,
				HttpClientTestingModule,
				RouterTestingModule,
			],
			providers: [
				{
					provide: ActivatedRoute,
					useValue: {
						snapshot: { paramMap: convertToParamMap({ id: supplierId }) },
					},
				},
			],
		}).compileComponents();

		httpMock = TestBed.inject(HttpTestingController);
		fixture = TestBed.createComponent(SupplierUpdateComponent);
		component = fixture.componentInstance;
	});

	afterEach(() => {
		httpMock.verify();
	});

	// Test 1: route id triggers GET on init and patches form values. Sprint 4 | Week 4
	it('loads supplier data on init and patches the form', () => {
		fixture.detectChanges();

		const req = httpMock.expectOne(expectedUrl);
		expect(req.request.method).toBe('GET');
		req.flush(mockSupplier);

		fixture.detectChanges();

		expect(component.loading).toBeFalse();
		expect(component.errorMessage).toBe('');
		expect(component.supplierForm.value).toEqual({
			supplierName: 'Acme Supplies',
			contactInformation: 'acme@example.com',
			address: '123 Main St',
		});
	});

	// Test 2: valid form submits PUT and shows success state. Sprint 4 | Week 4
	it('submits a valid update and shows success message', () => {
		fixture.detectChanges();

		const getReq = httpMock.expectOne(expectedUrl);
		getReq.flush(mockSupplier);

		component.supplierForm.patchValue({
			supplierName: 'Acme Supplies Updated',
			contactInformation: 'updated@example.com',
			address: '999 Updated St',
		});

		component.onSubmit();

		const putReq = httpMock.expectOne(expectedUrl);
		expect(putReq.request.method).toBe('PUT');
		expect(putReq.request.body).toEqual({
			supplierName: 'Acme Supplies Updated',
			contactInformation: 'updated@example.com',
			address: '999 Updated St',
		});

		putReq.flush({ message: 'Supplier updated successfully' });

		expect(component.successMessage).toBe('Supplier updated successfully.');
		expect(component.errorMessage).toBe('');
		expect(component.isSubmitting).toBeFalse();
	});

	// Test 3: failed PUT displays an error and clears success state. Sprint 4 | Week 4
	it('shows an error message when the update request fails', () => {
		fixture.detectChanges();

		const getReq = httpMock.expectOne(expectedUrl);
		getReq.flush(mockSupplier);

		component.supplierForm.patchValue({
			supplierName: 'Acme Supplies Updated',
			contactInformation: 'updated@example.com',
			address: '999 Updated St',
		});

		component.onSubmit();

		const putReq = httpMock.expectOne(expectedUrl);
		expect(putReq.request.method).toBe('PUT');

		putReq.flush(
			{ message: 'Supplier not found' },
			{ status: 404, statusText: 'Not Found' }
		);

		expect(component.errorMessage).toBe(
			'Unable to update supplier. Please try again.'
		);
		expect(component.successMessage).toBe('');
		expect(component.isSubmitting).toBeFalse();
	});
});
