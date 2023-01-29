import {Component, OnInit} from '@angular/core';
import {ProductService} from "../services/product.service";
import {Product} from "../model/product.model";
import {FormBuilder, FormGroup} from "@angular/forms";
import {AuthenticationService} from "../services/authentication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent  implements  OnInit {
  products !: Array<Product>;
  currentPage : number=0;
  pageSize:number =5;
  totalPages :number=0;
  errorMessage! :string;
  searchFromGroup! : FormGroup;
  currentAction :string="all";


  constructor( private productService :ProductService , private fb :FormBuilder, public authService : AuthenticationService, private router: Router )  {
  }

  ngOnInit( ): void {
    this.searchFromGroup= this.fb.group({
      keyword : this.fb.control(null)
    });
   this.handleGetPageProducts();


  }
  handleGetPageProducts(){
    this.productService.getPageProducts(this.currentPage,this.pageSize).subscribe({
      next : (data)=>{
        this.products=data.products;
        this.totalPages=data.totalPages;
        console.log(this.totalPages);
      },
      error : (err)=>{
        this.errorMessage=err;
      }
    });
  }
   handleGetAllProducts(){
     this.productService.getAllProducts().subscribe({
       next : (data)=>{
         this.products=data;
       },
       error : (err)=>{
         this.errorMessage=err;
       }
     });
   }
  handleDeleteProduct(p: Product) {
    let conf=confirm(" Are you sure?");
    if (conf==false) return;
    this.productService.deleteProduct(p.id).subscribe({
      next : (data)=> {
        //this.handleGetAllProducts();
        let index=this.products.indexOf(p);
        this.products.splice(index,1);
      }
    })
  }

  handleSetPromotion(p:Product) {
    let promo=p.promotion;
     this.productService.setPromotion(p.id).subscribe({
      next :(data)=>{
        p.promotion=!promo;
      } ,
       error : err => {
        this.errorMessage=err;
       }
     })
  }

  handleSearchProduct() {
    this.currentAction="search";
    this.currentPage=0;
    let keyword =this.searchFromGroup.value.keyword;
    this.productService.searchProduct(keyword,this.currentPage,this.pageSize).subscribe({
      next :(data)=>{
        this.products=data.products;
        this.totalPages=data.totalPages;
      }
    });

  }

  gotoPage(i:number) {
    this.currentPage=i;
    if(this.currentAction=='all')
    this.handleGetPageProducts();
    else
      this.handleSearchProduct();
  }

  handleNewProduct() {
    this.router.navigateByUrl("/admin/newProduct");
  }

  handleEditProduct(p: Product) {
    this.router.navigateByUrl("/admin/editProduct/"+p.id);

  }
}
