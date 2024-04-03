import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { Hero } from '../interfaces/hero.interface';
import { environment } from '../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class HeroesService {
  private readonly baseUrl: string = environment.baseUrl;

  constructor(private readonly httpClient: HttpClient) {}

  getHeroes(): Observable<Hero[]> {
    return this.httpClient.get<Hero[]>(this.baseUrl + '/heroes');
  }

  getHeroById(id: string): Observable<Hero | undefined> {
    return this.httpClient
      .get<Hero>(this.baseUrl + '/heroes/' + id)
      .pipe(catchError((err) => of(undefined)));
  }

  getSuggestions(q: string): Observable<Hero[]> {
    const url = new URL(this.baseUrl + '/heroes');
    url.searchParams.append('_limit', '6');
    url.searchParams.append('q', q);

    return this.httpClient.get<Hero[]>(url.href);
  }

  addHero(hero: Hero): Observable<Hero> {
    const url = new URL(this.baseUrl + '/heroes');
    return this.httpClient.post<Hero>(url.href, hero);
  }

  updateHero(hero: Hero): Observable<Hero> {
    if (!hero.id) throw new Error('Hero id is required to update a hero');

    const url = new URL(this.baseUrl + '/heroes/' + hero.id);
    return this.httpClient.patch<Hero>(url.href, hero);
  }

  deleteHeroById(id: string): Observable<boolean> {
    if (!id) throw new Error('Hero id is required to update a hero');

    const url = new URL(this.baseUrl + '/heroes/' + id);
    return this.httpClient.delete(url.href).pipe(
      map((resp) => true),
      catchError((err) => of(false))
    );
  }
}
