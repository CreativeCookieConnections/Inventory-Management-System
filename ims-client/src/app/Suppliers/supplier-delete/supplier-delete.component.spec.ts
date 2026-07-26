/**
 * Author: Shannon Kueneke
 * Date: 07/26/2026
 * File: ims-client/src/app/Suppliers/supplier-delete/supplier-delete.component.spec.ts
 * Description: Unit tests for SupplierDeleteComponent. window.confirm is
 * spied on/stubbed via the component's confirmDelete() wrapper so tests
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
import { SupplierDeleteComponent } from './supplier-delete.component';
import { environment } from '../../../environments/environment';

const supplierId = '1';
const expectedUrl = `${environment.apiBaseUrl}/api/suppliers/${supplierId}`;

describe('SupplierDeleteComponent', () => {
  let component: SupplierDeleteComponent;
  let fixture: ComponentFixture<SupplierDeleteComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierDeleteComponent, HttpClientTestingModule],
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
    fixture = TestBed.createComponent(SupplierDeleteComponent);
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
  it('should delete the supplier and show a success message when confirmed', () => {
    spyOn(component, 'confirmDelete').and.returnValue(true);

    component.onDeleteClick();

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('DELETE');

    req.flush({ message: 'Supplier deleted successfully' });

    expect(component.successMessage).toBe('Supplier deleted successfully.');
    expect(component.errorMessage).toBe('');
    expect(component.deleting).toBeFalse();

    const compiled = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
    expect(compiled.textContent).toContain('Supplier deleted successfully.');
  });

  // Test 3: confirming the dialog calls DELETE and shows an on-page error
  // message when the request fails
  it('should show an on-page error message when the delete request fails', () => {
    spyOn(component, 'confirmDelete').and.returnValue(true);

    component.onDeleteClick();

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('DELETE');

    req.flush(
      { message: 'Supplier not found' },
      { status: 404, statusText: 'Not Found' }
    );

    expect(component.errorMessage).toBe(
      'Unable to delete supplier. Please try again.'
    );
    expect(component.successMessage).toBe('');
    expect(component.deleting).toBeFalse();

    const compiled = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
    expect(compiled.textContent).toContain('Unable to delete supplier.');
  });
});
