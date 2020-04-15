import { Component } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { mapTo } from 'rxjs/operators';
import {
  Observable,
  fromEvent as observableFromEvent,
  merge as observableMerge,
  of as observableOf,
} from 'rxjs';

import { AuthService, PermissionService } from './shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Action Requests';
  isAdmin$: Observable<boolean>;
  user$: Observable<firebase.User>;

  online$: Observable<any>;
  snackBarRef: MatSnackBarRef<SimpleSnackBar>;

  constructor(
    private authService: AuthService,
    private permissionService: PermissionService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.isAdmin$ = this.permissionService.isAdmin();
    this.user$ = this.authService.user$;

    this.online$ = observableMerge(
      observableOf(navigator.onLine),
      observableFromEvent(window, 'online').pipe(mapTo(true)),
      observableFromEvent(window, 'offline').pipe(mapTo(false))
    );

    this.online$.subscribe((isOnline: boolean) => {
      if (!isOnline) {
        this.displayOfflineMessage();
      }
      if (isOnline && this.snackBarRef) {
        this.hideOfflineMessage();
      }
    });
  }

  goHome(): void {
    this.router.navigate(['']);
  }

  gotoRequests(): void {
    this.router.navigate(['requests']);
  }

  login(): void {
    this.authService.login();
  }

  logout(): void {
    this.authService.logout();
  }

  private displayOfflineMessage = (): void => {
    this.snackBarRef = this.snackBar.open(
      'You appear to be offline. Please check your connection.',
      'Reload'
    );
  };

  private hideOfflineMessage = (): void => {
    this.snackBarRef.dismiss();
  };
}
