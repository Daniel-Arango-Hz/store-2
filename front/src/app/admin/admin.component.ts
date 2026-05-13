import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NavComponent } from '../shared/nav/nav.component';

interface Imagen {
  ruta_imagen: string;
}

interface Producto {
  id: number;
  nombre_producto: string;
  stock_disponible: number;
  precio: number;
  descuento: number;
  tipo: string;
  color: string;
  imagenes: Imagen[];
}

interface ApiResponse {
  productos: Producto[];
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, NavComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  productos: Producto[] = [];
  loading = true;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.http.get<ApiResponse>('http://localhost:3060/api/productos').subscribe({
      next: (response) => {
        this.productos = response.productos;
        this.loading = false;
      },
      error: () => {
        this.error = 'No fue posible cargar los datos del panel admin.';
        this.loading = false;
      }
    });
  }

  get totalProductos(): number {
    return this.productos.length;
  }

  get stockTotal(): number {
    return this.productos.reduce((acc, item) => acc + item.stock_disponible, 0);
  }

  get productosConDescuento(): number {
    return this.productos.filter((item) => item.descuento > 0).length;
  }

  get productosStockBajo(): Producto[] {
    return this.productos
      .filter((item) => item.stock_disponible > 0 && item.stock_disponible <= 5)
      .sort((a, b) => a.stock_disponible - b.stock_disponible);
  }

  get productosSinStock(): Producto[] {
    return this.productos.filter((item) => item.stock_disponible === 0);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }

  getImageUrl(producto: Producto): string {
    const defaultImage = '/images/bici.png';
    const firstImage = producto.imagenes?.[0]?.ruta_imagen;

    return firstImage ? `https://back-store-v1.onrender.com${firstImage}` : defaultImage;
  }
}
