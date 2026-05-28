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
 * @function processValidateReasonCode
 * @this BoOrder
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {String} showMessage
 * @returns promise
 * @description This function will validate the reason code and based on output received from reasonCodeItemValidation it will mark the item as valid or invalid. And also in case of releasing the order this will validate and show alert if any of the item is marked as invalid.
 */
function processValidateReasonCode(showMessage){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise = when.resolve("ok");
var showMessageInternal = "1";

if(Utils.isDefined(showMessage)){
  showMessageInternal = showMessage;
}

if (me.getBoOrderMeta().getSdoSubType() == BLConstants.Order.DOCUMENT_TYPE_DELIVERY){
  // Get all order items
  let validate = false;
  let itemsMain = me.getLoItems();
  let items = itemsMain.getAllItems();
  let promises = [];
  let index;

  for (index = 0; index < items.length; index++) {
    const item = items[index];
    const itemMetas = me.getBoOrderMeta().getLoOrderItemMetas().getItemByPKey(item.getSdoItemMetaPKey());
    
    const newPromise = me.reasonCodeItemValidation(item, itemMetas, "1")
      .then((value) => {
        if (value) {
          item.setModReasonEntered('PrioHigh24');
        } else {
          item.setModReasonEntered('EmptyImage');
        }
        validate = validate || value; 
      })
      promises.push(newPromise);
  }
  return when.all(promises).then(() => {
    if (validate && showMessageInternal == "1") {
      var buttonValues = {};
      buttonValues[Localization.resolve("OK")] = "ok";

      return when(MessageBox.displayMessage(Localization.resolve("MessageBox_Title_Warning"), Localization.resolve("CasSdoNoModReasonEnteredAfterEdit"), buttonValues)).then(
        function (input) {
          me.setSetPhaseInBeforeSave("0");
          me.setValidateForRelease("0");
          return "Cancel";
        }
      );
    }
    else{
      return promise;
    }
  });
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
}