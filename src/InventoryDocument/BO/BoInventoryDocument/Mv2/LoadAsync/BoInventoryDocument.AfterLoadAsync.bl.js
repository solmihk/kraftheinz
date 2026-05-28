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
 * @function afterLoadAsync
 * @this BoInventoryDocument
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {Object} result
 * @param {Object} context
 * @returns promise
 * @description Loads CheckIn/CheckOut documents.
 *  - Setting the Description Text using in the UI title
 *  - Handling of prepopulated items (via loadInventoryDocumentItems)
 *  - Calculation value of the order document
 */
function afterLoadAsync(result, context) {
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    if (Utils.isEmptyString(me.getDocumentType())) {
      me.setDocumentType(me.getBoOrderTemplate().getSdoSubType());
    }

    var promise = BoFactory.createObjectAsync(
        "BoHelperSimplePricingCalculator",
        {}
    ).then(function (calculator) {

        //Set pricing handler
        me.setSimplePricingCalculator(calculator);
    
        //loading main list (left side of UI screen)
        //This list is used for saving changes
        return me.loadInventoryDocumentItems();
    }).then(function () {
        //me.addItemChangedEventListener('loItemsMainList', me.onInventoryDocumentItemChanged);
        //will be replaced by generator ("modeler build"), so using new pattern 
        me.getLoItemsMainList().addItemChangedEventListener(me.onInventoryDocumentItemChanged, me, 'loItemsMainList');

        //loading detail list (right side of the UI screen)
        //this list is only used to show details in the UI
        //the main list and the item list is linked (see addWeakReferencedItems in function FillUnitOfMeasureList)
        //That weak linking means changes done in the detail list are synchronized with the main list
        //No need to load this list from DB because needed items are coppied over from main list
        return BoFactory.createListAsync(LO_INVENTORYDOCUMENTITEMS, {});
    }).then(function (loItemsUnitOfMeasureList) {
        loItemsUnitOfMeasureList.orderBy({ "sort": "ASC" });
        me.setLoItemsUnitOfMeasureList(loItemsUnitOfMeasureList);

        //set description used for UI title binding
        me.fillDescription();

        //EA Right handling
        me.setEARights();

        //calculate document
        return me.calculateInventoryDocumentValue();
    }).then(function () {
        me.setCalculationStatus("1");
        return when.resolve(me);
    });

    // Set InventoryReferenceIds
    me.setInventoryReferenceIds();

    // Set inventory search keys for item meta and payment metas
    me.getBoOrderTemplate().setIvcSearchKeysForItemMetas(
        me.getOrderAccountId(),
        me.getInventoryReference1Id(),
        me.getInventoryReference2Id(),
        me.getInventoryReference3Id(),
        me.getInventoryReference4Id(),
        me.getInventoryReference5Id()
    );

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}