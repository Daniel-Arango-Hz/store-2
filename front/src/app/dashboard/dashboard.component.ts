import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavComponent } from '../shared/nav/nav.component';
import { CategoryFilter } from '../shared/categories-modal/categories-modal.component';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';

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
  descuento: number;
  imagenes: Imagen[];
}

interface ApiResponse {
  productos: Producto[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavComponent, FormsModule],
  templateUrl: './dashboard.component.html',
  styles: [`
    .product-card {
      transition: transform 0.3s ease-in-out;
    }
    
    .product-card:hover {
      transform: translateY(-5px);
    }

    .discount-badge {
      position: absolute;
      top: 20px;
      left: -30px;
      background-color: #EF4444;
      color: white;
      padding: 4px 30px;
      transform: rotate(-45deg);
    }
  `]
})
export class DashboardComponent implements OnInit {
  allProductos: Producto[] = [];
  productos: Producto[] = [];
  loading = true;
  error = '';
  activeFilters: CategoryFilter = {
    tipo: [],
    color: []
  };
  showOnlyDiscounted = false;
  searchTerm = '';

  constructor(
    private http: HttpClient, 
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.route.queryParams.subscribe(params => {
      this.updateFiltersFromParams(params);
    });
  }

  updateFiltersFromParams(params: any) {
    this.activeFilters = {
      tipo: params['tipo'] ? (Array.isArray(params['tipo']) ? params['tipo'] : [params['tipo']]) : [],
      color: params['color'] ? (Array.isArray(params['color']) ? params['color'] : [params['color']]) : []
    };
    this.showOnlyDiscounted = params['ofertas'] === 'true';
    this.searchTerm = params['search'] || '';
    this.applyFilters();
  }

  loadProducts() {
    this.loading = true;
    this.http.get<ApiResponse>('https://back-store-v1.onrender.com/api/productos')
      .subscribe({
        next: (response) => {
          this.allProductos = response.productos;
          this.applyFilters();
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Error al cargar los productos';
          this.loading = false;
          console.error('Error loading products:', error);
        }
      });
  }

  applyFilters() {
    let filteredProducts = [...this.allProductos];

    if (this.activeFilters.tipo.length > 0) {
      filteredProducts = filteredProducts.filter(producto => 
        this.activeFilters.tipo.includes(producto.tipo)
      );
    }

    if (this.activeFilters.color.length > 0) {
      filteredProducts = filteredProducts.filter(producto => 
        this.activeFilters.color.includes(producto.color)
      );
    }

    if (this.showOnlyDiscounted) {
      filteredProducts = filteredProducts.filter(producto => producto.descuento > 0);
    }

    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filteredProducts = filteredProducts.filter(producto =>
        producto.nombre_producto.toLowerCase().includes(searchLower)
      );
    }

    this.productos = filteredProducts;
  }

  removeFilter(category: 'tipo' | 'color', value: string) {
    this.activeFilters[category] = this.activeFilters[category].filter(item => item !== value);
    this.updateQueryParams(true);
    this.applyFilters();
  }

  toggleDiscountedFilter() {
    this.showOnlyDiscounted = !this.showOnlyDiscounted;
    this.updateQueryParams(true);
    this.applyFilters();
  }

  onSearch(term: string) {
    this.searchTerm = term;
    this.updateQueryParams(true);
    this.applyFilters();
  }

  updateQueryParams(replace: boolean = false) {
    const queryParams: any = {};
    if (this.activeFilters.tipo.length > 0) queryParams.tipo = this.activeFilters.tipo;
    if (this.activeFilters.color.length > 0) queryParams.color = this.activeFilters.color;
    if (this.showOnlyDiscounted) queryParams.ofertas = 'true';
    if (this.searchTerm) queryParams.search = this.searchTerm;

    const url = this.router.createUrlTree([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    }).toString();

    if (replace) {
      this.location.replaceState(url);
    } else {
      this.location.go(url);
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }

  calculateDiscountPrice(producto: Producto): number {
    return producto.precio * (1 - producto.descuento / 100);
  }

  calculateInstallment(price: number): number {
    return price / 36; // 36 cuotas
  }
}