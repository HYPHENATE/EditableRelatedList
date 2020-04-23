import { LightningElement, api, track, wire } from 'lwc';

import getSObjectInfo from '@salesforce/apex/ERLController.getsObjectInfo';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';

// defining columns for lightning data table
const columns = [];
const actions = [
                  { label: 'Show details', name: 'show_details' }
                ];

export default class EditableRelatedList extends NavigationMixin(LightningElement) {

    // defined api variables
    @api metadataName;
    @api recordId;
    @api strTitle;                  // UI Defined Related List Title
    @api strIcon;                   // UI Defined Related List Icon
    @api setHeight;                 // UI Defined Related List Height
    @api newButton;                 // UI Defined Related List New Button
    @api defaultvalues;
    @api sObjectAPIName;
    @api sObjectParentField;

    // tracked variables
    columns = columns;
    action
    data;
    draftValues = [];
    preSelectedRows = [];

    loaded = false;
    setHeightValue;
    wiredResult;
    recordPageUrl;
    error = [];

    // wire service to pull in the data
    @wire(getSObjectInfo, { metadataName: '$metadataName', theId: '$recordId' })
    sobjectData(result) {

        this.wiredResult = result;

        if(result.data) {

           let returnedData = result.data;

           let columnsdata = JSON.parse(returnedData.dataColumns);
           let actionData = {type:'action', typeAttributes: { rowActions: actions}};
           columnsdata.push(actionData);

           this.sObjectAPIName     = returnedData.childSObjectName;
           this.sObjectParentField = returnedData.parentSObjectField;
           this.columns            = columnsdata;
           this.data               = returnedData.sObjectData;
           this.loaded             = !this.loaded;


        } else if(result.error) {
            window.console.log(JSON.stringify(result.error));

        }

    }

    // method to handle the creation of a new record
    createNewRecord() {
        this.defaultvalues = new String(this.sObjectParentField + '=' +  this.recordId);

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

    // method to handle the resizing of the component
    resizeComponent(){

        // Keeping correct height following save
        if(this.setHeight == null || this.setHeight == '' || this.setHeight == 'undefined'){
            this.setHeightValue = 'Height: 250px';
        } else {
            this.setHeightValue = 'Height:' + this.setHeight;
        }
    }

    //method to hande the save
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

                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message : 'Update failed please check data entered',
                        variant: 'error'
                    })
                );
                this.loaded = !this.loaded;
        });
        this.loaded = !this.loaded;
    }
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        switch (actionName) {
            case 'show_details':
                this.showRowDetails(row);
                break;
            default:
        }
    }
    showRowDetails(row){

        let rowId = row.Id;

        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: rowId,
                actionName: 'view',
            },
            state : {
                nooverride: '1'
            }
        });

    }

}