import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService, CartItem } from '../services/cart.service';
import { NavComponent } from '../shared/nav/nav.component';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, NavComponent],
  template: `
    <app-nav></app-nav>
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Carrito de Compras</h1>
      <div *ngIf="cartItems.length === 0" class="text-center text-gray-500">
        El carrito está vacío.
      </div>
      <div *ngFor="let item of cartItems" class="flex items-center border-b border-gray-200 py-4">
        <img [src]="'https://back-store-v1.onrender.com' + item.imagenUrl" [alt]="item.nombre_producto" class="w-20 h-20 object-cover mr-4">
        <div class="flex-grow">
          <h2 class="text-lg font-semibold">{{ item.nombre_producto }}</h2>
          <p class="text-gray-600">Precio: {{ item.precio | currency:'COP':'symbol-narrow':'1.0-0' }}</p>
          <div class="flex items-center mt-2">
            <button (click)="updateQuantity(item.id, item.cantidad - 1)" class="bg-gray-200 px-2 py-1 rounded-l">-</button>
            <span class="bg-gray-100 px-4 py-1">{{ item.cantidad }}</span>
            <button (click)="updateQuantity(item.id, item.cantidad + 1)" class="bg-gray-200 px-2 py-1 rounded-r">+</button>
          </div>
        </div>
        <div class="text-right">
          <p class="text-lg font-semibold">{{ item.precio * item.cantidad | currency:'COP':'symbol-narrow':'1.0-0' }}</p>
          <button (click)="removeFromCart(item.id)" class="text-red-500 hover:text-red-700 mt-2">Eliminar</button>
        </div>
      </div>
      <div *ngIf="cartItems.length > 0" class="mt-8">
        <p class="text-xl font-bold">Total: {{ cartTotal | currency:'COP':'symbol-narrow':'1.0-0' }}</p>
        <button (click)="proceedToCheckout()" class="bg-green-500 text-white px-6 py-2 rounded mt-4 hover:bg-green-600">
          Proceder al pago
        </button>
      </div>
    </div>
  `,
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  cartTotal = 0;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.cartTotal = this.cartService.getCartTotal();
    });
  }

  updateQuantity(id: number, quantity: number) {
    if (quantity > 0) {
      this.cartService.updateQuantity(id, quantity);
    }
  }

  removeFromCart(id: number) {
    this.cartService.removeFromCart(id);
  }

  proceedToCheckout() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/checkout']);
    } else {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/cart' } });
    }
  }
}
