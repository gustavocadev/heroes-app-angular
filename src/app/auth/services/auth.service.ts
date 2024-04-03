import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { User } from '../interfaces/user.interface';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #baseUrl = environment.baseUrl;
  #user?: User;

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    if (token) {
      this.http
        .get<User>(`${this.#baseUrl}/users/${token}`)
        .subscribe((user) => {
          this.#user = user;
        });
    }
  }

  get currentUser(): User | undefined {
    if (!this.#user) return;
    return structuredClone(this.#user);
  }

  login(email: string, password: string): Observable<User> {
    // Login logic here
    return this.http.get<User>(`${this.#baseUrl}/users/1`).pipe(
      tap((user) => {
        this.#user = user;
      }),
      tap((user) => {
        localStorage.setItem('token', JSON.stringify(user.id));
      })
    );
  }

  checkAuthStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) return of(false);

    const url = `${this.#baseUrl}/users/1`;

    return this.http.get<User>(url).pipe(
      tap((user) => (this.#user = user)),
      map((user) => (user ? true : false)),
      catchError((err) => of(false))
    );
  }

  logout(): void {
    this.#user = undefined;
    localStorage.removeItem('token');
  }
}
