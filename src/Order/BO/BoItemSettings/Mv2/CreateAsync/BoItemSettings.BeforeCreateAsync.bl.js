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
 * @function beforeCreateAsync
 * @this BoItemSettings
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} context
 * @returns promise
 * @description Function to pre-populate item setting fields (for example scan behavior and the currently selected item template)
 */
function beforeCreateAsync(context){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise = when.resolve(me);
var curOrderItemMetaList;
var isScanIncrementQuantitySetThroughParams = false;

for (var index in context.jsonQuery.params) {              
  switch (context.jsonQuery.params[index].field) {
    case "currentScanIncrementQuantity":
      me.setCurrentScanIncrementQuantity(context.jsonQuery.params[index].value);
      isScanIncrementQuantitySetThroughParams = true;
      break;
    case "scanBehavior":
      me.setUoMScanBehavior(context.jsonQuery.params[index].value);
      break;
    case "defaultUnit":
      me.setUoMScanDefaultUnit(context.jsonQuery.params[index].value);
      break;
    case "barcodeScanBehavior":
      me.setBarcodeScanBehavior(context.jsonQuery.params[index].value);
      break;
    case "currentItemMeta":
      me.setCurrentItemMeta(context.jsonQuery.params[index].value);
      break;
    case "orderItemMetaList":
      curOrderItemMetaList = context.jsonQuery.params[index].value;
      break;
  }
}    

//check if current item meta is valid (means in the item meta list)
//or item meta list is undefined (this is the case if current document is not a delivery document)
if(
  !Utils.isEmptyString(me.getCurrentItemMeta()) && 
  (!Utils.isDefined(curOrderItemMetaList) || curOrderItemMetaList.getItems().filter((itemTemplate) => itemTemplate.pKey === me.getCurrentItemMeta()).length > 0)
 ){
  promise = BoFactory.loadObjectByParamsAsync(LU_ORDERITEMMETA, {
    params: [
      {
        field: "pKey",
        value: me.getCurrentItemMeta(),
        operator: "EQ"
      }
    ]
  }).then(function(luItemMeta){
    if(Utils.isDefined(luItemMeta)){
      me.setLuOrderItemMeta(luItemMeta);
      if(!isScanIncrementQuantitySetThroughParams){
        // if CREATION is invoked without ScanIncrementQuantity parameter default the ScanIncrementQuantity to Item Template's ScanIncrementQuantity.
        me.setCurrentScanIncrementQuantity(luItemMeta.getScanIncrementQuantity());
      }								
      me.setEARight();
    }
    me.onUoMScanBehaviorChanged();
    return me;
  });
} else {
  me.setLuOrderItemMeta(BoFactory.instantiate(LU_ORDERITEMMETA,{}));
  me.setCurrentItemMeta(' ');
  me.onUoMScanBehaviorChanged();
  me.setEARight();
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}