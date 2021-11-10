import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaymentPeriod } from '../common/payment-period';

@Injectable({
  providedIn: 'root'
})
export class PaymentPeriodService {

  private paymentPeriodsUrl = `${environment.apiUrl}/paymentperiods`;

  constructor(private httpClient: HttpClient) { }

  getPaymentPeriodList(): Observable<PaymentPeriod[]> {
    return this.httpClient.get<PaymentPeriod[]>(this.paymentPeriodsUrl);
  }

  getPaymentPeriodListPaginate(page: number, size: number): Observable<GetResponsePaymentPeriods> {
    const paginateQueryParams = `?page=${page}&size=${size}`;
    return this.httpClient.get<GetResponsePaymentPeriods>(`${this.paymentPeriodsUrl}/byPage${paginateQueryParams}`);
  }

  createPaymentPeriod(paymentPeriod: PaymentPeriod): Observable<PaymentPeriod> {
    return this.httpClient.post<PaymentPeriod>(this.paymentPeriodsUrl, paymentPeriod);
  }

  updatePaymentPeriod(paymentPeriod: PaymentPeriod): Observable<any> {
    return this.httpClient.put<any>(`${this.paymentPeriodsUrl}/${paymentPeriod.id}`, paymentPeriod);
  }

  deletePaymentPeriod(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.paymentPeriodsUrl}/${id}`);
  }
}

interface GetResponsePaymentPeriods {
  content: PaymentPeriod[],
  pageable: {
    page: number,
    size: number
  },
  total: number
}