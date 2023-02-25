public class TransactionLogHandler {
    public static void doHandleException(System.Exception ex, String processName){
        Error_Log__c err=new Error_Log__c(
        Log_Details__c= ex.getStackTraceString() +'<br/>'+ex.getMessage()+'<br/>'+ ex.getCause() +'<br/>'+ex.getTypeName()
        +'<br/>'+ex.getLineNumber(),
        Lod_DateTime__c=System.now(),
        Process_Name__c=processName
        );
        
        if(Schema.SObjectType.Error_Log__c.isCreateable()){
            insert err;
        }
    }
    
     public static void doHandleExceptionWithError(String er, String processName){
        Error_Log__c err=new Error_Log__c(
        Log_Details__c= er,
        Lod_DateTime__c=System.now(),
        Process_Name__c=processName
        );
        
        if(Schema.SObjectType.Error_Log__c.isCreateable()){
            insert err;
        }
    }

}