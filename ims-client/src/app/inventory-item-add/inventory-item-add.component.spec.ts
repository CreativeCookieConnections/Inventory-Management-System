import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryItemAddComponent } from './inventory-item-add.component';

describe('InventoryItemAddComponent', () => {
  let component: InventoryItemAddComponent;
  let fixture: ComponentFixture<InventoryItemAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryItemAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryItemAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
