public with sharing class EventServiceController {
    
    @AuraEnabled
    public static List<Event__c> upcomingEvent(){
        
        List<Event__c> eventList=[SELECT Id,Event_Details__c,Event_Organizer__c,Event_Organizer__r.Name,Location__c,Location__r.Name,
         Name__c, Start_DateTime__c, Live__c FROM Event__c where Start_DateTime__c >= TODAY AND
          Live__c=true WITH SECURITY_ENFORCED];

        return eventList;
    }
}