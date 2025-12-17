import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { SidebarNavigation } from '@core/models/navigation';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonComponent } from '@shared/components/button/button.component';
import { ThemeSwitcherComponent } from '@layout/sidebar/theme-switcher/theme-switcher.component';
import { LanguageSwitcherComponent } from '@layout/sidebar/language-switcher/language-switcher.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { AuthorizationService } from '@core/services/authorization';
import { toSignal } from '@angular/core/rxjs-interop';
import { pipe, Subject, takeUntil } from 'rxjs';

@Component({
  standalone: true,
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  imports: [
    MatIconModule,
    RouterLink,
    RouterLinkActive,
    ButtonComponent,
    ThemeSwitcherComponent,
    LanguageSwitcherComponent,
    TranslocoDirective,
  ],
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnDestroy {
  authService = inject(AuthorizationService);
  router = inject(Router);

  destroy$: Subject<void> = new Subject<void>();

  userState$ = toSignal(this.authService.authState$);
  logoutLoading = signal<boolean>(false);

  user = computed(() => this.userState$()?.user);
  userDisplayName = computed(() => {
    const userMetadata = this.user()?.user_metadata.data;

    if (userMetadata && (userMetadata['firstName'].length || userMetadata['lastName'].length)) {
      return `${userMetadata['firstName']} ${userMetadata['lastName']}`;
    } else {
      return this.user()?.email;
    }
  });

  navigation: SidebarNavigation = [
    {
      title: 'navigation',
      items: [
        {
          id: 'dashboard',
          icon: 'dashboard',
          title: 'navigation-items.dashboard',
          url: '/dashboard',
        },
        {
          id: 'booking-item',
          icon: 'add_circle',
          title: 'navigation-items.book-room',
          url: '/booking/item/create',
        },
        {
          id: 'booking-list',
          icon: 'event_available',
          title: 'navigation-items.my-bookings',
          url: '/booking/items',
        },
      ],
    },
    {
      title: 'admin',
      items: [
        {
          id: 'overview',
          icon: 'visibility',
          title: 'navigation-items.overview',
          url: '/admin/overview',
        },
        {
          id: 'rooms',
          icon: 'door_open',
          title: 'navigation-items.rooms',
          url: '/admin/rooms',
        },
        {
          id: 'users',
          icon: 'group',
          title: 'navigation-items.users',
          url: '/admin/users',
        },
      ],
    },
  ];

  logout() {
    this.logoutLoading.set(true);

    this.authService.logout().pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        void this.router.navigate(['/authorization']);
        this.logoutLoading.set(false);
      },
      error: (error) => {
        this.logoutLoading.set(false);
        console.error(error);
      },
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
