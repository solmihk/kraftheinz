"use strict";

///////////////////////////////////////////////////////////////////////////////////////////////
//                 IMPORTANT - DO NOT MODIFY AUTO-GENERATED CODE OR COMMENTS                 //
//Parts of this file are auto-generated and modifications to those sections will be          //
//overwritten. You are allowed to modify:                                                    //
// - the tags in the jsDoc as described in the corresponding section                         //
// - the function name and its parameters                                                    //
// - the function body between the insertion ranges                                          //
//         "Add your customizing javaScript code below / above"                              //
//                                                                                           //
// NOTE:                                                                                     //
// - If you have created PRE and POST functions, they will be executed in the same order     //
//   as before.                                                                              //
// - If you have created a REPLACE to override core function, only the REPLACE function will //
//   be executed. PRE and POST functions will be executed in the same order as before.       //
//                                                                                           //
// - For new customizations, you can directly modify this file. There is no need to use the  //
//   PRE, POST, and REPLACE functions.                                                       //
//                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Use the following jsDoc tags to describe the BL function. Setting these tags will
 * change the runtime behavior in the mobile app. The values specified in the tags determine
 * the name of the contract file. The filename format is “@this . @function .bl.js”.
 * For example, LoVisit.BeforeLoadAsync.bl.js
 * -> function: Name of the businessLogic function.
 * -> this: The LO, BO, or LU object that this function belongs to (and it is part of the filename).
 * -> kind: Type of object this function belongs to. Most common value is "businessobject".
 * -> async: If declared as async then the function should return a promise.
 * -> param: List of parameters the function accepts. Make sure the parameters match the function signature.
 * -> module: Use CORE or CUSTOM. If you are a Salesforce client or an implementation partner, always use CUSTOM to enable a seamless release upgrade.
 * -> maxRuntime: Maximum time this function is allowed to run, takes integer value in ms. If the max time is exceeded, error is logged.
 * -> returns: Type and variable name in which the return value is stored.
 * @function loadAsync
 * @this LoOrderOverviewContextMenu
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} jsonParams
 * @returns result
 */
