import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { CategoriesModalComponent, CategoryFilter } from '../categories-modal/categories-modal.component';
import { Location } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, CategoriesModalComponent, FormsModule],
  templateUrl: './nav.component.html',
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
  `]
})
export class NavComponent implements OnInit {
  @Output() filterChange = new EventEmitter<CategoryFilter>();
  @Output() ofertasClick = new EventEmitter<void>();
  @Output() search = new EventEmitter<string>();
  @Input() searchTerm = '';
  
  isMobileMenuOpen = false;
  isAuthenticated = false;
  showCategoriesModal = false;
  cartItemsCount = 0;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private cartService: CartService
  ) {
    this.authService.isAuthenticated$.subscribe(
      isAuthenticated => this.isAuthenticated = isAuthenticated
    );
    this.cartService.cartItems$.subscribe(() => {
      this.cartItemsCount = this.cartService.getCartItemsCount();
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchTerm = params['search'];
      }
    });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleCategoriesModal() {
    this.showCategoriesModal = !this.showCategoriesModal;
  }

  handleFilterChange(filters: CategoryFilter) {
    this.filterChange.emit(filters);
    this.showCategoriesModal = false;
    this.navigateToDashboard({ tipo: filters.tipo, color: filters.color }, true);
  }

  handleOfertasClick() {
    this.ofertasClick.emit();
    this.navigateToDashboard({ ofertas: true }, true);
  }

  handleSearch() {
    this.search.emit(this.searchTerm);
    this.navigateToDashboard({ search: this.searchTerm }, true);
  }

  navigateToDashboard(queryParams: any = {}, replace: boolean = false) {
    const url = this.router.createUrlTree(['/'], { 
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    }).toString();

    if (replace) {
      this.location.replaceState(url);
    } else {
      this.location.go(url);
    }

    // Navegar a la página de inicio si no estamos ya en ella
    if (this.router.url !== '/') {
      this.router.navigateByUrl(url);
    }
  }

  logout() {
    this.authService.logout();
  }
}