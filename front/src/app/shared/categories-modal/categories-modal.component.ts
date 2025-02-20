import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';

export interface CategoryFilter {
  tipo: string[];
  color: string[];
}

@Component({
  selector: 'app-categories-modal',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './categories-modal.component.html',
  styles: [`
    :host {
      display: block;
    }
    
    .modal-overlay {
      animation: overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .modal-content {
      animation: contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    @keyframes overlayShow {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    
    @keyframes contentShow {
      from {
        opacity: 0;
        transform: translateX(-100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `]
})
export class CategoriesModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() filtersChanged = new EventEmitter<CategoryFilter>();

  tipos = [
    'Electrónica',
    'Hogar',
    'Moda',
    'Deportes',
    'Salud y Belleza',
    'Juguetes y Juegos',
    'Automotriz',
    'Herramientas',
    'Alimentos y Bebidas',
    'Oficina y Papelería'
  ];

  colores = ['Amarillo', 'Azul', 'Rojo', 'Negro', 'Blanco', 'Verde'];

  selectedFilters: CategoryFilter = {
    tipo: [],
    color: []
  };

  constructor(private router: Router, private route: ActivatedRoute) {}

  toggleFilter(category: 'tipo' | 'color', value: string) {
    const index = this.selectedFilters[category].indexOf(value);
    if (index === -1) {
      this.selectedFilters[category].push(value);
    } else {
      this.selectedFilters[category].splice(index, 1);
    }
  }

  isSelected(category: 'tipo' | 'color', value: string): boolean {
    return this.selectedFilters[category].includes(value);
  }

  applyFilters() {
    const currentUrl = this.router.url;
    const isOnDashboard = currentUrl.startsWith('/dashboard');

    if (isOnDashboard) {
      // Si ya está en dashboard, solo emitimos los filtros
      this.filtersChanged.emit(this.selectedFilters);
    } else {
      // Si no está en dashboard, lo redirigimos con los filtros en la URL
      this.router.navigate(['/dashboard'], {
        queryParams: {
          tipo: this.selectedFilters.tipo.length ? this.selectedFilters.tipo.join(',') : null,
          color: this.selectedFilters.color.length ? this.selectedFilters.color.join(',') : null
        },
        queryParamsHandling: 'merge'
      });
    }

    this.close.emit();
  }

  clearFilters() {
    this.selectedFilters = {
      tipo: [],
      color: []
    };
  }

  closeModal() {
    this.close.emit();
  }
}
