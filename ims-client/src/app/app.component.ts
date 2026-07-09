/**
 * Author: Inventory Management System Group 3
 * Date: 07/08/2026
 * File: app.component.ts
 * Description: This file contains the main component of the Inventory Management System application. It serves as the root component that bootstraps the application and provides the overall structure and layout for the user interface. The component is responsible for rendering the main navigation, header, footer, and routing to different views within the application.
 */

import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  template: `
   <router-outlet />
  `,
  styles: `
  
  `
})
export class AppComponent {

}

