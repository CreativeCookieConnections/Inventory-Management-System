/**
 * Author: Nicholas Skelton
 * Date: 07/23/2026
 * File: ims-client/src/app/Suppliers/supplier-list/supplier-list.component.spec.ts
 * Description: Unit tests for SupplierListComponent — load/error state and
 * sorting behavior. HttpClient is mocked via HttpClientTestingModule so
 * these run without a live server.
 */

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SupplierListComponent } from './supplier-list.component';
import { environment } from '../../../environments/environment';

describe('SupplierListComponent', () => {
    let component: SupplierListComponent;
    let httpMock: HttpTestingController;

    const mockSuppliers = [
        { _id: '1', supplierId: 2, supplierName: 'Beta Corp', contactInformation: 'beta@example.com', address: '456 Oak Ave' },
        { _id: '2', supplierId: 1, supplierName: 'Acme Supplies', contactInformation: 'acme@example.com', address: '123 Main St' }
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SupplierListComponent, HttpClientTestingModule, RouterTestingModule]
        }).compileComponents();

        const fixture = TestBed.createComponent(SupplierListComponent);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
        fixture.detectChanges(); // triggers ngOnInit -> loadSuppliers()
    });

    afterEach(() => {
        httpMock.verify();
    });

    // Test 1: happy path — successful load populates suppliers and clears loading/error
    it('loads suppliers on init and turns off the loading flag', () => {
        const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/suppliers`);
        expect(req.request.method).toBe('GET');

        req.flush(mockSuppliers);

        expect(component.loading).toBeFalse();
        expect(component.error).toBe('');
        expect(component.suppliers).toEqual(mockSuppliers);
    });

    // Test 2: failed load sets the error message and clears the loading flag
    it('sets an error message when the request fails', () => {
        const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/suppliers`);

        req.flush('failure', { status: 500, statusText: 'Server Error' });

        expect(component.loading).toBeFalse();
        expect(component.error).toBe('Unable to load suppliers. Please try again.');
    });

    // Test 3: sortedSuppliers sorts by supplierName ascending by default,
    // and setSort flips the direction on a repeat click of the same column
    it('sorts by supplier name and flips direction on repeat click', () => {
        const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/suppliers`);
        req.flush(mockSuppliers);

        expect(component.sortedSuppliers.map(s => s.supplierName)).toEqual(['Acme Supplies', 'Beta Corp']);

        component.setSort('supplierName');

        expect(component.sortDirection).toBe('desc');
        expect(component.sortedSuppliers.map(s => s.supplierName)).toEqual(['Beta Corp', 'Acme Supplies']);
    });
});
