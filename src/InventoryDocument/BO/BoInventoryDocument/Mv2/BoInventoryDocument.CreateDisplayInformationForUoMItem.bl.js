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
 * -> namespace: Use CORE or CUSTOM. If you are a Salesforce client or an implementation partner, always use CUSTOM to enable a seamless release upgrade.

 * -> maxRuntime: Maximum time this function is allowed to run, takes integer value in ms. If the max time is exceeded, error is logged.
 * -> returns: Type and variable name in which the return value is stored.
 *
 * ------- METHOD RELEVANT GENERATOR PARAMETERS BELOW - ADAPT WITH CAUTION -------
 * @function createDisplayInformationForUoMItem
 * @this BoInventoryDocument
 * @kind businessobject
 * @namespace CORE
 * @param {Object} unitOfMeasureItem
 * @returns unitInformation
 * @description This function calculates the unit information string
 * For CheckOut Docs: <Short UoM-Name>: <Quantity>/<TargetQuantity> <(Difference)> --> For Example: L:  2 / 3  (-1)     CU:  5 / 2  (3)     SU:  1 / 1 
 * For ChecIn Docs: <Short UoM-Name>: <Quantity> --> For Example: CU:  5     SU:  1
 */
function createDisplayInformationForUoMItem(unitOfMeasureItem){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    let isCheckInDoc = me.getDocumentType() === BLConstants.Order.DOCUMENT_TYPE_PRODUCT_CHECK_IN;
    let unitInformation = "";
    let uomShortText = "";

    if (!(Utils.isEmptyString(unitOfMeasureItem.getUom()))) {
        uomShortText = Utils.getToggleText("DomPrdLogisticUnit", unitOfMeasureItem.getUom(), true);
    }

    let differenceString = "";

    //calculate string for checkOut docs (including difference)
    if (!isCheckInDoc &&
        (unitOfMeasureItem.getQuantity() != unitOfMeasureItem.getTargetQuantity())
    ) {
        let difference = unitOfMeasureItem.getQuantity() - unitOfMeasureItem.getTargetQuantity();
        differenceString = BLConstants.UI.NOBREAKSPACEUNICODECHAR + "(" + difference + ")";
    }

    if (!isCheckInDoc) {
        //calculate string for checkOut docs
        unitInformation = uomShortText + ":" + BLConstants.UI.NOBREAKSPACEUNICODECHAR + unitOfMeasureItem.getQuantity() + BLConstants.UI.NOBREAKSPACEUNICODECHAR + "/" + BLConstants.UI.NOBREAKSPACEUNICODECHAR + unitOfMeasureItem.getTargetQuantity() + differenceString + BLConstants.UI.NOBREAKSPACEUNICODECHAR+ BLConstants.UI.NOBREAKSPACEUNICODECHAR;
    } else {
        //calculate string for checkIn docs
        unitInformation = uomShortText + ":" + BLConstants.UI.NOBREAKSPACEUNICODECHAR + unitOfMeasureItem.getQuantity() + BLConstants.UI.NOBREAKSPACEUNICODECHAR + BLConstants.UI.NOBREAKSPACEUNICODECHAR;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

}