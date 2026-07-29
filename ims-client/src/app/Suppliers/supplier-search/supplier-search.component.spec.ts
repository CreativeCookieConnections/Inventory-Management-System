/**
 * Author: Nicholas Skelton
 * Date: 07/24/2026
 * File: ims-client/src/app/Suppliers/supplier-search/supplier-search.component.spec.ts
 * Description: Unit tests for SupplierSearchComponent — the empty-search
 * guard, a successful name search, and clear() resetting state. HttpClient
 * is mocked via HttpClientTestingModule and RouterLink's ActivatedRoute is
 * provided via RouterTestingModule, so these run without a live server.
 */

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SupplierSearchComponent } from './supplier-search.component';
import { environment } from '../../../environments/environment';

describe('SupplierSearchComponent', () => {
    let component: SupplierSearchComponent;
    let httpMock: HttpTestingController;

    const mockSuppliers = [
        { _id: '1', supplierId: 1, supplierName: 'Acme Supplies', contactInformation: 'acme@example.com', address: '123 Main St' }
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SupplierSearchComponent, HttpClientTestingModule, RouterTestingModule]
        }).compileComponents();

        const fixture = TestBed.createComponent(SupplierSearchComponent);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    // Test 1: neither filter set — search() should not hit the API at all
    it('does not call the API when no filters are provided', () => {
        component.search();

        httpMock.expectNone(`${environment.apiBaseUrl}/api/suppliers/search`);
        expect(component.loading).toBeFalse();
    });

    // Test 2: happy path — searching by name calls the API with the right
    // query param and populates the results
    it('searches by name and populates results on success', () => {
        component.filters.name = 'Acme';

        component.search();

        const req = httpMock.expectOne(
            r => r.url === `${environment.apiBaseUrl}/api/suppliers/search` && r.params.get('name') === 'Acme'
        );
        expect(req.request.method).toBe('GET');

        req.flush(mockSuppliers);

        expect(component.suppliers).toEqual(mockSuppliers);
        expect(component.loading).toBeFalse();
        expect(component.searched).toBeTrue();
    });

    // Test 3: clear() resets filters, results, and search state
    it('resets filters, results, and search state on clear', () => {
        component.filters.name = 'Acme';
        component.filters.supplierId = 1;
        component.suppliers = mockSuppliers as any;
        component.searched = true;
        component.error = 'Unable to search suppliers. Please try again.';

        component.clear();

        expect(component.filters).toEqual({ name: '', supplierId: null });
        expect(component.suppliers).toEqual([]);
        expect(component.searched).toBeFalse();
        expect(component.error).toBe('');
    });
});
