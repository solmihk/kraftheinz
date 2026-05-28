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
 * @function prepareItemsForSave
 * @this BoInventoryDocument
 * @kind businessobject
 * @namespace CORE
 * @description Takes care to not save order items which are only prepopulated and NOT touched.
 * If there exist persisted items which are set to quantity 0 the items will be deleted.
 * These kind of items hold no aditional information so no need to save it.
 */
function prepareItemsForSave(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    let orderItems = me.getLoItemsMainList().getAllItems();

    orderItems.forEach(item => {

        if (me.getDocumentType() === BLConstants.Order.DOCUMENT_TYPE_PRODUCT_CHECK_OUT) {
            //if this item is a prepopulated item (coming via additional UoMs of the product)
            // --> do not save the item if quantity is 0
            if (item.getQuantity() == 0 && item.getTargetQuantity() == 0) {
                if (item.getObjectStatus() == (STATE.NEW | STATE.DIRTY)) {
                    //do not save
                    item.setObjectStatus(STATE.NEW);
                } else if (item.getObjectStatus() == (STATE.PERSISTED | STATE.DIRTY)) {
                    //delete
                    item.setObjectStatus(STATE.DELETED | STATE.DIRTY);
                }
            }
        } else if (me.getDocumentType() === BLConstants.Order.DOCUMENT_TYPE_PRODUCT_CHECK_IN) {
            //if this item is a prepopulated item (coming via additional UoMs of the product)
            // --> do not save the item if quantity is 0 and left on vehicle quantity is 0 too
            if (item.getQuantity() == 0 && item.getTargetQuantity() == 0 && item.getLeftQuantity() == 0) {
                if (item.getObjectStatus() == (STATE.NEW | STATE.DIRTY)) {
                    //do not save
                    item.setObjectStatus(STATE.NEW);
                } else if (item.getObjectStatus() == (STATE.PERSISTED | STATE.DIRTY)) {
                    //delete
                    item.setObjectStatus(STATE.DELETED | STATE.DIRTY);
                }
            }
        }
    });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}