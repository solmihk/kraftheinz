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
 * @function saveAsync
 * @this BoOrder
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @returns promise
 * @description Function is saving BoOrder if editable. It is also saving all related objects if available.
 */
function saveAsync(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
var promise = when.resolve();

if (me.isEditable()) {

  var deliveryDateSetterResult;
  if (Utils.isEmptyString(me.getDeliveryDate())) {
    //the asynchronous eventhandler makes this setter asynchronous
    deliveryDateSetterResult = me.setDeliveryDate(Utils.getMinDate()); 
  }

  promise = when(deliveryDateSetterResult)
    .then(function (){
      return BoFactory.createObjectAsync("BoSfHelper", {})
        .then(function (helper){
        var invoiceNote ="";
        var deliveryNote = "";

        if (Utils.isDefined(me.getLoNotes())) {
          var invoiceNotes = [];
          var deliveryNotes = [];

          me.getLoNotes().forEach(function(currentNote){
            if(currentNote.type == "Invoice"){
              invoiceNotes.push(currentNote);
            }
            else if(currentNote.type == "Delivery"){
              deliveryNotes.push(currentNote);
            }
          });

          if (invoiceNotes.length > 0) {
            invoiceNote = invoiceNotes[0].text;
          } 
          if (deliveryNotes.length > 0) {
            deliveryNote = deliveryNotes[0].text;
          }
        }

        var additionalMappings = [
          { name: "invoiceNotes", dsColumn: "Invoice_Note__c", value: invoiceNote },
          { name: "deliveryNotes", dsColumn: "Delivery_Note__c", value: deliveryNote }];

        return helper.saveTrackedObject(me, additionalMappings);
    });
  })
    .then(function() {

    var deferreds = [];

    if (Utils.isDefined(me.getLoItems())) {
      deferreds.push(me.getLoItems().saveAsync());
    }

    //In CGCloud SplittingParentSdoMainPKey is a derived attribute and will always be an empty string.
    if (Utils.isDefined(me.getLoInventories()) && (!Utils.isDefined(me.getSplittingParentSdoMainPKey()) || Utils.isEmptyString(me.getSplittingParentSdoMainPKey()))) {
      deferreds.push(me.getLoInventories().saveAsync());
    }

    if (Utils.isDefined(me.getLoInventoryTransactions())) {
      deferreds.push(me.getLoInventoryTransactions().saveAsync());
    }

    if (Utils.isDefined(me.getLoRecentState())) {
      deferreds.push(me.getLoRecentState().saveAsync());
    }

    if (Utils.isDefined(me.getLoOrderAttachment())) {
      deferreds.push(me.getLoOrderAttachment().saveAsync());
    }

    if (Utils.isDefined(me.getLoPayments())) {
      deferreds.push(me.getLoPayments().saveAsync());
    }

    if (Utils.isDefined(me.getLoSysSignatureAttribute())) {
      deferreds.push(me.getLoSysSignatureAttribute().saveAsync());
    }

    if (Utils.isDefined(me.getLoSysSignatureBlob())) {
      deferreds.push(me.getLoSysSignatureBlob().saveAsync());
    }

    return when.all(deferreds)
      .then(function (){
        //Reset object status for all to prevent multiple saves
        me.setObjectStatus(STATE.PERSISTED, true);
      });
  });
}
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}