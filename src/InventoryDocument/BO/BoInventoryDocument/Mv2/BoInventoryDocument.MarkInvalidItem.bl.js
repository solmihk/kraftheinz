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
 * @function markInvalidItem
 * @this BoInventoryDocument
 * @kind businessobject
 * @namespace CORE
 * @param {Object} item
 * @param {boolean} invalid
 */
function markInvalidItem(item, invalid) {
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Sets icon and flag for invalid icons. 
     * Can also be used to reset invalid flag and icon.
     * 
     * A seperarate flag is needed on mainList because main list does only show isOrderUnit = 1
     * BUT also main list item should be marked as invalid if a related uOm item (not visible in main list) is invalid.
     * Because both lists are linked and synced via weak references we cannot use the same flag.
     */

    const invalidIcon = BLConstants.DefaultImages.RED_EXCLAMATION_MARK;
    const validIcon = BLConstants.DefaultImages.EMPTY_IMAGE ;

    if (invalid) {
        item.setObjectStatusFrozen(true);
        item.setMissingModReason("1");
        item.setIconModReason(invalidIcon);
        item.setMissingModReasonMainList("1");
        item.setIconModReasonMainList(invalidIcon);
        item.setObjectStatusFrozen(false);
    } else {
        item.setObjectStatusFrozen(true);
        item.setMissingModReason("0");
        item.setIconModReason(validIcon);
        item.setMissingModReasonMainList("0");
        item.setIconModReasonMainList(validIcon);
        item.setObjectStatusFrozen(false);
    }

    let uomLisItems = me.getLoItemsUnitOfMeasureList() ? me.getLoItemsUnitOfMeasureList().getAllItems() : [];

    //If uom list is loaded already for main item
    if (uomLisItems.length > 0 && uomLisItems[0].getProductId() === item.getProductId()) {
        //check if there are any invalid UoM items
        //If so set the visible related main item invalid to
        //If not clean the visible related main item
        var invalidUomItems = me.getLoItemsUnitOfMeasureList().getItemsByParam({ "missingModReason": '1', 'productId': item.getProductId() });
        var visibleMainItem = me.getLoItemsMainList().getItemsByParam({ "pKey": item.getMainItemReference() })[0];
        if (Utils.isDefined(visibleMainItem)) {
            if (invalidUomItems.length > 0) {
                visibleMainItem.setObjectStatusFrozen(true);
                //set flag visible in main list
                visibleMainItem.setMissingModReasonMainList("1");
                visibleMainItem.setIconModReasonMainList(invalidIcon);
                visibleMainItem.setObjectStatusFrozen(false);
            } else {
                visibleMainItem.setObjectStatusFrozen(true);
                //reset flag visible in main list
                visibleMainItem.setMissingModReasonMainList("0");
                visibleMainItem.setIconModReasonMainList(validIcon);
                visibleMainItem.setObjectStatusFrozen(false);
            }
        }
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////


}