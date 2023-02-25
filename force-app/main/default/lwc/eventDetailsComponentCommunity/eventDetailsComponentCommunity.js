import { api, LightningElement,track,wire } from 'lwc';
import { CurrentPageReference, NavigationMixin } from 'lightning/navigation';
import fetchEventDetails from '@salesforce/apex/EventDetailscommunity.fetchEventDetails';
import fetchSpeakerDetails from '@salesforce/apex/EventDetailscommunity.fetchSpeakerDetails';
import getSpeakerDetails from '@salesforce/apex/Eventdetailcontroller.getSpeakerDetails';

export default class EventDetailsComponentCommunity extends LightningElement {
    @api eventId;
   @api source;
   eventDetails;
   speakerDetails;
   __rsvpCompleted;

   __showModal=false;

   __showContactModal=false;
   __errors;

    isSpinner=false;

    @track mapMarkerdetails=[];

    @wire(CurrentPageReference)
    getCurrentPageReference(pageReference) {
        this.__currentPageReference = pageReference;
        this.eventId = this.__currentPageReference.state.eventId;
        this.source  = this.__currentPageReference.state.source;
        //this.fetchEventDetailsJS();
        //this.fetchSpeakerDetailsJS();
        //this.fethRsvpListJS();

        this.fetchEventDetailsJS();
        this.fetchSpeakerDetailsJS();

    
    }
    fetchEventDetailsJS(){
        this.isSpinner=true;
        fetchEventDetails({
            recordId:this.eventId
        })
        .then(res=>{
            this.eventDetails=res;
            if(this.eventDetails.Location__c){
                this.mapMarkerdetails.push({
                    
                        location: {
                            City: this.eventDetails.Location__r.City__c,
                            Country: this.eventDetails.Location__r.Country__c,
                            PostalCode: this.eventDetails.Location__r.Postal_Code__c,
                            State: this.eventDetails.Location__r.State__c,
                            Street: this.eventDetails.Location__r.Street__c,
                        },
                        title: this.eventDetails.Name__c,
                        description:
                            'This is the Landmark of the Location on Google Map', //escape the apostrophe in the string using &#39;
                    
                });
            }
            console.log("Result event"+JSON.stringify(res));
        })
        .catch(err=>{
            this.__errors=err;
            console.error(" event error occured"+err);
        })
        .finally(()=>{
          this.isSpinner=false;
        })
    }

    fetchSpeakerDetailsJS(){
        this.isSpinner=true;
        fetchSpeakerDetails({ 
            eventId:this.eventId 
        })
        .then(result => {
            this.speakerDetails = result;
            console.log(' Result speaker: ',this.speakerDetails);
        })
        .catch(error => {
            console.error(' Error: ', error);
            this.__errors = error;
        })
        .finally(()=>{
            this.isSpinner = false;
        });

    }
    rsvpHandler(){
        this.__showModal = true;
    }
    contactUsHandler(){
        this.__showContactModal = true;
    }

    handleContactUsSuccess(event){
        event.preventDefault();
        this.__showContactModal = false;
        
    }
    handleContactCancel(){
        this.__showContactModal = false;

    }

    handleRsvpSuccess(event){
        event.preventDefault();
        this.__showModal = false;
        this.__rsvpCompleted = true;

    }

    handleCancel(event){
        this.__showModal = false;
    }
}