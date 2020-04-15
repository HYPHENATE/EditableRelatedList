/**
 * @description     Controller class for the LWC Editable Related List Component
 * @author          phil@hyphen8.com / david.bradburn@hyphen8.com
 * @date            06/03/2020
*/

public with sharing class ERLController {

    /**
     * @description     getsObjectInfo info is the method that gets call to confirm based on meta data what we should be displaying
     *                  on screen
     * @param           string metadataName - this is the name of the metadata to query
     * @param           string theId - this is the ID of the record being viewed / processed
     * @return          Map<String, Map<String, List<SObject>>>
     */

    @AuraEnabled(cacheable=true)
    public static Map<String, Map<String, List<SObject>>> getsObjectInfo(String metadataName, String theId){

         Map<String, Map<String, List<SObject>>> mapReturnData =  new Map<String, Map<String, List<SObject>>>();
         String sobjectAPIName;

         String getId = theId;
         String soqlStatement = 'SELECT id,';
    
         id parentId = theId;

         system.debug('metadataname is  ' + metadataname);
         system.debug('theId is  ' + theId);

         String parentObject = parentId.getsobjecttype().getDescribe().getName();

         String result = '';
         
         Map<String, List<sobject>> mapAllData = new Map<String, List<sobject>>();
         JSONGenerator jsonGen = JSON.createGenerator(true);
         jsonGen.writeStartArray();

         for(ERL_Meta__mdt ERLMeta : [SELECT Id, SObjectField__r.QualifiedAPIName, SObjectField__r.DataType, SObjectField__r.MasterLabel, SObject__c, SObject__r.QualifiedAPIName, Editable__c, order__c
                                                 FROM ERL_Meta__mdt 
                                                 WHERE SObject__r.MasterLabel = :metadataName                                   
                                                 AND  Visible__c = true
                                                 AND  Parent_SObject__c = null
                                                 ORDER BY Order__c ASC]){
              String fieldType;
              sobjectAPIName = String.valueof(ERLMeta.SObject__r.QualifiedAPIName);                                      

              soqlStatement += ERLMeta.SObjectField__r.QualifiedAPIName + ',';
              fieldType = 'text';
         
              system.debug('ERLMeta.SObjectField__r.DataType ' + ERLMeta.SObjectField__r.DataType);

              if(ERLMeta.SObjectField__r.DataType.contains('Text') || ERLMeta.SObjectField__r.DataType.contains('Name')) {
                   fieldType = 'text';
              }

              if(ERLMeta.SObjectField__r.DataType.containsIgnoreCase('Email')){
                   fieldType = 'email';
              }

              if(ERLMeta.SObjectField__r.DataType.containsIgnoreCase('Url')){
                   fieldType = 'url';
              }

              if(ERLMeta.SObjectField__r.DataType.containsIgnoreCase('Number')){
                   fieldType = 'number';
              }
              
              if(ERLMeta.SObjectField__r.DataType.containsIgnoreCase('Currency')){
                   fieldType = 'currency';
              }

              if(ERLMeta.SObjectField__r.DataType.containsIgnoreCase('Date')){
                   fieldType = 'date';
              }

              if(ERLMeta.SObjectField__r.DataType.containsIgnoreCase('phone')){
                   fieldType = 'phone';
              }

              if(ERLMeta.SObjectField__r.DataType.containsIgnoreCase('checkbox')){
                   fieldType = 'boolean';
              }

              if(ERLMeta.SObjectField__r.DataType.containsIgnoreCase('percent')){
                   fieldType = 'percent';
              }
          
                
              jsonGen.writeStartObject();
        
              jsonGen.writeStringField('label', ERLMeta.SObjectField__r.MasterLabel);
         
              jsonGen.writeStringField('type',  fieldType);
         
              jsonGen.writeStringField('fieldName', ERLMeta.SObjectField__r.QualifiedAPIName);
       
              if(ERLMeta.Editable__c){
                   jsonGen.writeStringField('editable', 'true' );
              }
         
              jsonGen.writeEndObject();
         }

         jsonGen.writeEndArray();

         soqlStatement = soqlStatement.removeEnd(',');

         system.debug('soqlStatement is ' + soqlStatement);

         ERL_Meta__mdt ERL_Datawhereclause = [SELECT SObjectField__r.QualifiedAPIName, SObject__r.QualifiedAPIName
                                                           FROM ERL_Meta__mdt
                                                           WHERE SObject__r.MasterLabel =  :metadataName
                                                           AND Parent_SObject__r.QualifiedAPIName = :parentObject];

         soqlStatement += ' FROM ' + ERL_Datawhereclause.SObject__r.QualifiedAPIName + ' WHERE ' + ERL_Datawhereclause.SObjectField__r.QualifiedAPIName + ' = :getId';
       
                  
         List<sObject> sobjList = Database.query(soqlStatement);

    
         String dataColumns = jsonGen.getAsString();

         sobjectAPIName += ';' +  ERL_Datawhereclause.SObjectField__r.QualifiedAPIName;

         mapAllData.put(dataColumns, sobjList);

         // New Map defined key = Contact, value is the map of the columns and data
         mapReturnData.put(sobjectAPIName, mapAllData);

         system.debug('mapAllData is ' + mapAllData);

         return mapReturnData;

    }  
}