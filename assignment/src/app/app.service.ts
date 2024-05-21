import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from './model/user';

@Injectable({
  providedIn: 'root'
})

export class AppService {

  serviceURL = 'http://localhost:8080';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  user = new User();

  constructor(private http: HttpClient) { }

  createUser(data): Observable<any> {
    const url = `${this.serviceURL}/addUser`;
    return this.http.post(url, data)
      .pipe(
        catchError(this.errorMgmt)
      );
  }

  getUsers() {
    return this.http.get(`${this.serviceURL}/getallUser`);
  }

  getUser(id): Observable<any> {
    const url = `${this.serviceURL}/getUser/${id}`;
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  createParfume(data): Observable<any> {
    const url = `${this.serviceURL}/addParfume`;
    return this.http.post(url, data)
      .pipe(
        catchError(this.errorMgmt)
      );
  }

  checkParfumeCode(code: string): Observable<boolean> {
    const url = `${this.serviceURL}/checkParfumeCode/${code}`;
    return this.http.get<{ exists: boolean }>(url).pipe(
      map(response => response.exists),
      catchError(this.errorMgmt)
    );
  }

  getParfume() {
    return this.http.get(`${this.serviceURL}/getParfume`);
  }

  deleteParfume(id): Observable<any> {
    const url = `${this.serviceURL}/deleteParfume/${id}`;
    return this.http.delete(url, { headers: this.headers })
      .pipe(
        catchError(this.errorMgmt)
      );
  }

  updateParfume(id: string, data: any): Observable<any> {
    const url = `${this.serviceURL}/updateParfume/${id}`;
    return this.http.put(url, data, { headers: this.headers })
      .pipe(
        catchError(this.errorMgmt)
      );
  }

  setLoggedInUser(user){
    this.user = user;
  }

  getLoggedInUser(){
    return this.user;
  }

  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    alert(errorMessage);
    return throwError(errorMessage);
  }
}
