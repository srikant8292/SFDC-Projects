public with sharing class footerComponentLWCService {
    @AuraEnabled(cacheable=true)
   public static List<Footer__c> getFooter(){
       return [SELECT Id, Name, Content__c FROM Footer__c WITH SECURITY_ENFORCED];
   }
}