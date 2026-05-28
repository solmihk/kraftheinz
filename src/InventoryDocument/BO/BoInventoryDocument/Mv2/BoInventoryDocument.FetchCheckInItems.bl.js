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
 * @function fetchCheckInItems
 * @this BoInventoryDocument
 * @kind businessobject
 * @async
 * @namespace CORE
 * @returns promise
 * @description Selects the inventory based on the order template inventory configuration and created checkIn order items out of the inventory balances
 */
function fetchCheckInItems() {
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    var promise = when.resolve([[]]);


    //Check inventory meta setup - Every order item template must have one inventory meta having usedForDisplay = "1"
    let inventoryMetaItems = me.getBoOrderTemplate().getLoInventoryMetaByItemMeta().getAllItems();
    var dicFaultyOrderItemTemplates = Utils.createDictionary();

    inventoryMetaItems.forEach((inventoryMetaItem) => {
      if(!dicFaultyOrderItemTemplates.containsKey(inventoryMetaItem.sdoItemMetaPKey)){
        dicFaultyOrderItemTemplates.add(inventoryMetaItem.sdoItemMetaPKey);
      }
      if(inventoryMetaItem.usedForDisplay == "1"){
        dicFaultyOrderItemTemplates.remove(inventoryMetaItem.sdoItemMetaPKey);
      }
    });
    dicFaultyOrderItemTemplates.keys().forEach((sdoItemMetaPKey) => {
      AppLog.error("Product-CheckIn: No order item inventory transaction template set to 'used for display' for order item template with 'ID: " +  sdoItemMetaPKey +"'. Please check the configuration of the order template with 'ID: " +  me.getBoOrderTemplate().getPKey() +"'.");
    });

  
    //Read inventory template configuration for order item templates
    //Only consider inventory configuration flagged as "usedForDisplay"
    let inventoryMetas = me.getBoOrderTemplate().getLoInventoryMetaByItemMeta().getItemsByParamArray([
      { "usedForDisplay": "1", "op": "EQ" }
    ]);

    if (inventoryMetas.length > 0) {
      //fetch datasource
      let dataSource = AppManager.getDataSourceByDataSourceName  ("DsLoInventoryDocumentItems");
  
      //holds params and SQLs of different inventories
      let overallParams = [];
      let overallSQLs = [];
  
      //Create SQL Snippets for all the inventory configurations
      inventoryMetas.forEach((inventoryMeta) => {
  
        let orderItemTemplatePriceEffect = me.getBoOrderTemplate().  getLoOrderItemMetas().getItemByPKey(inventoryMeta.getSdoItemMetaPKey()).  getPriceEffect();
        let orderItemTemplateShortText = me.getBoOrderTemplate().getLoOrderItemMetas().  getItemByPKey(inventoryMeta.getSdoItemMetaPKey()).getShortText();
        let orderItemTemplateText = me.getBoOrderTemplate().getLoOrderItemMetas().  getItemByPKey(inventoryMeta.getSdoItemMetaPKey()).getText();
  
        let statement = dataSource.getCustomStatement("CheckIn_InventoryEntries")({
          orderItemTemplateText: orderItemTemplateText,
          orderItemTemplateShortText: orderItemTemplateShortText,
          orderItemTemplatePriceEffect: orderItemTemplatePriceEffect,
          orderItemTemplateId: inventoryMeta.getSdoItemMetaPKey(),
          inventoryTemplateId: inventoryMeta.getIvcMetaPKey(),
          userId: inventoryMeta.getUsrMainPKey(),
          accountId: inventoryMeta.getBpaMainPKey(),
          tourId: inventoryMeta.getTmgTourPKey(),
          vehicleId: inventoryMeta.getEtpVehiclePKey()
        });
  
        overallSQLs = overallSQLs.concat(statement.sql);
        overallParams = overallParams.concat(statement.params);
      });
  
      //create finalStatement
      let finalInventoryItemsSQL = overallSQLs.join(' UNION ALL ');
  
      //Handover Inventory SQL Snippets to create final check in inventory   statement
      let statementCheckInItems = dataSource.getCustomStatement("CheckIn_Prepopulation")({
        params: overallParams,
        finalInventoryItemsSQL: finalInventoryItemsSQL,
        commitDate: me.getOrderDate()
      });
  
      //Finally execute the statement
      promise = Facade.executeQueries([statementCheckInItems]).then(
        function (resultsCheckInItems) {
          return when.resolve(resultsCheckInItems[0]);
        }
      );
    }else{
      AppLog.error("Product-CheckIn: No order item inventory transaction template set to 'used for display'. Please check the configuration of the order template with 'ID: " +  me.getBoOrderTemplate().getPKey() +"'.");
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

  return promise;
}