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
 * @function loadInventoryDocumentItems
 * @this BoInventoryDocument
 * @kind businessobject
 * @async
 * @namespace CORE
 * @returns promise
 * @description Loads order items for checkOut/checkIn documents
 */
function loadInventoryDocumentItems(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    var promise = when.resolve(me);

    //####################
    //## ProductCheckIn ##
    //####################
    if (me.getDocumentType() === BLConstants.Order.DOCUMENT_TYPE_PRODUCT_CHECK_IN) {

        let inventoryCheckInItems;

        //########################################
        //## load check in items from inventory ##
        //########################################
        var fetchCheckInItemsPromise = !([BLConstants.Order.PHASE_RELEASED, BLConstants.Order.PHASE_READY].includes(me.getPhase())) ? me.fetchCheckInItems() : when.resolve([]);
        
        promise = fetchCheckInItemsPromise.then(
            function (resultFetchCheckInItems) {
                inventoryCheckInItems = resultFetchCheckInItems;

                //######################################
                //## load the persisted checkin items ##
                //######################################
                let dataSource = AppManager.getDataSourceByDataSourceName("DsLoInventoryDocumentItems");
                let statementPersistedCheckInItems = dataSource.getCustomStatement("CheckIn_PersistedItems")({
                    commitDate: me.getOrderDate(),
                    orderId: me.getPKey()
                });

                return Facade.executeQueries([statementPersistedCheckInItems]);
            }).then(function (persistedCheckInItems) {

                //###########################
                //## create main item list ##
                //###########################
                return BoFactory.createListAsync(LO_INVENTORYDOCUMENTITEMS, {}).then(
                    function (loItemsMainList) {
                        me.setLoItemsMainList(loItemsMainList);
                        return me.populateCheckInItems(inventoryCheckInItems, persistedCheckInItems[0]);
                    }
                );
            });
    }

    //#####################
    //## ProductCheckOut ##
    //#####################
    else if (me.getDocumentType() === BLConstants.Order.DOCUMENT_TYPE_PRODUCT_CHECK_OUT) {
        
        var jqueryParams = [];

        var jqueryQuery = {};
        jqueryParams.push({
            "field": "commitDate",
            "value": me.getOrderDate()
        });

        jqueryParams.push({
            "field": "orderId",
            "value": me.getPKey()
        });

        jqueryQuery.params = jqueryParams;

        //for product checkout just execeute the load statement
        promise = BoFactory.loadListAsync(LO_INVENTORYDOCUMENTITEMS, jqueryQuery).then(
            function (loItemsMainList) {
                me.setLoItemsMainList(loItemsMainList);
                return me.populateCheckOutItems();
            });
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}