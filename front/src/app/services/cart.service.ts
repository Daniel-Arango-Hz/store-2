import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export interface CartItem {
  id: number;
  nombre_producto: string;
  precio: number;
  cantidad: number;
  imagenUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);

  cartItems$ = this.cartItemsSubject.asObservable();

  constructor(private authService: AuthService) {
    this.loadCart();
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      if (!isAuthenticated) {
        this.clearCart();
      }
    });
  }

  private loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cartItemsSubject.next(this.cartItems);
    }
  }

  private saveCart() {
    if (this.authService.isLoggedIn()) {
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
    }
  }

  addToCart(item: CartItem) {
    const existingItem = this.cartItems.find(i => i.id === item.id);
    if (existingItem) {
      existingItem.cantidad += item.cantidad;
    } else {
      this.cartItems.push(item);
    }
    this.cartItemsSubject.next(this.cartItems);
    this.saveCart();
  }

  removeFromCart(id: number) {
    this.cartItems = this.cartItems.filter(item => item.id !== id);
    this.cartItemsSubject.next(this.cartItems);
    this.saveCart();
  }

  updateQuantity(id: number, cantidad: number) {
    const item = this.cartItems.find(i => i.id === id);
    if (item) {
      item.cantidad = cantidad;
      this.cartItemsSubject.next(this.cartItems);
      this.saveCart();
    }
  }

  getCartItemsCount() {
    return this.cartItems.reduce((total, item) => total + item.cantidad, 0);
  }

  getCartTotal() {
    return this.cartItems.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  }

  clearCart() {
    this.cartItems = [];
    this.cartItemsSubject.next(this.cartItems);
    localStorage.removeItem('cart');
  }
}