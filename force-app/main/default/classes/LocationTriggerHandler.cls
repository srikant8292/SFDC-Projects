public class LocationTriggerHandler {
   
    @future(callout=true)
    public static void verifyAddress(String recordId){
      Location__c lc=  [SELECT Id, Name,Verified__c, City__c, Country__c, Street__c, Postal_Code__c, State__c FROM Location__c WHERE Id=:recordId];
        
     
     //&candidates=10&street=&city=&state=&zipcode=&match=enhanced&license=us-rooftop-geocoding-cloud
      String baseUrl='https://us-street.api.smartystreets.com/street-address?auth-id=5bfd7a87-0e75-3f13-30f6-9bdc639ca1f2&auth-token=1bLgp5SbQEDk5OYbZRfT';
          baseUrl+='&candidates=10'+'&street='+EncodingUtil.urlEncode(lc.Street__c, 'UTF-8') +
              '&city='+EncodingUtil.urlEncode(lc.City__c, 'UTF-8')+'&state='+EncodingUtil.urlEncode(lc.State__c, 'UTF-8')+
              '&zipcode='+EncodingUtil.urlEncode(lc.Postal_Code__c, 'UTF-8')+
              '&match=invalid';
        
         System.debug('Base url'+baseUrl);
        HttpRequest httpReq=new HttpRequest();
       
        httpReq.setMethod('GET');
        //httpReq.setHeader('Content-Type', 'application/json');
        httpReq.setEndpoint(baseUrl);
        Http ht=new Http();
        
        HttpResponse httpRes=new HttpResponse();
        
        try{
         httpRes=ht.send(httpReq);
            
            if(httpRes.getStatusCode()==200 && httpRes.getStatus()== 'OK'){
                String responseBody=httpRes.getBody();
                System.debug('Response Body'+responseBody);
                
                if(!String.isBlank(responseBody) && responseBody.length()>2){
                    lc.Verified__c=true;
                }
                else{
                    lc.Verified__c=false;
                }
                update lc;
            }
            else{
                TransactionLogHandler.doHandleExceptionWithError(httpRes.getBody(),'LocationTriggerHandler');    
            }
        }catch(System.CalloutException ex){
            TransactionLogHandler.doHandleException(ex,'LocationTriggerHandler');
              System.debug('Exception Occurred'+ex.getStackTraceString());
        }
        
    }
}