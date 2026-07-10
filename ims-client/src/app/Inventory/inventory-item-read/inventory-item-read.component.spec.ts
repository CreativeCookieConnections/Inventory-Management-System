/**
 * Author: Shannon Kueneke
 * Date: 07/09/2026
 * File: ims-client/src/app/Inventory/inventoryItem-read/inventoryItem-read.component.spec.ts
 * Description: Unit tests for ReadInventoryItemComponent, covering both
 * ways it can be reached now that InventoryItemLookupComponent has been
 * merged in: (a) a route-provided :id, which auto-searches on init, and
 * (b) no route id, where the user types one into the form and submits.
 * HttpClientTestingModule intercepts the GET request instead of hitting a
 * real API; ActivatedRoute is stubbed to control the :id route param.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import {
  InventoryItem,
  ReadInventoryItemComponent,
} from './inventory-item-read.component';
import { environment } from '../../../environments/environment';

const mockItem: InventoryItem = {
  _id: '650c1f1e1c9d440000a1b1c1',
  categoryId: 1000,
  supplierId: 1,
  name: 'Laptop',
  description: 'High-end gaming laptop',
  quantity: 10,
  price: 1500,
  dateCreated: '2021-01-01T00:00:00.000Z',
  dateModified: '2021-01-01T00:00:00.000Z',
};

const expectedUrl = `${environment.apiBaseUrl}/api/inventory-items/${mockItem._id}`;

// --- Mode 1: reached via /inventory-items/:id (route provides the id) ---
describe('ReadInventoryItemComponent (with route id)', () => {
  let component: ReadInventoryItemComponent;
  let fixture: ComponentFixture<ReadInventoryItemComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadInventoryItemComponent, HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap({ id: mockItem._id }) },
          },
        },
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ReadInventoryItemComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Test 1: a route id pre-fills the form and searches automatically
  it('should pre-fill the form and auto-search when a route id is present', () => {
    fixture.detectChanges(); // triggers ngOnInit -> HTTP GET

    expect(component.lookupForm.value.id).toBe(mockItem._id);

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockItem);

    fixture.detectChanges();

    expect(component.loading).toBeFalse();
    expect(component.item).toEqual(mockItem);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Laptop');
  });

  // Test 2: a 404 from a route-provided id shows the inline error message
  it('should show an inline error when the route id is not found', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(expectedUrl);
    req.flush(
      { message: 'Inventory item not found' },
      { status: 404, statusText: 'Not Found' }
    );

    fixture.detectChanges();

    expect(component.loading).toBeFalse();
    expect(component.error).toBe('Inventory item not found.');
    expect(component.item).toBeNull();
  });
});

// --- Mode 2: reached via /inventory-items/lookup (no route id, manual search) ---
describe('ReadInventoryItemComponent (no route id — manual search)', () => {
  let component: ReadInventoryItemComponent;
  let fixture: ComponentFixture<ReadInventoryItemComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadInventoryItemComponent, HttpClientTestingModule],
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
    fixture = TestBed.createComponent(ReadInventoryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Test 3: no route id means an empty, untouched form and no auto-search
  it('should create with an empty, invalid form and no prior search', () => {
    expect(component).toBeTruthy();
    expect(component.lookupForm.invalid).toBeTrue();
    expect(component.hasSearched).toBeFalse();
    httpMock.expectNone(expectedUrl);
  });

  // Test 4: submitting a blank id makes no HTTP call and flags the field
  it('should not send a request when submitted with a blank id', () => {
    component.onSubmit();

    expect(component.idControl.touched).toBeTrue();
    expect(component.hasSearched).toBeFalse();
    httpMock.expectNone(expectedUrl);
  });

  // Test 5: a manually-entered, valid id fetches and renders inline —
  // still on the same page, no navigation involved
  it('should fetch and render the item inline below the form on manual search', () => {
    component.lookupForm.setValue({ id: mockItem._id });
    component.onSubmit();

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockItem);

    fixture.detectChanges();

    expect(component.hasSearched).toBeTrue();
    expect(component.item).toEqual(mockItem);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Laptop');
  });
});
