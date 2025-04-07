import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfessorService {
  private baseUrl = 'http://127.0.0.1:3000/api'; // Update with your backend host/port

  constructor(private http: HttpClient) {}

  getAllProfessors(): Observable<any> {
    return this.http.get('http://127.0.0.1:3000/api/professors/');
  }

  getProfessorByName(name: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/professors/name/${encodeURIComponent(name)}`);
  }
  updateProfessor(id: string, data: any) {
    return this.http.put(`http://127.0.0.1:3000/api/professors/${id}`, data);
  }
}
