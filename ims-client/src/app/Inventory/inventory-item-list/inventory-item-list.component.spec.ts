/**
 * Author: Nicholas Skelton
 * Date: 07/10/2026
 * File: inventory-item-list.component.spec.ts
 * Description: Unit tests for InventoryItemListComponent — verifies items
 * are fetched and rendered, sort toggling works correctly in both
 * directions, the derived totalValue sort is computed correctly, and the
 * error state is set when the API call fails.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { InventoryItemListComponent } from './inventory-item-list.component';
import { environment } from '../../../environments/environment';

describe('InventoryItemListComponent', () => {
  let component: InventoryItemListComponent;
  let fixture: ComponentFixture<InventoryItemListComponent>;
  let httpMock: HttpTestingController;

  const mockItems = [
    {
      _id: '1',
      categoryId: 1000,
      supplierId: 1,
      name: 'Wireless Mouse',
      description: 'Ergonomic wireless mouse',
      quantity: 50,
      price: 25.99
    },
    {
      _id: '2',
      categoryId: 1000,
      supplierId: 1,
      name: 'Laptop',
      description: 'High-end gaming laptop',
      quantity: 10,
      price: 1500
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryItemListComponent, HttpClientTestingModule],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryItemListComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch inventory items on init and populate items', () => {
    fixture.detectChanges(); // triggers ngOnInit -> loadItems()

    const req = httpMock.expectOne(
      `${environment.apiBaseUrl}/api/inventory-items`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockItems);

    expect(component.items.length).toBe(2);
    expect(component.loading).toBeFalse();
    expect(component.error).toBe('');
  });

  it('should set an error message when the API call fails', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(
      `${environment.apiBaseUrl}/api/inventory-items`
    );
    req.flush('failure', { status: 500, statusText: 'Server Error' });

    expect(component.loading).toBeFalse();
    expect(component.error).toContain('Unable to load inventory items');
  });

  it('should compute and sort by totalValue (price * quantity)', () => {
    component.items = mockItems;

    // Wireless Mouse: 25.99 * 50 = 1299.5
    // Laptop: 1500 * 10 = 15000
    component.setSort('totalValue');
    expect(component.sortedItems[0].name).toBe('Wireless Mouse');

    component.setSort('totalValue'); // toggle to desc
    expect(component.sortedItems[0].name).toBe('Laptop');
  });
});
