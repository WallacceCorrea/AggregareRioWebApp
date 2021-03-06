
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {CommunicationService} from '../communication/communication.service';
import {DataService} from '../data.service';
import { IData, IPreOrder,IPreOrderItem } from '../dataparameters';
import { Router} from '@angular/router'
import { LazyLoadImageModule } from 'ng-lazyload-image';

@Component({
  selector: 'app-item-description',
  templateUrl: './item-description.component.html',
  styleUrls: ['./item-description.component.css']
})
export class ItemDescriptionComponent implements OnInit {
 
  parameters : IData;
  selectedItem: any;
  preOrder: IPreOrder;
  itemsDesc: any;
  selectLang = 0;
  item_qty: number; 
  index:any;
  constructor(private service : CommunicationService, private data: DataService, private router: Router) { 
    this.data.currentItem.subscribe(parameters => this.selectedItem = parameters);
    this.data.currentPreOrder.subscribe(parameters => this.preOrder = parameters);
    this.data.currentParameters.subscribe(parameters => 
      {
        this.parameters = parameters;
        this.updateDescription();
      } 
    );
  }

   selectItem(itemsDesc: any) {
      this.router.navigateByUrl('/full-picture'); 
   }


   addToOrder() {
    let item : IPreOrderItem = {item_id: 0, qty: 0, currPrice: 0 };
    this.index = this.getItemListIndex(this.selectedItem.id);
     
 if(this.item_qty==0){
   if(this.index>=0){
  this.preOrder.itemList[this.index].qty = this.item_qty;
}
//this.item_qty= 0 ->colocar uma mensagem escolha a quantidade desejada
else{}
 }
 else{
 
 if(this.index>=0){
    this.preOrder.itemList[this.index].qty = this.item_qty;
}
else{
    item.item_id = this.selectedItem.id;
    item.qty = this.item_qty;
    item.currPrice = this.selectedItem.value;   
    this.preOrder.itemList.push(item);
     }
  
    this.data.changePreOrder(this.preOrder);
  }
    console.dir( this.preOrder.itemList); 
  }


   getItemListIndex(id){
    return this.preOrder.itemList.findIndex(x=>x.item_id===id)   
  }
  
   ngOnInit(): void {
    this.item_qty = 0;
  }

  getItemById (parameters){
    this.service.getItembyId (parameters)
    .subscribe(data => {
       this.selectedItem = data;
    }); 
   }

  updateDescription() {
     if(this.selectLang==0) {
      this.selectLang = this.parameters.lang_id;

     } else if (this.selectLang != this.parameters.lang_id) {
      
      let itemParameters = {
        lang_id: this.parameters.lang_id,
        id: this.selectedItem.id
      };
      this.getItemById(itemParameters);
      this.selectLang = this.parameters.lang_id;
    }
  }

  updateQtty($event) {
    this.item_qty=$event;
  }

//Criei para test
  goToPre() {   
    
     this.router.navigateByUrl('/pre-order'); 
  }
}
