import { LightningElement, track, wire,api } from 'lwc';
import doRSVP from '@salesforce/apex/RESVPService.doRSVP'
import fetchUserDetails from '@salesforce/apex/RESVPService.fetchUserDetails'

export default class RsvpComponent extends LightningElement {
    
   @track __rsvpData;

   __isSpinner = false;

    @api eventId;

   @wire(fetchUserDetails)
   wiredData({ data, error }) {
       
       if (data) {
        //    this.__rsvpData['Name']     = data.Name;
        //    this.__rsvpData['Email__c'] = data.Email;
        //    this.__rsvpData['Title__c'] = data.Title;
        //    this.__rsvpData['Company_Name__c'] = data.CompanyName;
       } else if (error) {
           console.error('Error:',JSON.stringify(error));
       }
   }
   
   handleChange(event) {
    const fieldName  = event.target.name; // Name of the input field
    const fieldValue = event.target.value; // value of the input field - Amit Singh
    this.__rsvpData[fieldName] = fieldValue;
    // this.__rsvpData[Name] = Amit Singh;
    // this.__rsvpData[Email__c] =someemail;
}

validateInput(){
    const inputFields = this.template.querySelectorAll('lightning-input');
    let isValid = true;
    inputFields.forEach(field => {
        if(field.reportValidity() === false){
            isValid = false;
        }
    });
    return isValid;
}



    handleCancel(event){
        event.preventDefault();
        this.dispatchEvent(new CustomEvent('cancel'));
    }

    handleClick(event){

        event.preventDefault();
        if(this.validateInput()){
            // make the call to apex class
            this.__isSpinner = true;

            doRSVP({ 
                params : JSON.stringify(this.__rsvpData),
                eventId: this.eventId 
            })
            .then(result => {
                this.dispatchEvent(new CustomEvent('success'));
            })
            .catch(error => {
                console.error('Error: \n ', JSON.stringify(error));
            })
            .finally(()=>{
                this.__isSpinner = false;
            });
        }
        
    }

}