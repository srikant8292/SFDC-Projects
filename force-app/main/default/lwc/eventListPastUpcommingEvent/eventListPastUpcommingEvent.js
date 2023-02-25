import { api, LightningElement,wire } from 'lwc';
import fetchPastEvents from '@salesforce/apex/EventServiceControllerPastUpcomming.fetchPastEvents';
import upcomingEvent from '@salesforce/apex/EventServiceControllerPastUpcomming.upcomingEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class EventListPastUpcommingEvent extends NavigationMixin(LightningElement) {
    upCommingEvents
    pastEvents
    _errors;
    isSpinner=false;

    @api eventId;
    @api source;

    @wire(upcomingEvent)
    wireUpcommingData({data,error}){
        if(data){
            console.log('Upcomming Data'+data);
            this.upCommingEvents=data;
        }
        else if(error){
            console.log(' upcomming Error'+error);
            this.upCommingEvents=undefined;
            this._errors=error;

        }
    }

    @wire(fetchPastEvents)
    wirePastData({data,error}){
        if(data){
            console.log(' past Data'+data);
            this.pastEvents=data;
        }
        else if(error){
            console.log('past Error'+error);
            this.pastEvents=undefined;
            this._errors=error;

        }
    }
    onclickhandler(event){
        event.preventDefault();
        let selectedEventId= event.detail.eventId;

       // alert(selectedEventId);

        let naviagatioTarget={
            type:'comm__namedPage',
            attributes:{
                name:'eventdetails__c'
            },
            state:{
                eventId:selectedEventId,
                source:'eventListPage'
            }
        }

        this[NavigationMixin.Navigate](naviagatioTarget);

    }
}