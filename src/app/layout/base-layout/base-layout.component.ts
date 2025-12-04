import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CoreLayoutComponent } from '../core-layout/core-layout.component';
import { SidebarComponent } from '@layout/sidebar/sidebar.component';
import { SidebarNavigation } from '@core/models/navigation';

@Component({
  standalone: true,
  selector: 'base-layout',
  templateUrl: './base-layout.component.html',
  imports: [
    RouterOutlet,
    SidebarComponent
  ],
  styleUrls: ['./base-layout.component.scss']
})
export class BaseLayoutComponent extends CoreLayoutComponent {
  navigation: SidebarNavigation = [
    {
      title: 'Menu',
      items: [
        {
          id: 'dashboard',
          icon: 'dashboard',
          title: 'Dashboard',
          url: '/dashboard',
        },
        {
          id: 'booking-item',
          icon: 'add_circle',
          title: 'Book Room',
          url: '/booking/item/create',
        },
        {
          id: 'booking-list',
          icon: 'event_available',
          title: 'My Bookings',
          url: '/booking/items',
        },
      ]
    },
    {
      title: 'Admin',
      items: [
        {
          id: 'overview',
          icon: 'dashboard',
          title: 'Overview',
          url: '/admin/overview',
        },
        {
          id: 'rooms',
          icon: 'door_open',
          title: 'Rooms',
          url: '/admin/rooms',
        },
        {
          id: 'users',
          icon: 'group',
          title: 'Users',
          url: '/admin/users',
        },
      ]
    }
  ];
}
