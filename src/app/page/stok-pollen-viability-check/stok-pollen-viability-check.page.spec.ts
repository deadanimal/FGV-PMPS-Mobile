import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StokPollenViabilityCheckPage } from './stok-pollen-viability-check.page';

describe('StokPollenViabilityCheckPage', () => {
  let component: StokPollenViabilityCheckPage;
  let fixture: ComponentFixture<StokPollenViabilityCheckPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StokPollenViabilityCheckPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StokPollenViabilityCheckPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
