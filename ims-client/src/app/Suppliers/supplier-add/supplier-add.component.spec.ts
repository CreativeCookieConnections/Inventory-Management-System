/**
 * Author: Aisha Keller
 * Date: 07/22/2026
 * File: ims-client/src/app/Suppliers/supplier-add/supplier-add.component.spec.ts
 * Description: Unit tests for the SupplierAddComponent.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SupplierAddComponent } from './supplier-add.component';
import { environment } from '../../../environments/environment';

describe('SupplierAddComponent', () => {
  let component: SupplierAddComponent;
  let fixture: ComponentFixture<SupplierAddComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierAddComponent, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SupplierAddComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Test for form submission with invalid data | Sprint 3 | Week 3

  it('should not submit when form is invalid', () => {
    component.supplierForm.patchValue({
      supplierId: 1,
      supplierName: '',
      contactInformation: 'acme@example.com',
      address: '123 Main St'
    });

    component.onSubmit();

    expect(component.supplierForm.invalid).toBeTrue();
    const requests = httpMock.match(() => true);
    expect(requests.length).toBe(0);
    expect(component.isSubmitting).toBeFalse();
  });

  // Test for successful form submission with valid data | Sprint 3 | Week 3

  it('should submit valid form and show success message', () => {
    const payload = {
      supplierId: 10,
      supplierName: 'Acme Supplies',
      contactInformation: 'acme@example.com',
      address: '123 Main St'
    };

    component.supplierForm.patchValue(payload);
    component.onSubmit();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/suppliers`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);

    req.flush({ message: 'Supplier created successfully' });

    expect(component.successMessage).toContain('created successfully');
    expect(component.errorMessage).toBe('');
    expect(component.isSubmitting).toBeFalse();
  });

  // Test for server error response during form submission | Sprint 3 | Week 3

  it('should show error message when POST fails', () => {
    const payload = {
      supplierId: 10,
      supplierName: 'Acme Supplies',
      contactInformation: 'acme@example.com',
      address: '123 Main St'
    };

    component.supplierForm.patchValue(payload);
    component.onSubmit();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/suppliers`);
    expect(req.request.method).toBe('POST');

    req.flush(
      { message: 'Supplier already exists' },
      { status: 409, statusText: 'Conflict' }
    );

    expect(component.errorMessage).toBe('Supplier already exists');
    expect(component.successMessage).toBe('');
    expect(component.isSubmitting).toBeFalse();
  });
});