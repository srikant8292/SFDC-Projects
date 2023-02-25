public with sharing class EventDetailscommunity {
    @AuraEnabled
    public static Event__c fetchEventDetails(String recordId){
        Event__c eventRecord = new Event__c();
        try {
            eventRecord = [SELECT Id, IsDeleted, Name, CreatedDate, CreatedById, LastModifiedDate, LastModifiedById, 
            SystemModstamp, LastViewedDate, LastReferencedDate, Event_Organizer__c, End_Date_Time__c,
            Event_Organizer__r.Name, Event_Organizer__r.Short_Intro__c,Event_Organizer__r.Picture__c,
            Event_Organizer__r.Email__c,Event_Organizer__r.OwnerId,Event_Organizer__r.Company__c,
            Event_Detail__c, Event_Type__c, Frequency__c, Live__c, Location__c,Location__r.Name,Location__r.City__c,Location__r.Country__c,Location__r.Land_Mark__c,Location__r.State__c,
            Location__r.Street__c,Location__r.Verified__c,Location__r.Postal_Code__c, Max_Seats__c, Name__c, 
            Recurring__c, Start_DateTime__c, Status__c, PeopleAttending__c, Location_Verified__c,
             Remaining_Seats__c, Event_Details__c FROM Event__c
                            WHERE Id =: recordId
                            WITH SECURITY_ENFORCED
                        ];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return eventRecord;
    }

    @AuraEnabled
    public static List<EventSpeakers__c> fetchSpeakerDetails(String eventId){
        List<EventSpeakers__c> speakers = new List<EventSpeakers__c>();
        try {
            speakers = [Select Id,Name,Speaker__c,
            Speaker__r.Company__c,Speaker__r.Phone__c,Speaker__r.Name,Speaker__r.Email__c,  
            Event__c from EventSpeakers__c where Event__c =:eventId WITH SECURITY_ENFORCED
                    ];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return speakers;
    }

    // @AuraEnabled(cacheable=true)
    // public static List<Event_Attendee__c> fethRsvpList(String eventId){
    //     List<Event_Attendee__c> attendees = new List<Event_Attendee__c>();
    //     attendees = [SELECT Id, Event__c 
    //                     FROM  Event_Attendee__c 
    //                     WHERE Event__c =: eventId 
    //                    // AND   Attendee__r.User__c =: UserInfo.getUserId()
    //                 ];
    //     return attendees;
    // }
}