[![codecov](https://codecov.io/gh/HYPHENATE/EditableRelatedList/branch/master/graph/badge.svg)](https://codecov.io/gh/HYPHENATE/EditableRelatedList)
[![HYPHENATE](https://circleci.com/gh/HYPHENATE/EditableRelatedList.svg?style=svg&&circle-token=297c83f424a06b21dc3b4fa042318223464f67d7)](https://circleci.com/gh/HYPHENATE/EditableRelatedList)

# Editable Related List

This simple LWC (Lightning Web Component) can be loaded onto any object and display a related datatable with editable fields. All controlled via Custom Meta Data and the 'Edit Page' Lightning Page Builder. 

## Verion Control

### 1.0 - Initial release
 - Support for both Standard and Custom Objects
 - User defined Related List Label
 - Picklist for selection of Relatd List Icon
 - Ability to define field Visibility within the Datatable
 - Ability to define if a field is Editible
 - Define the order fields are displayed within the Datatable
 
### 1.1 - Size and New Child Record Functionality
 - Allows for toggling the 'New' record button on the Related List 
 - Allows the Height of the component to be set on the Lightning Page
<img src="https://github.com/HYPHENATE/EditableRelatedList/blob/master/images/Annotation%202020-04-17%20112933.png?raw=true" width="700px"/>

### 1.2 - View Records and Error Feedback
 - 'View Details' link takes you to each child record
 - Invalid Picklist / Multi-Select Picklist Values entered prompt Error Toast Feedback

## Part 1: Installation

<a href="https://githubsfdeploy.herokuapp.com?owner=HYPHENATE&repo=EditableRelatedList">
  <img alt="Deploy to Salesforce"
       src="https://raw.githubusercontent.com/afawcett/githubsfdeploy/master/deploy.png">
</a>

 - Click the above link to 'Deploy to Salesforce'
   - If you experience issues with deployment, try entering 'master' into the branch field on the deployment page
 - Select the type of evironment to 'Deploy to'
 - Hit 'Login to Salesforce' in the top-right, and enter your credentials
 - Git 'Deploy' in the top-right

## Part 2: Configuration

Once installed, follow the <a href="https://github.com/HYPHENATE/EditableRelatedList/blob/master/Editable%20Related%20List%20-%20Configuration.docx?raw=true">Configuration Guide</a> for steps on configuring Editable Related Lists. In summary, the following actions are required: 
 
 - Create Custom MetaData records for desired Editable Related Lists
 - Add the Editable Related List component to the Parent Object Lightning Record Page
 - Assign Permissions Set to desired users 
   - Alternatively, updated Profiles to have access to the ERL components

## Part 3: Limitations

### Functional Limitations
 - Picklist Fields
   - These can be used, but there is no list of Picklist Options presented. Simply Enter the desired Picklist value, and this will be saved against the record. Ensure to use correct picklist values
 - Multi-Select Picklist Fields
   - These can be used, but there is no list of Picklist Options presented. Simply Enter the desired Picklist values, and this will be saved against the record. Ensure to use correct picklist values and syntax when entering these, ie: Option 1;Option 2; Option 3

### NON-Functional Limitations
 - Rollup Summary fields display blank field within the component when included
 - Lookup Fields do not work with the component
 - Compound fields can not be edited (eg: Contact Full Name)
