import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of, defer } from 'rxjs';
import { Hero } from './hero';
import { HeroService } from './hero.service';
import { MessageService } from './message.service';

// Create async observable error that errors
//  after a JS engine turn
export function asyncError<T>(errorObject: any) {
  return defer(() => Promise.reject(errorObject));
}

describe('HeroService', () => {
  let systemUnderTest: HeroService;
  let httpClientMock: jasmine.SpyObj<HttpClient>;  
  let messageServiceMock: jasmine.SpyObj<MessageService>;

  beforeEach(() => {
    // TODO: spy on other methods too
    httpClientMock = jasmine.createSpyObj('HttpClient', ['get']);
    messageServiceMock = jasmine.createSpyObj('MessageService', ['add']);
    systemUnderTest = new HeroService(httpClientMock, messageServiceMock);
  });

  it('should be created', () => {
    expect(systemUnderTest).toBeTruthy();
  });

  it('should return expected heroes (HttpClient called once)', (done: DoneFn) => {
    // arrange
    const expectedHeroes: Hero[] = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];  
    httpClientMock.get.and.returnValue(of(expectedHeroes));

    // act
    systemUnderTest.getHeroes().subscribe(

    // assert
      heroes => {
        expect(heroes).toEqual(expectedHeroes, 'expected heroes');
        done();
      },
      done.fail
    );
    
  
    expect(httpClientMock.get.calls.count()).toBe(1, 'one call');
  });
  
  it('should catch an error when the server returns a 404', (done: DoneFn) => {
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404, statusText: 'Not Found'
    });

    httpClientMock.get.and.returnValue(asyncError(errorResponse));

    // act
    systemUnderTest.getHeroes().subscribe(
      
    // assert
      heroes => {
        expect(heroes).toEqual([], 'expected heroes');
        done();
      },
      done.fail
    );
   });
});