function loadAsync(jsonParams){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

//Unwarp jsonParams
var phase;
var mobilityRelevant;

var sdoSubtype;
var clbMainPKey;
var callPKey;
var callStatus;
var bCallIsReadOnly;
var responsiblePKey;
var orderId = "";
var syncStatus;
var isDSDMode = false;
var documentType;

var enableCancel = "1";
var enableDelete = "1";
var enableCopy = "1";
var isVisitReadOnly = false;
var index = 0;
for (index in jsonParams.params) {
  switch (jsonParams.params[index].field) {
    case "phase":
      phase = jsonParams.params[index].value;
      break;
    case "mobilityRelevant":
      mobilityRelevant = jsonParams.params[index].value;
      break;             
    case "clbMainPKey":
      clbMainPKey = jsonParams.params[index].value;
      break; 
    case "sdoSubType":
      sdoSubtype = jsonParams.params[index].value;  //TODO: Toggles
      break; 
    case "callPKey":
      callPKey = jsonParams.params[index].value;
      break;          
	case "clbStatus":
 	  callStatus = jsonParams.params[index].value;
      break; 
    case "responsiblePKey":
 	  responsiblePKey = jsonParams.params[index].value;
      break; 
    case "pKey":
      orderId = jsonParams.params[index].value;
      break;
    case "syncStatus":
      syncStatus = jsonParams.params[index].value;
      break;
    case "isVisitReadOnly":
      isVisitReadOnly = jsonParams.params[index].value;
      break;
    case "documentType":
      documentType = jsonParams.params[index].value;
      break;
  }
}

if(ApplicationContext.get('user').hasRole('TourUser')) 
  isDSDMode = true;

// Validations for additional parameters sent for deliveries, for others setting it to empty string
if(Utils.isDefined(callStatus)){
	bCallIsReadOnly = callStatus === "Completed" || callStatus === "Canceled";
}else{
	bCallIsReadOnly = "";
}
if(!Utils.isDefined(callPKey)){
	callPKey = "";
}
if(!Utils.isDefined(clbMainPKey)){
	clbMainPKey = "";
}
if(!Utils.isDefined(sdoSubtype)){
	sdoSubtype = "";
}
var isResponsible = responsiblePKey === ApplicationContext.get('user').getPKey();

if ((phase != "Initial" && phase != "HoldBack") || (mobilityRelevant === "0") || (sdoSubtype===BLConstants.Order.DOCUMENT_TYPE_DELIVERY && clbMainPKey != callPKey) || 
    (sdoSubtype===BLConstants.Order.DOCUMENT_TYPE_DELIVERY && bCallIsReadOnly) || !isResponsible || syncStatus === BLConstants.Order.NOT_SYNCABLE || (callStatus === "Planned" && isDSDMode)){
  enableCancel = "0";
}

if (syncStatus === BLConstants.Order.NOT_SYNCABLE && orderId.startsWith("Local_")){
  enableDelete = "1";
}

else if ((phase != "Initial") || (mobilityRelevant === "0") || (sdoSubtype===BLConstants.Order.DOCUMENT_TYPE_DELIVERY && clbMainPKey != callPKey)|| 
    (sdoSubtype===BLConstants.Order.DOCUMENT_TYPE_DELIVERY && bCallIsReadOnly) || !isResponsible || (syncStatus === BLConstants.Order.NOT_SYNCABLE && !orderId.startsWith("Local_") || (callStatus === "Planned" && isDSDMode)) || documentType === BLConstants.Order.DOCUMENT_TYPE_DELIVERY){
  enableDelete = "0";
}

if ((mobilityRelevant === "0") || (sdoSubtype===BLConstants.Order.DOCUMENT_TYPE_DELIVERY) || ((callStatus === "Planned" || callStatus === "Completed") && isDSDMode) || isVisitReadOnly || documentType === BLConstants.Order.DOCUMENT_TYPE_DELIVERY){
  enableCopy = "0";
}

//Build context menu list
var contextMenuItemList = [];

var menuEntry0 = {
  "id": "0000001",
  "actionImg": "ExecuteDarkGrey24",
  "actionId": "Open",
  "processEvent": "Execute",
  "actionEnabled": "1"
};
var menuEntry1 = {
  "id": "0000002",
  "actionImg": "CancelDarkGrey24",
  "actionId": "Cancel",
  "processEvent": "Cancel",
  "actionEnabled": enableCancel
};
var menuEntry2 = {
  "id": "0000003",
  "actionImg": "TrashcanDarkGrey24",
  "actionId": "Delete",
  "processEvent": "Delete",
  "actionEnabled": enableDelete
};
var menuEntry3 = {
  "id": "0000004",
  "actionImg": "CopyDarkGrey24",
  "actionId": "Copy",
  "processEvent": "Copy",
  "actionEnabled": enableCopy
};

contextMenuItemList.push(menuEntry0);
contextMenuItemList.push(menuEntry1);

// Disabling Delete and Copy for Delivery Doc Type
if(documentType !== BLConstants.Order.DOCUMENT_TYPE_DELIVERY) {
  contextMenuItemList.push(menuEntry2);
  contextMenuItemList.push(menuEntry3);
}

me.addItems(contextMenuItemList);

var items = me.getItems();

for (var i = 0; i < items.length; i++) {
  if (items[i].getActionEnabled() == "0") {
    items[i].getACL().removeRight(AclObjectType.OBJECT, "LiOrderOverviewContextMenu", AclPermission.EDIT);
    items[i].getACL().removeRight(AclObjectType.OBJECT, "LiOrderOverviewContextMenu", AclPermission.EXECUTE);
  }
}

var result = when.resolve(me);
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return result;
}
