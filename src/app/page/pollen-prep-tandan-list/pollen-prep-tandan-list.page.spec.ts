import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PollenPrepTandanListPage } from './pollen-prep-tandan-list.page';

describe('PollenPrepTandanListPage', () => {
  let component: PollenPrepTandanListPage;
  let fixture: ComponentFixture<PollenPrepTandanListPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PollenPrepTandanListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PollenPrepTandanListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
