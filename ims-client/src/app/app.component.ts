import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, RouterModule],
  template: `
<!--
  AppComponent (selector: app-root)
  Route: /
  TDD Section 4.2 (Component Documentation): Root application component
  that bootstraps the Angular app, renders the navigation bar, and hosts the
  router outlet for all child views.

  This template only owns the persistent app shell (navbar) shown on view.
  The page title band (.page-header), toolbar, and content itself belong to each routed child component
  (e.g. ListInventoryItemsComponent, CreateInventoryItemComponent), which are
  rendered into <router-outlet>. Classes reference styles.css.
-->
<div class="app-shell">

  <!-- Persistent top navigation — matches wireframe header bar -->
  <nav class="navbar">
    <h1 class="navbar__brand">IMS — Inventory Management System</h1>

    <ul class="navbar__links">
      <li>
        <a
          class="navbar__link"
          routerLink="/inventory-items"
          routerLinkActive="navbar__link--active"
          [routerLinkActiveOptions]="{ exact: false }"
        >
          Inventory
        </a>
      </li>
      <li>
        <a
          class="navbar__link"
          routerLink="/suppliers"
          routerLinkActive="navbar__link--active"
          [routerLinkActiveOptions]="{ exact: false }"
        >
          Suppliers
        </a>
      </li>
    </ul>
  </nav>

  <!-- Routed views (ListInventoryItemsComponent, CreateInventoryItemComponent,
       ListSuppliersComponent, etc.) render here, each supplying its own
       .page-header and .page-content per the wireframes. -->
  <router-outlet></router-outlet>

</div>
  `,
  styleUrl: '../styles.css',
})

export class AppComponent {
  title = 'Inventory Management System (IMS)';

}
