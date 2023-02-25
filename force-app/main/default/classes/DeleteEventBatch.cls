public class DeleteEventBatch implements Database.Batchable<sObject>{
    
    public Database.QueryLocator start(Database.BatchableContext batchContext){
        String q='SELECT Id, Name, CreatedDate, End_Date_Time__c, Live__c FROM Event__c Where Live__c=true and End_Date_Time__c < LAST_N_MONTHS:2';
        return Database.getQueryLocator(q);
    }
    
    public void execute(Database.BatchableContext batchContext ,List<Event__c> eventlist){
        if(!eventlist.isEmpty()){
            List<Database.DeleteResult> deleteResult=Database.delete(eventlist);
            
            for(Database.DeleteResult dr:deleteResult){
                if(!dr.isSuccess()){
                    List<Database.Error> errors=dr.getErrors();
                    
                    String errorstr=String.join(errors,',');
                    
                    TransactionLogHandler.doHandleExceptionWithError(errorstr,'DeleteEventBatch');
                }
                
                
            }
        }
    }
    
    public void finish(Database.BatchableContext batchContext){
         Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();

            mail.setSubject('Batch Processing Result');
            List<String> toAddress = new List<String>();
            toAddress.add('kumarsrikant8292@gmail.com');
            mail.setToAddresses( toAddress );
            mail.setSenderDisplayName('SFDC Panther');
            
            
            String emailBody = 'The DeleteEventBatch is Successfully completed ';
            
            mail.setHtmlBody(emailBody);
            //emailList.add(mail);
        
        Messaging.sendEmail(new List<Messaging.Email>{mail});
    }

}