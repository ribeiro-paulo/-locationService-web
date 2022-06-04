import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Position } from '../../models/position';
import { retry, catchError } from 'rxjs/operators';
import * as moment from 'moment';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  url = '/posicao/'
  constructor(private httpClient: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  getPositions(board?: string, date?: Date): Observable<Position[]> {
    let newDate = ''
    if(date){
      newDate = moment(date).format('MM/DD/YYYY');
    }
    let p = board && date ? `?placa=${ board }&data=${ date }` : board ? `?placa=${ board }` : date ? `?data=${ newDate }` : `` ;
    return this.httpClient.get<Position[]>(`${environment.apiURL}${this.url}${ p }`)
      .pipe(
        retry(2),
        catchError(this.handleError))
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Código do erro: ${error.status}, ` + `menssagem: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  };
}
