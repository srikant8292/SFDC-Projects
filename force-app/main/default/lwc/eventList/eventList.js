import { LightningElement, track, wire } from 'lwc';
import upcomingEvent from '@salesforce/apex/EventServiceController.upcomingEvent';
const columns = [
    {
      label: "View",
      fieldName: "detailsPage",
      type: "url",
      wrapText: "true",
      typeAttributes: {
        label: {
          fieldName: "Name__c"
        },
        target: "_self"
      }
    },
    {
      label: "Name",
      fieldName: "Name",
      wrapText: "true",
      cellAttributes: {
        iconName: "standard:event",
        iconPosition: "left"
      }
    },
    {
      label: "Name",
      fieldName: "EVNT_ORG",
      wrapText: "true",
      cellAttributes: {
        iconName: "standard:user",
        iconPosition: "left"
      }
    },
    {
      label: "Location",
      fieldName: "Location",
      wrapText: "true",
      type: "text",
      cellAttributes: {
        iconName: "utility:location",
        iconPosition: "left"
      }
    }
  ];

export default class EventList extends LightningElement {
    columnEvent=columns;
    error;
    @track result;
    @track recordtodisplay;

    connectedCallback(){
        this.upcomingEventFromApex();
    }

     upcomingEventFromApex(){
        upcomingEvent()
        .then((data)=>{
            data.forEach(element => {
                element.detailsPage="https://"+location.host+"/"+element.Id;
                element.Name=element.Name__c;
                element.EVNT_ORG=element.Event_Organizer__r.Name;
                if(element.Location__c){
                    element.Location=element.Location__r.Name;
                }
                else{
                    element.Location='This is virtual Event'
                }
            });
            this.result=data;
            this.recordtodisplay=data;
            this.error=undefined;
        }).catch((err)=>{
            this.error=err;
            this.result=undefined;
        })
     }

     searchHandler(event){
       let searchkey=event.detail.value;

        let filtereddata= this.result.filter((rec,index,arrayObj)=>{
            return rec.Name__c.toLowerCase().includes(searchkey.toLowerCase());
         })

         if(searchkey && searchkey.length >=2){
            this.recordtodisplay=filtereddata;
         }
         else{
            this.recordtodisplay=this.result;
         }

         
     }

    

}