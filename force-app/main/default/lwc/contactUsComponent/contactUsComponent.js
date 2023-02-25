import { LightningElement,api } from 'lwc';
import responseContactUs from '@salesforce/apex/ContactUsHandler.recordResponse'

export default class ContactUsComponent extends LightningElement {


    __emailMessage = {};
    @api eventId; // related task to the event
    @api organizerEmail; // email of the organizer
    @api organizerOwner;
    
    __isSpinnerActive = false;

    handleCancel(event){
        event.preventDefault();
        this.dispatchEvent(new CustomEvent('cancel', {
            detail: 'cancel'
        }));

    }
    handleSend(event){
        event.preventDefault();

        if(this.validateInput()){
            responseContactUs({
                paramsMap : this.__emailMessage,
                emailAddress : this.organizerEmail,
                ownerId : this.organizerOwner,
                eventId : this.eventId
            }).then((result)=>{
                this.dispatchEvent(new CustomEvent('success', {
                    detail: 'success'
                }))
                console.log(' success from responseContactUs',JSON.stringify(result))
            })
            .catch(error => {
                // TODO Error handling
                console.error('Error Handle send : ', JSON.stringify(error));
            })
            .finally(() => {
                this.__isSpinnerActive = false;
            });
        }


    }
    handleChange(event){
        const field = event.target.name; // Name, Email, Message
        const value = event.target.value;
        this.__emailMessage[field] = value;

    }

    validateInput() {

        const allValid = [...this.template.querySelectorAll('lightning-input')]
        .reduce((validSoFar, inputCmp) => {
            inputCmp.reportValidity();
            return validSoFar && inputCmp.checkValidity();
        }, true);

        const allValidMessage = [...this.template.querySelectorAll('lightning-textarea')]
        .reduce((validSoFar, inputCmp) => {
            inputCmp.reportValidity();
            return validSoFar && inputCmp.checkValidity();
        }, true);

        return allValid && allValidMessage;
    }
}