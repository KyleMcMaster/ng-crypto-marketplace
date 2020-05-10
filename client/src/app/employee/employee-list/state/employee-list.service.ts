import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { EnvService } from 'src/app/shared/env.service';
import {
  Employee,
  EmployeeResponse,
  EmployeeUpdate,
} from './employee-list.model';
import { EmployeeListStore } from './employee-list.store';

@Injectable({ providedIn: 'root' })
export class EmployeeListService {
  private readonly apiRootUrl: string;

  constructor(
    private http: HttpClient,
    envService: EnvService,
    private store: EmployeeListStore,
    private toastr: ToastrService,
  ) {
    this.apiRootUrl = envService.apiRootUrl;
  }

  getEmployees() {
    this.store.setLoading(true);
    return this.http
      .get<EmployeeResponse>(`${this.apiRootUrl}/Employees`)
      .pipe(
        catchError((err) => {
          this.store.setError({
            message: 'Could not load employees',
          });
          return of([]);
        }),
        map((response: EmployeeResponse) => response.data),
      )
      .subscribe({
        next: (response) => this.store.set(response),
        complete: () => this.store.setLoading(false),
      });
  }

  updateEmployeeStatus(employee: Employee) {
    this.store.setLoading(true);

    const status = employee.status === 'Enabled' ? 'Disabled' : 'Enabled';

    const employeeUpdate: EmployeeUpdate = {
      department: employee.department,
      status,
    };

    return this.http
      .put<Employee>(
        `${this.apiRootUrl}/Employees/${employee.id}/status`,
        employeeUpdate,
      )
      .pipe(
        catchError((err) => {
          console.log(`Could not update employee ${employee.id}`);
          return throwError(err);
        }),
      )
      .subscribe({
        next: (detail) => {
          this.toastr.show('Employee sucessfully updated!');
          this.store.upsert(detail.id, detail);
        },
        complete: () => this.store.setLoading(false),
      });
  }
}
