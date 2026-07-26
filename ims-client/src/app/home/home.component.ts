import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div id="wrapper">
      <header class="marquee">
        <h2>
          <span class="marquee__letter">I</span>nventory
          <span class="marquee__letter">M</span>anagement
          <span class="marquee__letter">S</span>ystem
        </h2>
      </header>
      <section class="landing">
        <main>
          <!--SK: adding in smaller product name and navigational tiles to each feature-->

          <section id="inventoryTiles">
            <a class="tile" routerLink="/inventory-items">
              <p>Inventory List <br />(View, Edit, Delete)</p>
            </a>

            <a class="tile" routerLink="/inventory-items/add">
              <p>Add New Inventory Item</p>
            </a>

            <a class="tile" routerLink="/inventory-items/lookup">
              <p>Lookup Inventory Item By ID</p>
            </a>

            <a class="tile" routerLink="/inventory-items/search">
              <p>Inventory Search by Name, Category ID or Supplier ID</p>
            </a>
          </section>

          <section id="supplierTiles">
            <a class="tile" routerLink="/suppliers">
              <p>Supplier List <br />(View, Edit, Delete)</p>
            </a>

            <a class="tile" routerLink="/suppliers/add">
              <p>Add New Supplier</p>
            </a>

            <a class="tile" routerLink="/suppliers/lookup">
              <p>Lookup Supplier By ID</p>
            </a>
          </section>
        </main>

        <div class="login-card">
          <h2 class="login-card__title">Sign In</h2>

          <label class="login-card__field">
            Username
            <input
              type="text"
              name="username"
              placeholder="Type anything"
              [(ngModel)]="username"
            />
          </label>

          <label class="login-card__field">
            Password
            <input
              type="password"
              name="password"
              placeholder="Type anything"
              [(ngModel)]="password"
            />
          </label>

          <button
            type="button"
            class="btn btn--primary login-card__submit"
            (click)="signIn()"
          >
            Sign In
          </button>
        </div>
      </section>
    </div>
  `,
  styles: `
    #wrapper {
      background: linear-gradient(
        135deg,
        #ffdede 0%,
        #f5f7fa 45%,
        #cde3ff 100%
      );
      padding: var(--space-6);
      min-height: 100dvh;
    }

    .landing {
      display: flex;
      justify-content: center;
      gap: 6rem;
    }

    .marquee {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
      margin-right: 3rem;
      font-family: 'DM Serif Display', 'Georgia', serif;
    }

    .marquee h2 {
      margin: 0 auto;
    }

    .marquee__line {
      font-size: 7rem;
      font-weight: 700;
      color: #4a7dc4;
    }

    .marquee__letter {
      color: #c0392b;
      font-size: 1.5em;
    }

    main {
      display: flex;
    }

    .login-card,
    .tile {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
      width: 280px;
      padding: var(--space-6);
      background: rgba(255, 255, 255, 0.35);
      border: 1px solid rgba(74, 125, 196, 0.25);
      border-radius: 10px;
    }

    .tile {
      margin: 2em;
      padding: var(--space-2);
      text-decoration:none;
      color:var(--color-text-primary);
    }

    .tile:hover {
      background:#fff;
    }

    .tile p {
      text-align: center;
      font-weight: bold;
      line-height: 1.5em;
    }

    .login-card__title {
      margin: 0 0 var(--space-2) 0;
    }

    .login-card__field {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .login-card__field input {
      font-weight: 400;
      padding: var(--space-2) var(--space-3);
      border: 1px solid #d5dbe3;
      border-radius: 6px;
      font-size: 0.95rem;
    }

    .login-card__submit {
      margin-top: var(--space-2);
    }
  `,
})
export class HomeComponent {
  // Not validated or checked against anything — purely cosmetic fields.
  username = '';
  password = '';

  constructor(private router: Router) {}

  // No real auth — always routes to the inventory list, regardless of what (if anything) was typed above.
  signIn(): void {
    this.router.navigate(['/inventory-items']);
  }
}
