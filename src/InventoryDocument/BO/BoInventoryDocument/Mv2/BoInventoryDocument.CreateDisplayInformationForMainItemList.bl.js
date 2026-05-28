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
 * @function createDisplayInformationForMainItemList
 * @this BoInventoryDocument
 * @kind businessobject
 * @namespace CORE
 * @param {Array} inventoryDocumentItems
 */
function createDisplayInformationForMainItemList(inventoryDocumentItems) {
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * This function creates the unit information string for the main items (isOrderUnit = '1').
     * Other unit of measures belonging to the main item must fulfill orderAbility = '1'.
     * Example: 
     *   Sales Unit (isOrderUnit)          Target Quantity: 1       Quantity: 1
     *   Consumer Unit                     Target Quantity: 2       Quantity: 1
     *   Layer                             Target Quantity: 3       Quantity: 2
     *   ------------------------------------------------------------------------
     *   --> Unit information String
     *   orderUnitInformation:            1/1 Sales Unit
     *   additionalUnitsInformation:      1/2 Consumer Unit, 2/3 Layer
     */

    var mainItem;
    var orderUnitInformation = "";
    var additionalUnitsInformation = "";

    if (Utils.isDefined(inventoryDocumentItems)) {
        var currentReferenceId = inventoryDocumentItems.length > 0 ? inventoryDocumentItems[0].getReferenceId() : null;

        //disable event handling
        var mainList = me.getLoItemsMainList();
        mainList.suspendListRefresh();

        //items are ordered by reference id (productId + orderItemTemplateId)
        inventoryDocumentItems.forEach(item => {

            //write back the display information if product changes
            if (currentReferenceId !== item.getReferenceId()) {
                currentReferenceId = item.getReferenceId();

                if(Utils.isDefined(mainItem)){
                    //Freeze to keep object status
                    mainItem.setObjectStatusFrozen(true);
                    mainItem.setOrderUnitInformation(orderUnitInformation);
                    mainItem.setAdditionalUnitsInformation(additionalUnitsInformation);
                    mainItem.setObjectStatusFrozen(false);
                }

                orderUnitInformation = "";
                additionalUnitsInformation = "";
            }

            //main item is the item with isOrderUnit true
            //calculate unit information text for all item records
            var unitInfoText = me.createDisplayInformationForUoMItem(item);
            if (item.getIsOrderUnit() == "1") {
                mainItem = item;
                orderUnitInformation += unitInfoText;
            } else {
                additionalUnitsInformation += Utils.isEmptyString(additionalUnitsInformation) ? unitInfoText : "     " + unitInfoText;
            }
        });

        //if the last item in the list is a main item write back unit information
        if (Utils.isDefined(mainItem)) {

            //Freeze to keep object status
            mainItem.setObjectStatusFrozen(true);
            mainItem.setOrderUnitInformation(orderUnitInformation);
            mainItem.setAdditionalUnitsInformation(additionalUnitsInformation);
            mainItem.setObjectStatusFrozen(false);

            orderUnitInformation = "";
            additionalUnitsInformation = "";
        }

        //enable event handling
        mainList.resumeListRefresh(true);
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////


}