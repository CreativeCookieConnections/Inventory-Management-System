import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="landing">

      <div class="marquee">
        <div class="marquee__line">
          <span class="marquee__letter">I</span>nventory
        </div>
        <div class="marquee__line">
          <span class="marquee__letter">M</span>anagement
        </div>
        <div class="marquee__line">
          <span class="marquee__letter">S</span>olutions
        </div>
      </div>

      <div class="login-card">
        <h2 class="login-card__title">Sign In</h2>

        <label class="login-card__field">
          Username
          <input type="text" name="username" placeholder="Type anything" [(ngModel)]="username" />
        </label>

        <label class="login-card__field">
          Password
          <input type="password" name="password" placeholder="Type anything" [(ngModel)]="password" />
        </label>

        <button type="button" class="btn btn--primary login-card__submit" (click)="signIn()">
          Sign In
        </button>
      </div>
    </section>
  `,
  styles: `
    .landing {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6rem;
      min-height: 100dvh;
      padding: var(--space-6);
      background: linear-gradient(135deg, #ffdede 0%, #f5f7fa 45%, #cde3ff 100%);
    }

    .marquee {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
      margin-right: 3rem;
      font-family: 'DM Serif Display', 'Georgia', serif;
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

    .login-card {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
      width: 280px;
      padding: var(--space-6);
      background: rgba(255, 255, 255, 0.35);
      border: 1px solid rgba(74, 125, 196, 0.25);
      border-radius: 10px;
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
  `
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
