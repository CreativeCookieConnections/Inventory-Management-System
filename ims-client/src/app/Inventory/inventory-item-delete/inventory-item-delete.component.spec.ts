/**
 * Author: Shannon Kueneke
 * Date: 07/14/2026
 * File: ims-client/src/app/Inventory/inventory-item-delete/inventory-item-delete.component.spec.ts
 * Description: Unit tests for InventoryItemDeleteComponent. window.confirm
 * is spied on/stubbed via the component's confirmDelete() wrapper so tests
 * don't trigger a real browser dialog. HttpClientTestingModule intercepts
 * the DELETE request instead of hitting a real API; ActivatedRoute is
 * stubbed to provide the :id route param.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { InventoryItemDeleteComponent } from './inventory-item-delete.component';
import { environment } from '../../../environments/environment';

const itemId = '650c1f1e1c9d440000a1b1c1';
const expectedUrl = `${environment.apiBaseUrl}/api/inventory-items/${itemId}`;

describe('InventoryItemDeleteComponent', () => {
  let component: InventoryItemDeleteComponent;
  let fixture: ComponentFixture<InventoryItemDeleteComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryItemDeleteComponent, HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap({ id: itemId }) },
          },
        },
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(InventoryItemDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit -> reads :id from route
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Test 1: cancelling the confirm dialog should not call the DELETE API
  it('should not send a DELETE request when the user cancels the confirm dialog', () => {
    spyOn(component, 'confirmDelete').and.returnValue(false);

    component.onDeleteClick();

    expect(component.confirmDelete).toHaveBeenCalled();
    expect(component.successMessage).toBe('');
    httpMock.expectNone(expectedUrl);
  });

  // Test 2: confirming the dialog calls DELETE and shows an on-page
  // success message when the request succeeds
  it('should delete the item and show a success message when confirmed', () => {
    spyOn(component, 'confirmDelete').and.returnValue(true);

    component.onDeleteClick();

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('DELETE');

    req.flush({ message: 'Inventory item deleted successfully' });

    expect(component.successMessage).toBe('Inventory item deleted successfully.');
    expect(component.errorMessage).toBe('');
    expect(component.deleting).toBeFalse();

    const compiled = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
    expect(compiled.textContent).toContain('Inventory item deleted successfully.');
  });

  // Test 3: confirming the dialog calls DELETE and shows an on-page error
  // message when the request fails
  it('should show an on-page error message when the delete request fails', () => {
    spyOn(component, 'confirmDelete').and.returnValue(true);

    component.onDeleteClick();

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('DELETE');

    req.flush(
      { message: 'Inventory item not found' },
      { status: 404, statusText: 'Not Found' }
    );

    expect(component.errorMessage).toBe(
      'Unable to delete inventory item. Please try again.'
    );
    expect(component.successMessage).toBe('');
    expect(component.deleting).toBeFalse();

    const compiled = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
    expect(compiled.textContent).toContain('Unable to delete inventory item.');
  });
});
