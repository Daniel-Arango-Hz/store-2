import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NavComponent } from '../shared/nav/nav.component';
import { CartService } from '../services/cart.service';

interface Imagen {
  id_imagen: number;
  ruta_imagen: string;
  nombre_imagen: string;
  codigo_producto: number;
}

interface Producto {
  id: number;
  nombre_producto: string;
  descripcion_producto: string;
  stock_disponible: number;
  tipo: string;
  color: string;
  precio: number;
  imagenes: Imagen[];
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, NavComponent],
  templateUrl: './product-detail.component.html',
  styles: [`
    .selected-thumbnail {
      border: 2px solid #10B981;
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  producto: Producto | null = null;
  selectedImage: string = '';
  cantidad: number = 1;
  loading = true;
  error = '';
  rating = 4;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(id);
    }
  }

  loadProduct(id: string) {
    this.loading = true;
    this.http.get<{ productos: Producto[] }>(`https://back-store-v1.onrender.com/api/productos`)
      .subscribe({
        next: (response) => {
          const producto = response.productos.find(p => p.id === Number(id));
          if (producto) {
            this.producto = producto;
            this.selectedImage = 'https://back-store-v1.onrender.com' + producto.imagenes[0].ruta_imagen;
          } else {
            this.error = 'Producto no encontrado';
          }
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Error al cargar el producto';
          this.loading = false;
          console.error('Error loading product:', error);
        }
      });
  }

  changeImage(imagePath: string) {
    this.selectedImage = 'https://back-store-v1.onrender.com' + imagePath;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }

  calculateDiscountPrice(originalPrice: number): number {
    return originalPrice * 0.8; // 20% de descuento
  }

  addToCart() {
    if (this.producto) {
      this.cartService.addToCart({
        id: this.producto.id,
        nombre_producto: this.producto.nombre_producto,
        precio: this.calculateDiscountPrice(this.producto.precio),
        cantidad: this.cantidad,
        imagenUrl: this.producto.imagenes[0].ruta_imagen
      });
      alert('Producto añadido al carrito');
    }
  }

  buyNow() {
    this.addToCart();
    this.router.navigate(['/cart']);
  }
}