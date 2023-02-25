trigger ContentVersionTrigger on ContentVersion (after insert) {
    ContentVersionTriggerHandler.createPublicLink(Trigger.New,Trigger.newMap);

}