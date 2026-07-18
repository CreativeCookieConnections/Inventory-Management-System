/**
 * Author: Nicholas Skelton
 * Date: 07/16/2026
 * File: inventory-item-search.component.spec.ts
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { InventoryItemSearchComponent } from './inventory-item-search.component';
import { environment } from '../../../environments/environment';

describe('InventoryItemSearchComponent', () => {
  let component: InventoryItemSearchComponent;
  let fixture: ComponentFixture<InventoryItemSearchComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryItemSearchComponent, HttpClientTestingModule],
      // The component's template uses routerLink, which needs a Router available via DI even though no navigation actually happens in these tests.
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryItemSearchComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Fail the test loudly if a spec forgets to resolve a request, rather than letting it silently leak into the next test.
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate items on a successful search', () => {
    component.filters.name = 'keyboard';
    component.search();

    const req = httpMock.expectOne(
      (r) => r.url === `${environment.apiBaseUrl}/api/inventory-items/search`
    );
    expect(req.request.params.get('name')).toBe('keyboard');

    const mockItems = [
      { _id: '1', name: 'Mechanical Keyboard', description: 'RGB mechanical keyboard', categoryId: 1, supplierId: 1, quantity: 5, price: 49.99 }
    ];
    req.flush(mockItems);

    expect(component.items).toEqual(mockItems);
    expect(component.loading).toBeFalse();
    expect(component.searched).toBeTrue();
  });

  it('should reset filters and results on clear()', () => {
    component.filters = { name: 'keyboard', categoryId: 2, supplierId: 3 };
    component.items = [
      { _id: '1', name: 'Mechanical Keyboard', description: 'RGB mechanical keyboard', categoryId: 1, supplierId: 1, quantity: 5, price: 49.99 }
    ];
    component.searched = true;

    component.clear();

    expect(component.filters).toEqual({ name: '', categoryId: null, supplierId: null });
    expect(component.items).toEqual([]);
    expect(component.searched).toBeFalse();
  });
});
