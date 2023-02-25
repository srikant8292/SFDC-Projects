public class ContentVersionTriggerHandler {
     public static Set<String> fileTypeSet = new Set<String>{'jpg','png','jpeg','svg','jfif'};
    public static void createPublicLink(List<ContentVersion> listContent,Map<Id,ContentVersion> mapContent){
        Map<Id, ContentDocumentLink> contentDocumentLinkMap = getContentDocumentLinkMap(listContent);
        
        List<ContentDistribution> distributionsToInsert = new List<ContentDistribution>();
        for(ContentVersion version : listContent){
            ContentDocumentLink link = contentDocumentLinkMap.get( version.ContentDocumentId );
            if( ( link.LinkedEntityId.getSObjectType() == Event__c.sObjectType 
                || link.LinkedEntityId.getSObjectType() == Speaker__c.sObjectType
                || link.LinkedEntityId.getSObjectType() == Event_Organizer__c.sObjectType)  
                && fileTypeSet.contains( version.FileType.toLowerCase() ) ){
                distributionsToInsert.add( prepareContentDistribution(version.Id, version.Title) );
            }
        }
        
        if(!distributionsToInsert.isEmpty()){
            insert distributionsToInsert;
        }
        
        List<ContentDistribution> distributionList = [Select Id, ContentVersionId, ContentDownloadUrl, DistributionPublicUrl 
                                                    FROM ContentDistribution 
                                                    WHERE Id IN: distributionsToInsert];
        
        System.debug('Distribution List \n'+JSON.serialize(distributionList));
        
        
        List<Event__c> eventListToUpdate = new List<Event__c>();
        List<Speaker__c> speakersToUpdate = new List<Speaker__c>();
        List<Event_Organizer__c> organizerToUpdate = new List<Event_Organizer__c>();
        
        for(ContentDistribution cd : distributionList){
            ContentVersion version = mapContent.get(cd.ContentVersionId);
            
            ContentDocumentLink link = contentDocumentLinkMap.get( version.ContentDocumentId );
            
                String picUrl = '';
            picUrl = cd.ContentDownloadUrl.replace('download/?' , 'renditionDownload?rendition=ORIGINAL_Jpg&');
            picUrl = picUrl.replace('&ids' , '&versionId');
            
            if(link != null && link.LinkedEntityId.getSObjectType() == Event__c.sObjectType){
                Event__c eventRecord = new Event__c();
                eventRecord.Id = link.LinkedEntityId;
                eventRecord.Title_Image_Url__c = picUrl;
                eventListToUpdate.add(eventRecord);
            }
            else if(link != null && link.LinkedEntityId.getSObjectType() == Speaker__c.sObjectType){
                Speaker__c speaker = new Speaker__c();
                speaker.Id = link.LinkedEntityId;
                speaker.Picture__c = picUrl;
                speakersToUpdate.add(speaker);
            }else if(link != null && link.LinkedEntityId.getSObjectType() == Event_Organizer__c.sObjectType){
                  Event_Organizer__c organizer = new Event_Organizer__c();
                organizer.Id = link.LinkedEntityId;
                organizer.Picture__c = picUrl;
                organizerToUpdate.add(organizer);
            }
            
        }
        
         List<sObject> allObjectsToUpdate = new List<Sobject>();
        allObjectsToUpdate.addAll(eventListToUpdate);
        allObjectsToUpdate.addAll(speakersToUpdate);
        allObjectsToUpdate.addAll(organizerToUpdate);
        
        update allObjectsToUpdate;
        
        
    }
    
    public static ContentDistribution prepareContentDistribution(Id contentVersionId, String title){
         ContentDistribution newDist = new ContentDistribution();
         newDist.ContentVersionId = contentVersionId;
        newDist.Name = title;
        newDist.PreferencesNotifyOnVisit = true;
        newDist.PreferencesAllowViewInBrowser = true;
        newDist.PreferencesAllowOriginalDownload=true;
        return newDist;
    }
    
    public static Map<Id, ContentDocumentLink> getContentDocumentLinkMap(List<ContentVersion> contentVersionList){
        Set<String> contentDocumentIdsSet = new Set<String>();
        for(ContentVersion version : contentVersionList){
            contentDocumentIdsSet.add(version.ContentDocumentId);
        }
          Map<Id, ContentDocumentLink> contentDocumentLinkMap = new Map<Id, ContentDocumentLink>();
        for(ContentDocumentLink link : [SELECT Id, LinkedEntityId, ContentDocumentId FROM ContentDocumentLink 
                                        WHERE ContentDocumentId IN :contentDocumentIdsSet]){
                           
                     if(link.LinkedEntityId.getSObjectType() == Event__c.sObjectType 
                || link.LinkedEntityId.getSObjectType() == Speaker__c.sObjectType
                        || link.LinkedEntityId.getSObjectType() == Event_Organizer__c.sObjectType){
                             contentDocumentLinkMap.put(link.ContentDocumentId, link);
                        }                         
                                            
                                        }
        
        return contentDocumentLinkMap;
    }

}