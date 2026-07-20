/**
 * Author: Shannon Kueneke
 * Date: 07/20/2026
 * File: ims-client/src/app/Suppliers/supplier-read/supplier-read.component.spec.ts
 * Description: Unit tests for ReadSupplierComponent, mirroring
 * ReadInventoryItemComponent's tests: (a) a route-provided :id, which
 * auto-searches on init, and (b) no route id, where the user types one
 * into the form and submits. HttpClientTestingModule intercepts the GET
 * request instead of hitting a real API; ActivatedRoute is stubbed to
 * control the :id route param.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import {
  ReadSupplierComponent,
  Supplier,
} from './supplier-read.component';
import { environment } from '../../../environments/environment';

const mockSupplier: Supplier = {
  _id: '650c1f1e1c9d440000a1b1c1',
  supplierId: 1,
  supplierName: 'Acme Supplies',
  contactInformation: 'acme@example.com',
  address: '123 Main St',
  dateCreated: '2021-01-01T00:00:00.000Z',
  dateModified: '2021-01-01T00:00:00.000Z',
};

// The route/form id is the supplier's business supplierId (e.g. "1"), not
// MongoDB's internal _id — matching the actual GET /api/suppliers/:id contract.
const lookupId = String(mockSupplier.supplierId);
const expectedUrl = `${environment.apiBaseUrl}/api/suppliers/${lookupId}`;

// --- Mode 1: reached via /suppliers/:id (route provides the id) ---
describe('ReadSupplierComponent (with route id)', () => {
  let component: ReadSupplierComponent;
  let fixture: ComponentFixture<ReadSupplierComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadSupplierComponent, HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap({ id: lookupId }) },
          },
        },
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ReadSupplierComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Test 1: a route id pre-fills the form and searches automatically
  it('should pre-fill the form and auto-search when a route id is present', () => {
    fixture.detectChanges(); // triggers ngOnInit -> HTTP GET

    expect(component.lookupForm.value.id).toBe(lookupId);

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockSupplier);

    fixture.detectChanges();

    expect(component.loading).toBeFalse();
    expect(component.supplier).toEqual(mockSupplier);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Acme Supplies');
  });

  // Test 2: a 404 from a route-provided id shows the inline error message
  it('should show an inline error when the route id is not found', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(expectedUrl);
    req.flush(
      { message: 'Supplier not found' },
      { status: 404, statusText: 'Not Found' }
    );

    fixture.detectChanges();

    expect(component.loading).toBeFalse();
    expect(component.error).toBe('Supplier not found.');
    expect(component.supplier).toBeNull();
  });
});

// --- Mode 2: reached via /suppliers/lookup (no route id, manual search) ---
describe('ReadSupplierComponent (no route id — manual search)', () => {
  let component: ReadSupplierComponent;
  let fixture: ComponentFixture<ReadSupplierComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadSupplierComponent, HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap({}) },
          },
        },
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ReadSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Test 3: a manually-entered, valid id fetches and renders inline —
  // still on the same page, no navigation involved
  it('should fetch and render the supplier inline below the form on manual search', () => {
    component.lookupForm.setValue({ id: lookupId });
    component.onSubmit();

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockSupplier);

    fixture.detectChanges();

    expect(component.hasSearched).toBeTrue();
    expect(component.supplier).toEqual(mockSupplier);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Acme Supplies');
  });
});
