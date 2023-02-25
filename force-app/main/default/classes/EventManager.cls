@RestResource(urlMapping ='/v1/futurevent')
global class EventManager {

    @httpGet
    global static List<Event__c> upcomingEvent(){
        List<Event__c> eventlist=[SELECT Id, IsDeleted, Name, CreatedDate, CreatedById, LastModifiedDate, 
                                  LastModifiedById, SystemModstamp, LastViewedDate, LastReferencedDate,
                                  Event_Organizer__c,Event_Organizer__r.Name, End_Date_Time__c, Event_Detail__c, Event_Type__c, Frequency__c,
                                  Live__c, Location__c,Location__r.Name,Location__r.Street__c,Location__r.City__c,
                                  Location__r.State__c,Location__r.Postal_Code__c,Location__r.Country__c,
                                 Location__r.Verified__c, Max_Seats__c, Name__c, Recurring__c, Start_DateTime__c,
                                  Status__c,
                                  PeopleAttending__c, Location_Verified__c, Remaining_Seats__c,
                                  Event_Details__c FROM Event__c WHERE Start_DateTime__c >= TODAY AND Live__c= true
                                 WITH SECURITY_ENFORCED];
        
        return eventlist;
    }
}