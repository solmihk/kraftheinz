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
 * @function createNewItem
 * @this LoInventoryDocumentItems
 * @kind listobject
 * @param {String} orderId
 * @param {LuProduct} luProduct
 * @param {LiLogisticUnit} liLogisticUnit
 * @param {LiOrderItemMeta} orderItemTemplate
 * @namespace CORE
 * @returns liInventoryDocumentItem
 */
function createNewItem(orderId, luProduct, liLogisticUnit, orderItemTemplate ){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Function to create a new list items out of given product, logistic unit and order item template informations
     * Used for adding products via button and via scanning
     */
    
    var selectionBoxList = Utils.getToggleListObject("PrdLogisticUnit", [liLogisticUnit.getUnitType()]);
    
    var liInventoryDocumentItem = {
        "pKey": PKey.next(),
        "uom": selectionBoxList.getAllItems()[0].getCode(),
        "quantity": 0,
        "targetQuantity": 0,
        "productId": luProduct.getPrdId(),
        "price": 0,
        "priceReceipt": 0,
        "value": 0,
        "valueReceipt": 0,
        "grossValueReceipt": 0,
        "orderItemTemplateId": orderItemTemplate.getPKey(),
        "description1": luProduct.getText1(),
        "shortDescription": luProduct.getShortText(),
        "gtin": luProduct.getEAN(),
        "consumerGoodsProductCode": luProduct.getGroupId(),
        "productType": luProduct.getPrdType(),
        "criterion3ProductDescription": luProduct.getCriterion3ProductDescription(),
        "sort": liLogisticUnit.getSort(),
        "isOrderUnit": liLogisticUnit.getIsOrderUnit(),
        "groupSort": liLogisticUnit.getSort(),
        "referenceId": luProduct.getPrdId() + orderItemTemplate.getPKey(),
        "orderId": orderId,
        "priceEffect": orderItemTemplate.getPriceEffect(),
        "piecesPerSmallestUnit": luProduct.getPiecesPerSmallestUnit(),
        "piecesPerSmallestUnitForBasePrice": luProduct.getPiecesPerSmallestUnitForBasePrice(),
        "simplePricingBasePrice": luProduct.getSimplePricingBasePrice(),
        "objectStatus": STATE.NEW
    };
		
   
  
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}