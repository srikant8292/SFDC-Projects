public with sharing class Eventdetailcontroller {
    @AuraEnabled
    public static List<EventSpeakers__c> getSpeakerDetails(String eventId){
      List<EventSpeakers__c> eventsp=[Select Id,Name,Speaker__c,
      Speaker__r.Company__c,Speaker__r.Phone__c,Speaker__r.Name,Speaker__r.Email__c,  
      Event__c from EventSpeakers__c where Event__c =:eventId WITH SECURITY_ENFORCED ];
      return eventsp;
    }
     
    @AuraEnabled
    public static Event__c getLocationDetails(String eventId){
      Event__c eventRec=[Select Id,Name__c,Location__c,Location__r.Name,Location__r.City__c,Location__r.Country__c,Location__r.Land_Mark__c,Location__r.State__c,
      Location__r.Street__c,Location__r.Verified__c,Location__r.Postal_Code__c from Event__c where Id =:eventId];

      return eventRec;
    }
    
    @AuraEnabled
    public static List<Event_Attendee__c> getEventAttendee(String eventId){
      List<Event_Attendee__c> evtAtt=[Select Id,Name,Attendee__r.Company_Name__c,Attendee__r.Location__c,Attendee__r.Location__r.Name,Attendee__r.Name,
      Attendee__r.Email__c from Event_Attendee__c where Event__c =:eventId];

        return evtAtt;
    }
}