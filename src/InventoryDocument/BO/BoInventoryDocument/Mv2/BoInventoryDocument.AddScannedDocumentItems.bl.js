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
 * @function addScannedDocumentItems
 * @this BoInventoryDocument
 * @async
 * @kind businessobject
 * @namespace CORE
 * @param {DomPKey} selectedProductId
 * @param {LiOrderItemMeta} itemTemplate
 * @param {DomSdoBarcodeScanBehavior} barcodeScanBehavior
 * @param {DomInteger} scanIncrementQuantity
 * @param {DomPrdLogisticUnit} uoM
 * @returns promise
 */
function addScannedDocumentItems(selectedProductId, itemTemplate, barcodeScanBehavior, scanIncrementQuantity,  uoM){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    var promise = when.resolve();
    var existingItems = me.getLoItemsMainList().getItemsByParam({
        "productId": selectedProductId,
        "orderItemTemplateId": itemTemplate.getPKey(),
        "uom": uoM
    });

    //Check if there exists an item with the same productId
    if (existingItems.length === 0) {
        var newOrderItemsList = [];
        var luProduct;


        //Load the product lookup to add the attributes in order item List item
        var jsonParams_Lookup_productInformation = [];
        var jsonQuery_productInformation = {};

        jsonParams_Lookup_productInformation.push({ "field": "pKey", "value": selectedProductId });
        jsonParams_Lookup_productInformation.push({ "field": "commitDate", "value": me.getOrderDate() });
        jsonQuery_productInformation.params = jsonParams_Lookup_productInformation;

        promise = BoFactory.loadObjectByParamsAsync("LuProduct", jsonQuery_productInformation).then(
            function (productObjectPromise) {

                luProduct = productObjectPromise;

                //Load UOMs asscoiated with Products
                var logisticUnitParams = [];
                var logisticUnitQuery = {};
                logisticUnitParams.push({"field": "ProductPKey", "value": selectedProductId});
                logisticUnitParams.push({"field": "LogisticCategory", "value": itemTemplate.getLogisticCategory()});
                logisticUnitQuery.params = logisticUnitParams;

                return BoFactory.loadListAsync("LoLogisticUnit", logisticUnitQuery);
            }
        ).then(function (logisticUnits) {

            //Sort so that the isOrderUnit = "1" is first in te list
            var items = logisticUnits.getAllItems(); 
            var currentOrderItemId;

            //create new order items out of logistic units
            for (var i = 0; i < items.length; i++) {
                var newOrderItem = me.getLoItemsMainList().createNewItem(me.getPKey(), luProduct, items[i], itemTemplate);

                //get main item (isOrderUnit = 1)
                if (items[i].getIsOrderUnit() == "1") {
                    currentOrderItemId = newOrderItem.pKey;
                }

                //set mainItem reference to handle invalidItem(Missing reason code flags)
                newOrderItem.mainItemReference = currentOrderItemId;

                newOrderItemsList.push(newOrderItem);
            }


            //add new order items to main list
            me.getLoItemsMainList().addItems(newOrderItemsList);

            //set current to visible mains item (isOrderUnit must be '1')
            me.getLoItemsMainList().setCurrentByPKey(currentOrderItemId);
            //Get Default UOM Order item to Update the Quantity
            var existingItems = me.getLoItemsMainList().getItemsByParam({
                "productId": selectedProductId,
                "orderItemTemplateId": itemTemplate.getPKey(),
                "uom": uoM
            });

            // increase the qty of the scanned item 
            // --> this item is not necessarily visible in main list because only the order unit item is visible
            var uomItemMainList = existingItems[0];
            if (barcodeScanBehavior === "SelectIncrease"){
                uomItemMainList.setQuantity(parseInt(uomItemMainList.getQuantity(), 10) + scanIncrementQuantity);
            }

        });
    } else {
        /** ###########################
         *  ##  Item already exists  ##
         *  ########################### */

        var uomItemMainList = existingItems[0];;
        var alreadySelected = false;
        if (me.getLoItemsMainList().getCurrent() != null && me.getLoItemsMainList().getCurrent().getProductId() == uomItemMainList.getProductId()) {
            alreadySelected = true;
        }

        if (!alreadySelected) {
            //set current to visible mains item (isOrderUnit must be '1')
            var mainItem = me.getLoItemsMainList().getItemsByParamArray(
                [
                    { 'productId': selectedProductId },
                    { 'isOrderUnit': '1' }
                ]
            )[0];
            me.getLoItemsMainList().setCurrentByPKey(mainItem.getPKey());
        }

        // increase the qty of the scanned item 
        // --> this item is not necessarily visible in main list because only the order unit item is visible
        if (barcodeScanBehavior === "SelectIncrease") {
            uomItemMainList.setQuantity(parseInt(uomItemMainList.getQuantity(), 10) + scanIncrementQuantity);
        }

        promise = when.resolve(alreadySelected);
    }
   
  
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}