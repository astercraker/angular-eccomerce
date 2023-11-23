import { Component, OnInit } from '@angular/core';
import { Product } from '../shared/models/product.model';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss'],
})
export class ListProductsComponent implements OnInit {
  products: Product[] = [];
  productPageCounter = 1;
  filter = '';
  constructor(private productService: ProductService, private router: Router) {}

  redirectToEdit(id) {
    if (id) {
      this.router.navigate(['/admin/product', id]);
    } else {
      this.router.navigate(['/admin/product/create']);
    }
  }

  searchProduct(){
    this.productService.getProductByTitle(this.filter).subscribe(
      (res: any) => {
        console.log("resultado Search -- ",res);
        this.products = res;
      },
      (err) => {
        console.log(err);
      }
    )
  }

  leftPage() {
    this.productPageCounter = this.productPageCounter - 1;
    this.updateProducts();
  }

  rightPage() {
    this.productPageCounter = this.productPageCounter + 1;
    this.updateProducts();
  }

  updateProducts() {
    setTimeout(() => {
      this.productService.getAllProducts(10, this.productPageCounter).subscribe(
        (res: any) => {
          this.products = res;
        },
        (err) => {
          console.log(err);
        }
      );
    }, 500);
  }

  ngOnInit(): void {
    this.updateProducts();
  }
}
