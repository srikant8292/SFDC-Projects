import { api, LightningElement, track } from 'lwc';
import getSpeakerDetails from '@salesforce/apex/Eventdetailcontroller.getSpeakerDetails';
import getLocationDetails from '@salesforce/apex/Eventdetailcontroller.getLocationDetails';
import getEventAttendee from '@salesforce/apex/Eventdetailcontroller.getEventAttendee'; 
import { NavigationMixin } from 'lightning/navigation';
import { encodeDefaultFieldValues } from 'lightning/pageReferenceUtils';
const columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Email', fieldName: 'Email', type: 'email' },
    { label: 'Phone', fieldName: 'Phone', type: 'phone' },
    { label: 'Company Name', fieldName: 'CompanyName', type: 'text' }
];

const columnsAtt = [
    {
      label: "Name",
      fieldName: "Name",
      cellAttributes: {
        iconName: "standard:user",
        iconPosition: "left"
      }
    },
    { label: "Email", fieldName: "Email", type: "email" },
    { label: "Company Name", fieldName: "CompanyName" },
    {
      label: "Location",
      fieldName: "Location",
      cellAttributes: {
        iconName: "utility:location",
        iconPosition: "left"
      }
    }
  ];
export default class EventDetails extends NavigationMixin(LightningElement) {
    @api recordId;
    @track speakersList;
    @track eventRecLocation
    errors;

    columnList=columns;
    columnAttendee=columnsAtt;

    eventspeakercontroller(){
        getSpeakerDetails({
            eventId:this.recordId
        }).then((result)=>{
          result.forEach(res => {
            res.Name=res.Speaker__r.Name,
            res.Email=res.Speaker__r.Email__c,
            res.Phone=res.Speaker__r.Phone__c,
            res.CompanyName=res.Speaker__r.Company__c
          });
            //console.log("result"+res);
            
           this.speakersList=result;
           this.errors=undefined;
        }).catch((err)=>{
            this.errors=err;
            this.speakersList=undefined;
        })
    }

    handlelocationdetails(){
        getLocationDetails({
            eventId:this.recordId
        }).then((result)=>{
          
            if(result.Location__c){
               this.eventRecLocation=result;
            }else{
              this.eventRecLocation=undefined;  
            }
            //console.log("result"+res);
            
           
           this.errors=undefined;
        }).catch((err)=>{
            this.errors=err;
            this.speakersList=undefined;
        })
    }

    handleeventattendee(){
        getEventAttendee({
            eventId:this.recordId
        }).then((result)=>{
            console.log('result',result);
             result.forEach(att => {
                att.Name = att.Attendee__r.Name;
                att.Email = att.Attendee__r.Email__c;
                att.CompanyName = att.Attendee__r.Company_Name__c;
                if (att.Attendee__r.Location__c) {
                  att.Location = att.Attendee__r.Location__r.Name;
                } else {
                  att.Location = "Preferred Not to Say";
                }
                
             });

             this.eventRecLocation=result;
            
            //console.log("result"+res);
            
           
           this.errors=undefined;
        }).catch((err)=>{
            this.errors=err;
            console.log('error',this.errors);
            this.eventRecLocation=undefined;
        })
    }

    createSpeaker(){
        const defaultValues = encodeDefaultFieldValues({
            Event__c:this.recordId
        });

        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                actionName: "new",
                objectApiName: "EventSpeakers__c"
            },
            state: {
                defaultFieldValues:defaultValues
            }
        });
    }
    
}