Id quickAccessRT = Schema.SObjectType.cgcloud__Mobile_Link__c
    .getRecordTypeInfosByName().get('Quick Access').getRecordTypeId();

List<cgcloud__Mobile_Link__c> links = new List<cgcloud__Mobile_Link__c>();

links.add(new cgcloud__Mobile_Link__c(
    RecordTypeId = quickAccessRT,
    Name = 'Monthly Operating Priorities',
    cgcloud__Description_Language_1__c = 'Monthly Operating Priorities',
    cgcloud__Active__c = true,
    cgcloud__Display_In__c = 'Store Cockpit',
    cgcloud__Scheme_Name__c = 'salesforce1',
    cgcloud__URL__c = 'Monthly_Operating_Priorities',
    cgcloud__Sort__c = 0
));

links.add(new cgcloud__Mobile_Link__c(
    RecordTypeId = quickAccessRT,
    Name = 'Monthly Operating Priorities',
    cgcloud__Description_Language_1__c = 'Monthly Operating Priorities',
    cgcloud__Active__c = true,
    cgcloud__Display_In__c = 'Your Day',
    cgcloud__Scheme_Name__c = 'salesforce1',
    cgcloud__URL__c = 'Monthly_Operating_Priorities',
    cgcloud__Sort__c = 0
));

insert links;
System.debug('Inserted ' + links.size() + ' Mobile Link records for Monthly Operating Priorities.');
