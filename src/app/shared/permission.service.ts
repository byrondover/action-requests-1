import { Injectable } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable()
export class PermissionService {
  constructor(public authService: AuthService) {}

  private handleError(): Observable<boolean> {
    return observableOf(false);
  }

  isAdmin(): Observable<boolean> {
    return observableOf(true);
  }

  isAuthenticated(): Observable<boolean> {
    return this.authService.user$.pipe(map((user) => !!user));
  }
}
