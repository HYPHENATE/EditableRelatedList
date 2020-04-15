import { LightningElement, api, track, wire } from 'lwc';

import getSObjectInfo from '@salesforce/apex/ERLController.getsObjectInfo';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';

const columns = [];

export default class EditableRelatedList extends NavigationMixin(LightningElement) {

    @api metadataName; 
    @api recordId;
    @api strTitle;                  // UI Defined Related List Title
    @api strIcon;                   // UI Defined Related List Icon
    @api setHeight;                 // UI Defined Related List Height
    @api newButton;                 // UI Defined Related List New Button
    @api defaultvalues;
    @api sObjectAPIName;
    @api sObjectParentField;  
    @track columns = columns;
    @track data;
    @track draftValues = [];
    @track loaded = false;
    @track setHeightValue;
    wiredResult;
    
    @wire(getSObjectInfo, { metadataName: '$metadataName', theId: '$recordId' })
    sobjectData(result) { 

        this.wiredResult = result;

        if(result.data) {
            
            let myMap = new Map();
            myMap = result.data;
            let theColumns;
            let theData;
                    
            for (const [key,value] of Object.entries(myMap)){
                           
                this.sObjectAPIName     = key.split(';')[0];            
                this.sObjectParentField = key.split(';')[1];
                         
                let mapData = new Map();
                mapData = value;
                
                for (const [key,value] of Object.entries(mapData)) {
   
                    theColumns = key; 
                    theData = JSON.stringify(value);
   
                }
            }
   
            console.log('### The Data : ' + theData);

            this.resizeComponent();
            console.log('dataload height : ' + this.setHeight);

            let jsonColumns = JSON.parse(theColumns);                                               
            this.columns = jsonColumns;     
            var jsonData = JSON.parse(theData);      
            
            this.data = jsonData;    
            this.loaded = !this.loaded;
                
        } else if(result.error) {
            window.console.log(JSON.stringify(result.error));
        }

    }

    createNewRecord() {
        this.defaultvalues = new String(this.sObjectParentField + '=' +  this.recordId);
       
        window.console.log('this.sobjectAPIName ' +  this.sObjectAPIName);
        window.console.log('default values ' + this.defaultvalues);
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {              
                objectApiName: this.sObjectAPIName,            
                actionName: 'new'
            },
            state : {
                nooverride: '1',              
                defaultFieldValues: this.defaultvalues
            }
        });
    }

resizeComponent(){
    console.log('in resizeComoponent' + this.setHeight);
    // Keeping correct height following save 
    if(this.setHeight == null || this.setHeight == '' || this.setHeight == 'undefined'){
        this.setHeightValue = 'Height: 250px';
    } else {
        this.setHeightValue = 'Height:' + this.setHeight; 
    }
}

handleSave(event) {
    
    let draftValues = event.detail.draftValues;

    const recordInputs = event.detail.draftValues.slice().map(draft => {
        const fields = Object.assign({}, draft);
        return { fields };
    });

    const promises = recordInputs.map(recordInput => updateRecord(recordInput));
  
    Promise.all(promises).then(objectRecs => {
        console.log('in here');
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: this.metadataName + '(s) successfully updated',
                variant: 'success'
            })
        );
         // Clear all draft values
        this.draftValues = [];
        this.setHeightValue = null;

        return refreshApex(this.wiredResult);

        }).catch(error => {
            console.log('error ' + JSON.stringify(error));// Handle error
    });
    this.loaded = !this.loaded;

    }  
}