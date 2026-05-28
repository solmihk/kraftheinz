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
 * @function populateCheckOutItems
 * @this BoInventoryDocument
 * @kind businessobject
 * @async
 * @namespace CORE
 * @returns promise
 * @description Sets quantities of checkOut items
 *  + Calculates Difference 
 *  + Calculates item value
 *  + Create UOM Information String
 *  + Sets "isOrderUnit" filter
 */
function populateCheckOutItems(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    var promise = when.resolve(me);
    var deferreds = [];
    
    //set pKey for prepopulated UoM items (are not stored in DB)
    //set object status to new that propopulated items are not saved
    var loItemsMainList = me.getLoItemsMainList();
    var mainListItems = loItemsMainList.getAllItems();
    loItemsMainList.suspendListRefresh();

    var currentProduct = "";
    var currentMainItem = "";

    mainListItems.forEach(item => {

        //set pKey if item was prepopulated by Datasource
        if (item.getIsAddedMissingUoMItem() == "1") {
            item.setPKey(PKey.next());
            item.setObjectStatus(STATE.NEW);
        }

        //set main item link for non-main items
        //this will only work if list is ordered by isOrderUnit (main items first)
        if (item.getProductId() === currentProduct) {
            if (item.getIsOrderUnit() == "0" &&
                !Utils.isEmptyString(currentMainItem)) {
                item.setMainItemReference(currentMainItem);
            }
        } else {
            currentProduct = item.getProductId();
            if (item.getIsOrderUnit() == '1') {
                item.setMainItemReference(item.getPKey());
                currentMainItem = item.getPKey();
            }
        }

        //set order item fields according to presetting policy
        if (me.getDocumentType() === BLConstants.Order.DOCUMENT_TYPE_PRODUCT_CHECK_OUT && me.getBoOrderTemplate().getCheckOutType() === "SKU Check-Out") {

            switch (me.getBoOrderTemplate().getItemPresettingPolicy()) {

                //The system shows no line items, the user has to add / scan all products manually
                case "BlindMode":
                    AppLog.error("'Blind Mode' is not supported for inventory checkout documents. Please set the 'Item Presetting Policy' of the order template to 'Prepopulated'.");
                    break;

                //Non-blind mode: The system shows the line item with the expected quantity
                case "NonBlindMode":
                    AppLog.error("'Non Blind Mode' is not supported for inventory checkout documents. Please set the 'Item Presetting Policy' of the order template to 'Prepopulated'.");
                    break;


                // User needs to update only the quantities for products with deviations to the expected 
                case "Prepopulated":
                    //for added UoM item no prepopulation needed
                    //if targetQuantity = suggestedQuantity then item quantity was changed manually by user
                    //
                    //Example: Initially ERP delivered target quantity
                    //
                    // 1.)
                    // Target Quantity: 10
                    // Quantity: 0
                    // Suggested Quantity: 0
                    //
                    // 2.) Prepopulation done automatically by the system
                    // Target Quantity: 10
                    // Quantity: 10
                    // Suggested Quantity: 0
                    //
                    // 3.) User sets Quantity to 0 (No prepopulation to 10 should be done --> SuggestedQuantity is used to track that)
                    // Target Quantity: 10
                    // Quantity: 0
                    // Suggested Quantity: 10
                    //
                    if (item.getIsAddedMissingUoMItem() == "0" &&
                        (item.getTargetQuantity() != item.getSuggestedQuantity()) &&
                        item.getQuantity() != item.getTargetQuantity()) {
                        item.setQuantity(item.getTargetQuantity());
                    }
                    break;
            }

            deferreds.push(me.calculateItemValue(item, me.getBoOrderTemplate()));
        }
    });
    loItemsMainList.resumeListRefresh(true);

    //calculate difference
    mainListItems.forEach((item) => {
        me.calculateItemDifference(item);
    });

    //create main item unit information
    me.createDisplayInformationForMainItemList(mainListItems);

    //show only the main items
    loItemsMainList.setFilter("isOrderUnit", "1", "EQ");
        
    promise = when.all(deferreds);
    
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}