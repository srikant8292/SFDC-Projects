import { LightningElement, wire } from 'lwc';
import fetchFooter from '@salesforce/apex/footerComponentLWCService.getFooter'

export default class FooterComponent extends LightningElement {
    
     footerContent;
     errorcontent;

    @wire(fetchFooter)
      footerData({data,error}){
        if(data){
           console.log('footer data'+data);
           this.footerContent=data;
           this.errorcontent=undefined;
        }
        if(error){
            console.error('error footer'+error);
            this.errorcontent=error;
            this.footerContent=undefined;

        }
      }

}