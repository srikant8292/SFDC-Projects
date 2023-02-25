public with sharing class EventServiceControllerPastUpcomming {
    @AuraEnabled(cacheable=true)
    public static List<Event__c> upcomingEvent(){
        
        List<Event__c> eventList=[SELECT Id,Event_Details__c,Title_Image_Url__c,Event_Organizer__c,Event_Organizer__r.Name,Location__c,Location__r.Name,
         Name__c, Start_DateTime__c, Live__c FROM Event__c where Start_DateTime__c >= TODAY AND
          Live__c=true WITH SECURITY_ENFORCED];

        return eventList;
    }
    @AuraEnabled(cacheable=true)
    public static List<Event__c> fetchPastEvents(){
        List<Event__c> eventList = new List<Event__c>();
        try {
            eventList = [SELECT Id,Event_Details__c,Event_Organizer__c,Title_Image_Url__c,Event_Organizer__r.Name,Location__c,Location__r.Name,
            Name__c, Start_DateTime__c, Live__c FROM Event__c where Start_DateTime__c <= TODAY 
              WITH SECURITY_ENFORCED];
                        
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return eventList;
    }

    
}