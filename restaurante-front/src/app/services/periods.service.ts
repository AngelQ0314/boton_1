import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PeriodsService {
  private baseUrl = 'http://localhost:3000/periods';

  constructor(private http: HttpClient) {}

  getPeriods(filters: any): Observable<any[]> {
    let params = new HttpParams();

    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params = params.set(key, filters[key]);
      }
    });

    console.log('URL:', this.baseUrl);
    console.log('Params:', params.toString());

    return this.http.get<any[]>(this.baseUrl, { params });
  }
}
