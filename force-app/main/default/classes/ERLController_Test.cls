/**
 * @description     test class for ERLController
 * @author          daniel@hyphen8.com
 * @date            15/04/2020
 * @group           Tests
*/
@isTest
public with sharing class ERLController_Test {

    public static testMethod void testCorrectObjectMapping(){

        // create a test parent account account
        Account parentaccount = new Account(Name='DEMO');
        insert parentaccount;
        // create a test account
        Account account = new Account(Name='DEMO',ParentId=parentaccount.Id);
        insert account;
        //create a test contact
        Contact contact = new Contact(LastName='DEMO',AccountID=account.Id);
        insert contact;
        // create a test opportunity
        Opportunity opportunity = new Opportunity(AccountID=account.Id,Name='DEMO', CloseDate=system.today(),StageName='Prospecting');
        insert opportunity;

        // run test
        Test.startTest();
            // now pull back our map
            ERLController.ERLSObjectWrapper getobjectdataaccount = ERLController.getsObjectInfo('Account', parentaccount.id);
            system.debug('getobjectdataaccount > ' + getobjectdataaccount.sObjectData.size());
            system.assertEquals(1, getobjectdataaccount.sObjectData.size(), 'Account process returned 1 record');
            ERLController.ERLSObjectWrapper  getobjectdatacontact = ERLController.getsObjectInfo('Contact', account.id);
            system.debug('getobjectdatacontact > ' + getobjectdatacontact.sObjectData.size());
            system.assertEquals(1,  getobjectdatacontact.sObjectData.size(), 'Contact process returned 1 record');
            ERLController.ERLSObjectWrapper  getobjectdataopportunity = ERLController.getsObjectInfo('Opportunity', account.id);
            system.debug('getobjectdataopportunity > ' + getobjectdataopportunity.sObjectData.size());
            system.assertEquals(1, getobjectdataopportunity.sObjectData.size(), 'Opportunity process returned 1 record');
            ERLController.ERLSObjectWrapper  getobjectdataerror = ERLController.getsObjectInfo(null, null);
            system.debug('getobjectdataerror > ' + getobjectdataerror.sObjectData);
            system.assertEquals(null, getobjectdataerror.sObjectData, 'Error check returned no records');
        Test.stopTest();
    }
}
