import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { APP_APIS } from '../../../core/constants/app-apis';
import { environment } from '../../../../environments/environment.development';
import { PaginatedProjects, Project } from '../interfaces/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectServiceService {


constructor(private http: HttpClient) {}

  createProject(name: string, description: string): Observable<any> {
    const token = localStorage.getItem('access_token'); 

   const headers = new HttpHeaders({
  apikey: environment.supabaseAnonKey,
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});

    const body = { name, description };

    return this.http.post(APP_APIS.PROJECTS.create, body, { headers });
  }


 
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token') || '';
    return new HttpHeaders({
      apikey: environment.supabaseAnonKey,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Prefer: 'count=exact',
    });
  }
 
 getProjects(limit: number, offset: number): Observable<PaginatedProjects> {
  const params = new HttpParams()
    .set('limit', limit)
    .set('offset', offset);

  return this.http.get<Project[]>(
    APP_APIS.PROJECTS.getList,
    {
      headers: this.getHeaders(),
      params,
      observe: 'response',
    }
  ).pipe(
    map(res => {
      const contentRange = res.headers.get('Content-Range');
      const total = contentRange
        ? Number(contentRange.split('/')[1])
        : 0;

      return {
        data: res.body ?? [],
        total
      };
    })
  );
}
}
