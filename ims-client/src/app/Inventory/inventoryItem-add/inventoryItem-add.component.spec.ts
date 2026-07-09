/**
 * Author: Aisha Keller
 * Date: 07/08/2026
 * File: inventoryItem-add.component.spec.ts
 * Description: This file contains unit tests for the InventoryItemAddComponent, ensuring that the component behaves as expected under various scenarios. It includes tests for form validation, submission logic, and interaction with the backend API.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { InventoryItemAddComponent } from './inventoryItem-add.component';
import { environment } from '../../../environments/environment';

describe('InventoryItemAddComponent', () => {
    let component: InventoryItemAddComponent;
    let fixture: ComponentFixture<InventoryItemAddComponent>;
    let httpMock: HttpTestingController;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [InventoryItemAddComponent, HttpClientTestingModule]
        }).compileComponents();

        fixture = TestBed.createComponent(InventoryItemAddComponent);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
        fixture.detectChanges();
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    // Unit Test 1 Sprint 1: Test form validation for required fields
    it('should not submit when form is invalid', () => {
        component.itemForm.patchValue({
            categoryId: 1,
            supplierId: 2,
            name: '',
            description: 'Missing required name',
            quantity: 10,
            price: 9.99
    });

        component.onSubmit();

        expect(component.itemForm.invalid).toBeTrue();
        const req = httpMock.match(() => true);
        expect(req.length).toBe(0);
        expect(component.isSubmitting).toBeFalse();
    });

    // Unit Test 2 Sprint 1: Test successful form submission and POST request
    it('should submit valid form and call POST', () => {
        const payload = {
            categoryId: 1,
            supplierId: 2,
            name: 'USB-C Cable',
            description: 'Braided cable',
            quantity: 25,
            price: 14.99
        };

        component.itemForm.patchValue(payload);
        component.onSubmit();

        const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/inventoryItems`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(payload);

        req.flush({ message: 'Inventory item created successfully' });

        expect(component.successMessage).toContain('created successfully');
        expect(component.errorMessage).toBe('');
        expect(component.isSubmitting).toBeFalse();
    });

    // Unit Test 3 Sprint 1: Test error handling when POST request fails
    it('should show error message when POST fails', () => {
    const payload = {
            categoryId: 1,
            supplierId: 2,
            name: 'USB-C Cable',
            description: 'Braided cable',
            quantity: 25,
            price: 14.99
    };

        component.itemForm.patchValue(payload);
        component.onSubmit();

        const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/inventoryItems`);
        expect(req.request.method).toBe('POST');

        req.flush(
            { message: 'Server error' },
            { status: 500, statusText: 'Internal Server Error' }
        );

        expect(component.errorMessage).toContain('Unable to create inventory item');
        expect(component.successMessage).toBe('');
        expect(component.isSubmitting).toBeFalse();
    });
});