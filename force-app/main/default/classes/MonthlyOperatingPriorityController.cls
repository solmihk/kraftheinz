public with sharing class MonthlyOperatingPriorityController {
    @AuraEnabled(cacheable=true)
    public static List<Monthly_Operating_Priority__c> getPriorities() {
        return [
            SELECT Id, Name, Tab__c, Section__c, Sort_Order__c, Brand__c,
                   Priority_Description__c, Dates__c, Booking_Window__c,
                   On_Cycle__c, Price_Point__c, Notes__c
            FROM Monthly_Operating_Priority__c
            ORDER BY Tab__c, Section__c, Sort_Order__c
        ];
    }
}
