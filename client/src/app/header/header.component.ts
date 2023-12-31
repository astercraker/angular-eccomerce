import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  screenHeight: any;
  screenWidth: any;
  isMenuOpen = false;
  isMobile = false;
  isLoggedIn = false;
  dropdownVisible = false;
  cartData: any;
  isAdmin = false;

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;

    if (this.screenWidth > 768) this.isMobile = false;
    else this.isMobile = true;
  }

  constructor(
    private _token: TokenStorageService,
    private _auth: AuthService,
    private _cart: CartService
  ) {
    this.getScreenSize();
    this._auth.user.subscribe((user) => {
      if (user) {
        this.isLoggedIn = true;
        this.isAdmin = user.isAdmin;
      } else {
        this.isLoggedIn = false;
        this.isAdmin = false;
      }

      console.log('user --', user);
    });
    this._cart.cartDataObs$.subscribe((cartData) => {
      this.cartData = cartData;
    });
  }

  ngOnInit(): void {
    const user = this._token.getUser();
    this.isAdmin = false;
    if (user) {
      this.isLoggedIn = true;
      if (user.type == 'admin') {
        this.isAdmin = true;
      }
    } else {
      this.isLoggedIn = false;
    }
    console.log('onInit -- ', user);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  removeProductFromCart(id: number) {
    this._cart.removeProduct(id);
  }

  logout() {
    this._auth.logout();
    this.isMenuOpen = false;
  }
}
