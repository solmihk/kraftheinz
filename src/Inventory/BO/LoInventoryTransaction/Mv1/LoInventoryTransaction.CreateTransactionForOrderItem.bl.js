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
 * @function createTransactionForOrderItem
 * @this LoInventoryTransaction
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 * @param {LiOrderItem} mainItem
 * @param {Object} ivcInformation
 * @param {DomSdoCheckType} checkUserInventoryOver
 * @param {DomSdoCheckType} checkQuotaOver
 * @param {DomDate} commitDate
 * @returns validationError
 */
function createTransactionForOrderItem(mainItem, ivcInformation, checkUserInventoryOver, checkQuotaOver, commitDate){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    var jsonIvcTaData = {};
var convertedTransactionValue;

var mainItemUom = me.fetchUom(mainItem);
var orderId = me.fetchOrderId(mainItem);
var productDescription1 = me.fetchDescription1(mainItem);

// Create inventory transaction
jsonIvcTaData = {};
jsonIvcTaData.pKey = PKey.next();
jsonIvcTaData.ivcMainPKey = ivcInformation.ivcMainPKey;
jsonIvcTaData.ivcTaMetaPKey = ivcInformation.ivcMetaByItemMeta.getIvcTaMetaPKey();
jsonIvcTaData.sdoMainPKey = orderId;
jsonIvcTaData.sdoItemPKey = mainItem.getPKey();
jsonIvcTaData.accounted = "0";
jsonIvcTaData.initiationDate = Utils.createAnsiDateToday();
jsonIvcTaData.salesOrg = ApplicationContext.get('user').getBoUserSales().getSalesOrg();
jsonIvcTaData.initiatorUsrMainPKey = ApplicationContext.get('user').getPKey();
jsonIvcTaData.chargeDate = commitDate;
jsonIvcTaData.paymentMethod = "";
//Get the uom from inventory
var uom = ivcInformation.unitConversionInformation.filter(function(x){
  if(x.getUnitType() ==  mainItemUom){
    return x;
  }
});

//Convert inventory balance to unit of item 
if(uom.length > 0) {
  convertedTransactionValue = ivcInformation.unitConversionInformation.convertLogisticUnitToIvcMeasure(ivcInformation.ivcMetaByItemMeta.getIvcMeasure(), mainItem.getQuantity(), mainItemUom, uom[0].getPiecesPerSmallestUnit());
}
else {
  convertedTransactionValue = ivcInformation.unitConversionInformation.convertLogisticUnitToIvcMeasure(ivcInformation.ivcMetaByItemMeta.getIvcMeasure(), mainItem.getQuantity(), mainItemUom, mainItem.getPiecesPerSmallestUnit());
}

//Determine amount and algebraic sign        
if (ivcInformation.ivcMetaByItemMeta.getTaControl() == "Withdraw") {
  jsonIvcTaData.amount = convertedTransactionValue * (-1);
} else {
  jsonIvcTaData.amount = convertedTransactionValue;
}

//Validate inventory overdrawn
var balanceAfterTransaction = ivcInformation.balance + jsonIvcTaData.amount;
var validationError;

if (balanceAfterTransaction < 0) {
  var valueForMessage = Math.round(ivcInformation.unitConversionInformation.convertIvcMeasureToLogisticUnit(ivcInformation.ivcMetaByItemMeta.getIvcMeasure(), Math.abs(balanceAfterTransaction), mainItemUom, mainItem.getPiecesPerSmallestUnit()));

  //Validate user inventory over
  if ((ivcInformation.ivcMetaByItemMeta.getMetaId() == "UserInventory") && (checkUserInventoryOver != "0")) {
    if (checkUserInventoryOver == "1") {
      // "Yes" - Prevent save 

      validationError = {
        "level": "error",
        "objectClass": "BoOrder",
        "messageID": "CasSdoOrderQuantityExceedsUserInventorySummary",
        "messageParams": { "summary": productDescription1 + " (" + valueForMessage + " " + mainItemUom + ")" }
      };
    } else {
      // "Warning" - Display warning message and proceed with save

      validationError = {
        "level": "warning",
        "objectClass": "BoOrder",
        "messageID": "CasSdoOrderQuantityExceedsUserInventoryWarningSummary",
        "messageParams": { "summary": productDescription1 + " (" + valueForMessage + " " + mainItemUom + ")" }
      };
    }
  }

  //Validate quota over
  if ((ivcInformation.ivcMetaByItemMeta.getMetaId() == "Quota") && (checkQuotaOver != "0")) {
    if (checkQuotaOver == "1") {
      // "Yes" - Prevent save

      validationError = {
        "level": "error",
        "objectClass": "BoOrder",
        "messageID": "CasSdoOrderQuantityExceedsQuotaSummary",
        "messageParams": { "summary": productDescription1 + " (" + valueForMessage + " " + mainItemUom + ")" }
      };
    } else {
      // "Warning" - Display warning message and proceed with save

      validationError = {
        "level": "warning",
        "objectClass": "BoOrder",
        "messageID": "CasSdoOrderQuantityExceedsQuotaWarningSummary",
        "messageParams": { "summary": productDescription1 + " (" + valueForMessage + " " + mainItemUom + ")" }
      };
    }
  }
}

me.addItems([jsonIvcTaData]);
me.getItemsByParam({ "pKey": jsonIvcTaData.pKey })[0].setObjectStatus(STATE.NEW | STATE.DIRTY);
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return validationError;
}