import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../services/cart.service';
import { NavComponent } from '../shared/nav/nav.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, NavComponent],
  template: `
    <app-nav></app-nav>
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Finalizar Compra</h1>
      <form (ngSubmit)="onSubmit()" #checkoutForm="ngForm" class="max-w-lg mx-auto">
        <div class="mb-4">
          <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Nombre Completo</label>
          <input type="text" id="name" name="name" [(ngModel)]="checkoutData.name" required
                 class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        </div>
        <div class="mb-4">
          <label for="address" class="block text-gray-700 text-sm font-bold mb-2">Dirección de Envío</label>
          <input type="text" id="address" name="address" [(ngModel)]="checkoutData.address" required
                 class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        </div>
        <div class="mb-4">
          <label for="cardNumber" class="block text-gray-700 text-sm font-bold mb-2">Número de Tarjeta</label>
          <input type="text" id="cardNumber" name="cardNumber" [(ngModel)]="checkoutData.cardNumber" required
                 class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        </div>
        <div class="mb-4">
          <label for="expiryDate" class="block text-gray-700 text-sm font-bold mb-2">Fecha de Expiración</label>
          <input type="text" id="expiryDate" name="expiryDate" [(ngModel)]="checkoutData.expiryDate" required
                 placeholder="MM/YY" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        </div>
        <div class="mb-6">
          <label for="cvv" class="block text-gray-700 text-sm font-bold mb-2">CVV</label>
          <input type="text" id="cvv" name="cvv" [(ngModel)]="checkoutData.cvv" required
                 class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        </div>
        <div class="flex items-center justify-between">
          <button type="submit" [disabled]="!checkoutForm.form.valid"
                  class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Realizar Pago
          </button>
        </div>
      </form>
    </div>
  `
})
export class CheckoutComponent implements OnInit {
  checkoutData = {
    name: '',
    address: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  };

  constructor(private cartService: CartService) {}

  ngOnInit() {}

  onSubmit() {
    console.log('Procesando pago...', this.checkoutData);
    // Aquí iría la lógica para procesar el pago
    // Después de procesar el pago exitosamente:
    this.cartService.clearCart();
    alert('¡Pago realizado con éxito!');
    // Redirigir a una página de confirmación
  }
}