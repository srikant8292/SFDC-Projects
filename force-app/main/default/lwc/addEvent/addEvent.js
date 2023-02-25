import { LightningElement, track } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import EVT_OBJECT from '@salesforce/schema/Event__c';
import Namef from '@salesforce/schema/Event__c.Name__c';
import EventOrganizerf from '@salesforce/schema/Event__c.Event_Organizer__c';
import locationf from '@salesforce/schema/Event__c.Location__c';
import maxseatf from '@salesforce/schema/Event__c.Max_Seats__c';
import startdatef from '@salesforce/schema/Event__c.Start_DateTime__c';
import enddatef from '@salesforce/schema/Event__c.End_Date_Time__c';
import eventdetailsf from '@salesforce/schema/Event__c.Event_Details__c';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AddEvent extends NavigationMixin(LightningElement) {
   @track eventRecord={
    Name:'',
    Event_Organizer__c:'',
    Location__c:'',
    Max_Seats__c:null,
    Start_DateTime__c:null,
    End_Date_Time__c:null,
    Event_Details__c:''
    }
    
    @track error;

    handleChange(event){
        let value=event.target.value;
        let name=event.target.name;

        this.eventRecord[name]=value;
    }

    handlelookeup(event){
        let selectedRecordId=event.detail.selectedRecordId;
        let parentfield=event.detail.parentfield;

        this.eventRecord[parentfield]=selectedRecordId;

    }
    handleclick(){
      const fields={};
      fields[Namef.fieldApiName]=this.eventRecord.Name;
      fields[EventOrganizerf.fieldApiName]=this.eventRecord.Event_Organizer__c;
      fields[locationf.fieldApiName]=this.eventRecord.Location__c;
      fields[maxseatf.fieldApiName]=this.eventRecord.Max_Seats__c;
      fields[startdatef.fieldApiName]=this.eventRecord.Start_DateTime__c;
      fields[enddatef.fieldApiName]=this.eventRecord.End_Date_Time__c;
      fields[eventdetailsf.fieldApiName]=this.eventRecord.Event_Details__c;

      const evtrecord={apiName:EVT_OBJECT.objectApiName,fields};
       
      createRecord(evtrecord).then((evtrec)=>{
        //alert('Event Record created succesfully with ID'+evtrec.id);

        this.dispatchEvent(new ShowToastEvent({
            title: 'Recoed are Created Successfully',
            message: 'Event Draft is Ready',
            variant: 'success'
        }));


        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                actionName: "view",
                recordId:evtrec.id,
            }
        });
      }).catch((err)=>{
        // alert('Error Occur while creating the Recoed');
        // console.log(err);

        this.dispatchEvent(new ShowToastEvent({
            title: 'Error Occurred',
            message: this.error,
            variant: 'error'
        }));

        this.error=err;
      })

    }

    handleclickcancel(){
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                actionName: "home",
                objectApiName: "Event__c"
            }
        });
    }
}