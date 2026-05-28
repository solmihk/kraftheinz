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
// NOTE:                                                                                     //
// - If you have created PRE and POST functions, they will be executed in the same order     //
//   as before.                                                                              //
// - If you have created a REPLACE to override core function, only the REPLACE function will //
//   be executed. PRE and POST functions will be executed in the same order as before.       //
//                                                                                           //
// - For new customizations, you can directly modify this file. There is no need to use the  //
//   PRE, POST, and REPLACE functions.                                                       //
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
 * -> module: Use CORE or CUSTOM. If you are a Salesforce client or an implementation partner, always use CUSTOM to enable a seamless release upgrade.
 * -> maxRuntime: Maximum time this function is allowed to run, takes integer value in ms. If the max time is exceeded, error is logged.
 * -> returns: Type and variable name in which the return value is stored.
 * @description This function would create a JSON query for LoItems based on parameters of BoOrder and BoOrderMeta
 * @function getJsonQueryForLoItems
 * @this BoOrder
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 * @returns orderItemsQuery
 */
function getJsonQueryForLoItems(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * This function is used to determine all relevant conditions to fill the temp table
     * The returned orderItemsQuery is used to insert relevant products (including flags, e.g. loisted, promoted) into temp table TmpOrderItemMergeResult_T
     * --> see DsOrderItemPreparation
     */
  
    var orderItemsParams = [];
    var orderItemsQuery = {};
  
    //### Order Attributes ####
    var sdoMainPKey = me.getPKey();
    var sdoMetaPKey = me.getSdoMetaPKey();
    var phase = me.getPhase();
    var syncStatus = me.getSyncStatus();
    var clbMainPKey = me.getClbMainPKey();
    var commitDate = me.getCommitDate();
    var customerPKey = me.getOrdererPKey();
    orderItemsParams.push({ "field": "sdoMainPKey", "value": sdoMainPKey });
    orderItemsParams.push({ "field": "sdoMetaPKey", "value": sdoMetaPKey });
    orderItemsParams.push({ "field": "phase", "value": phase });
    orderItemsParams.push({ "field": "syncStatus", "value": syncStatus });
    orderItemsParams.push({ "field": "clbMainPKey", "value": clbMainPKey });
    orderItemsParams.push({ "field": "commitDate", "value": commitDate });
    orderItemsParams.push({ "field": "customerPKey", "value": customerPKey });
    orderItemsParams.push({ "field": "disposalListProposal", "value": me.getBoOrderMeta().getDisposalListProposal() });

    //### Order Template Attributes ####
    var addHistoryItem = me.getBoOrderMeta().getAddHistoryItem();
    var listing = me.getBoOrderMeta().getListing();
    var itemListOption = me.getBoOrderMeta().getItemListOption();
    var allowForeignProducts = me.getBoOrderMeta().getAllowForeignProducts();
    var flatItemListGroupingAttribute = me.getBoOrderMeta().getCriterionAttributeForFlatList();
    var criterionFilterAttribute = me.getBoOrderMeta().getCriterionAttributeForLevel(me.getBoOrderMeta().getNumberOfHierarchyLevels());
    orderItemsParams.push({ "field": "addHistoryItem", "value": addHistoryItem });
    orderItemsParams.push({ "field": "listing", "value": listing });
    orderItemsParams.push({ "field": "itemListOption", "value": itemListOption });
    orderItemsParams.push({ "field": "allowForeignProducts", "value": allowForeignProducts });
    orderItemsParams.push({ "field": "mobilityRelevant", "value": me.getBoOrderMeta().getMobilityRelevant() });
    orderItemsParams.push({ "field": "sdoSubType", "value": me.getBoOrderMeta().getSdoSubType() });
    orderItemsParams.push({ "field": "specialOrderHandling", "value": me.getBoOrderMeta().getSpecialOrderHandling() });
    orderItemsParams.push({ "field": "listingWithModules", "value": me.getBoOrderMeta().getListingWithModules() });

    //### "Consider/Use" Flags ####
    var considerFieldState = me.getBoOrderMeta().getConsiderFieldStatus();
    var considerNewProducts = me.getBoOrderMeta().getConsiderNewProducts();
    var considerMaxHistoryDays = me.getBoOrderMeta().getConsiderMaxHistoryDays();
    var considerListing = me.getBoOrderMeta().getConsiderListing();
    var considerPromotion = me.getBoOrderMeta().getConsiderPromotion();
    var considerOutOfStock = me.getBoOrderMeta().getConsiderOutOfStock();
    var considerInventory = me.getBoOrderMeta().getConsiderInventory();
    var useSalesDocAssortment = me.getBoOrderMeta().getUseSalesDocAssortment();
    orderItemsParams.push({ "field": "considerFieldState", "value": considerFieldState });
    orderItemsParams.push({ "field": "considerNewProducts", "value": considerNewProducts });
    orderItemsParams.push({ "field": "considerMaxHistoryDays", "value": considerMaxHistoryDays });
    orderItemsParams.push({ "field": "considerListing", "value": considerListing });
    orderItemsParams.push({ "field": "considerPromotion", "value": considerPromotion });
    orderItemsParams.push({ "field": "considerOutOfStock", "value": considerOutOfStock });
    orderItemsParams.push({ "field": "considerInventory", "value": considerInventory });  
    orderItemsParams.push({ "field": "useSalesDocAssortment", "value": useSalesDocAssortment });
    orderItemsParams.push({ "field": "considerSelectablePromotion", "value": me.getBoOrderMeta().getConsiderSelectablePromotion() });
    orderItemsParams.push({ "field": "useBpaAssortment", "value": me.getBoOrderMeta().getUseBpaAssortment() });
  
    //### Date From Determination ####
    var dateFrom = Utils.addDays2AnsiDate(commitDate, considerMaxHistoryDays * (-1));
    orderItemsParams.push({ "field": "dateFrom", "value": dateFrom });

    //### "Filter" Flags ####
    var filterBySdoAssortment = me.getBoOrderMeta().getFilterBySdoAssortment();
    var filterByCurrentInventory = me.getBoOrderMeta().getFilterByCurrentInventory();
    orderItemsParams.push({ "field": "filterBySdoAssortment", "value": filterBySdoAssortment });
    orderItemsParams.push({ "field": "filterByCurrentInventory", "value": filterByCurrentInventory });
    orderItemsParams.push({ "field": "filterByBpaAssortment", "value": me.getBoOrderMeta().getFilterByBpaAssortment() });

    //### Closed Listing ####
    orderItemsParams.push({ "field": "hitClosedListing", "value": me.getLuOrderer().getHitClosedListing() });
    orderItemsParams.push({ "field": "collectClosedListing", "value": me.getLuOrderer().getCollectClosedListing() });

    //### Proposal List Flat vs. Hierarchy ####
    if (me.getBoOrderMeta().getItemListOption() == "Hierarchy") {
      orderItemsParams.push({ "field": "criterionFilterAttribute", "value": criterionFilterAttribute });
    }
    else {
      orderItemsParams.push({ "field": "flatItemListGroupingAttribute", "value": flatItemListGroupingAttribute });
    }
    
    //### Main Item Template Determination ####
    var mainItemTemplate;
    if (Utils.isDefined(me.getBoOrderMeta().getLoOrderItemMetas().getMainItemTemplate())) {
      mainItemTemplate = me.getBoOrderMeta().getLoOrderItemMetas().getMainItemTemplate();
      orderItemsParams.push({ "field": "mainItemTemplate", "value" : mainItemTemplate});
    }
    else {
      mainItemTemplate = me.getBoOrderMeta().getLoOrderItemMetas().getFirstItem();
      orderItemsParams.push({ "field": "mainItemTemplate", "value" : mainItemTemplate});
    }

    //### Visit - Out of Stock Products ####
    if (clbMainPKey == me.getCallInContext_clbMainPKey()) {
      orderItemsParams.push({ "field": "callOutOfStockProducts", "value": me.getCallOutOfStockProducts()});
    }
    
    // ### Hierarchy or Flat List ###
    var criterionAttribute;
    if (itemListOption == "Hierarchy") {
      criterionAttribute = criterionFilterAttribute;
      orderItemsParams.push({ "field": "criterionAttribute", "value": criterionFilterAttribute });
    }
    else {
      criterionAttribute = flatItemListGroupingAttribute;
      orderItemsParams.push({ "field": "criterionAttribute", "value": flatItemListGroupingAttribute });
    }
  
    //### Product - Additional Conditions ###
    var addCond_ProductState;
    var addCond_ForeignProduct = " ";
    var addCond_FieldState = " ";
    var addCond_NewState = " ";
  
    //### Product State ###
    addCond_ProductState = " Product2.State__c='4' ";
    orderItemsParams.push({ "field": "addCond_ProductState", "value": addCond_ProductState });
    if ((typeof allowForeignProducts != "undefined") && (allowForeignProducts != 1)) {
      addCond_ForeignProduct = " AND Product2.Competitive_Product__c = '0' ";
      orderItemsParams.push({ "field": "addCond_ForeignProduct", "value": addCond_ForeignProduct });
    }
  
    //### Field State ###
    if ((typeof considerFieldState != "undefined") && (considerFieldState == 1)) {
      addCond_FieldState = " AND (#compareAsDate('Product2.Field_Valid_From__c ', 'Date','<=',#TodayAsDate#, 'Date')#  AND #compareAsDate('Product2.Field_Valid_Thru__c', 'Date','>=',#TodayAsDate#, 'Date')#) ";
      orderItemsParams.push({ "field": "addCond_FieldState", "value": addCond_FieldState });
    }
  
    //### New State ###
    if ((typeof considerNewProducts != "undefined") && (considerNewProducts === 0)) {
      addCond_NewState = " AND (#compareAsDate('Product2.New_Item_Valid_From__c ', 'Date','<=',#TodayAsDate#, 'Date')#  AND #compareAsDate('Product2.New_Item_Valid_Thru__c', 'Date','>=',#TodayAsDate#, 'Date')# ) ";
      orderItemsParams.push({ "field": "addCond_NewState", "value": addCond_NewState });
    }
  
    // ################################
    // ### Prepare Query Parameters ###
    // ################################
    var jsonQueryProduct = {};
    jsonQueryProduct.params = [];
    jsonQueryProduct.params.push({"field" : "commitDate", "value" : commitDate});
    jsonQueryProduct.params.push({"field" : "criterionAttribute", "value" : criterionAttribute});
    jsonQueryProduct.params.push({"field" : "addCond_ProductState", "value" : addCond_ProductState});
    jsonQueryProduct.params.push({"field" : "addCond_FieldState", "value" : addCond_FieldState});
    jsonQueryProduct.params.push({"field" : "addCond_NewState", "value" : addCond_NewState});
    jsonQueryProduct.params.push({ "field": "addCond_ForeignProduct", "value": addCond_ForeignProduct });
  
    // ### Listing ###
    var jsonQueryListing = {};
    jsonQueryListing.params = [];
    jsonQueryListing.params.push({"field" : "customerPKey", "value" : customerPKey});
    
    // ### Listing With Modules ###
    var jsonQueryListingWithoutModules = {};
    jsonQueryListingWithoutModules.params = [];
    jsonQueryListingWithoutModules.params.push({"field" : "customerPKey", "value" : customerPKey});
    
    // ### Sales Document Assortment ###
    var jsonQuerySda = {};
    jsonQuerySda.params = [];
    jsonQuerySda.params.push({"field" : "sdoMetaPKey", "value" : sdoMetaPKey});
    jsonQuerySda.params.push({"field" : "commitDate", "value" : commitDate});
    
    // ### Promotion ###
    var jsonQueryPromotion = {};
    jsonQueryPromotion.params = [];
    jsonQueryPromotion.params.push({"field" : "customerPKey", "value" : customerPKey});
    
    // ### Historc Product ###
    var jsonQueryHistoric = {};
    jsonQueryHistoric.params = [];
    jsonQueryHistoric.params.push({"field" : "ordererPKey", "value" : customerPKey});
    jsonQueryHistoric.params.push({"field" : "dateFrom", "value" : dateFrom});
    jsonQueryHistoric.params.push({"field" : "sdoMetaPKey", "value" : sdoMetaPKey});
    
    // ### Out of Stock ###
    var jsonQueryOos = {};
    jsonQueryOos.params = [];
    jsonQueryOos.params.push({ "field": "clbMainPKey", "value": clbMainPKey });
  
    // ### Inventory ###
    // Fetching the inventory control template which is set to used for display in order item template.

    var inventoryTemplateUsedForDisplay;
    if (Utils.isDefined(me.getBoOrderMeta().getLoOrderItemMetas().getMainItemTemplate())) {
      inventoryTemplateUsedForDisplay = me.getBoOrderMeta().getIvcMetaByItemMeta_UsedForDisplay(mainItemTemplate.getPKey());
    }
    var inventoryTemplateId = '';
    var userId = '';
    var accountId = '';
    var tourId = '';
    var vehicleId = '';
  
    //Inventory search keys (IvcRefKeys) are already part of IvcMetaByItemMeta ... see BoOrderMeta.setIvcSearchKeysForItemMetas
    if (inventoryTemplateUsedForDisplay) {
      inventoryTemplateId = inventoryTemplateUsedForDisplay.getIvcMetaPKey();
      userId = inventoryTemplateUsedForDisplay.getUsrMainPKey();
      accountId = inventoryTemplateUsedForDisplay.getBpaMainPKey();
      tourId = inventoryTemplateUsedForDisplay.getTmgTourPKey();
      vehicleId = inventoryTemplateUsedForDisplay.getEtpVehiclePKey();
    }

    var jsonQueryInventory = {};
    jsonQueryInventory.params = [];
    jsonQueryInventory.params.push({ "field": "inventoryTemplateId", "value": inventoryTemplateId });
    jsonQueryInventory.params.push({ "field": "userId", "value": userId });
    jsonQueryInventory.params.push({ "field": "accountId", "value": accountId });
    jsonQueryInventory.params.push({ "field": "tourId", "value": tourId });
    jsonQueryInventory.params.push({ "field": "vehicleId", "value": vehicleId });
    
    // ##############################
    // ### Fetch SQL Statements   ###
    // ##############################
    var queryParams = [];
    var loadProductQuery = AppManager.getDataSource("LoMeProductInformation").getLoadStatement(jsonQueryProduct);
    var listingSqlQuery = AppManager.getDataSource("LoMeAuthorizationList").getLoadStatement(jsonQueryListing);
    var listingWithoutModulesSqlQuery = AppManager.getDataSource("LoMeAuthorizationListWithoutModules").getLoadStatement(jsonQueryListingWithoutModules);
    var sdaSqlQuery = AppManager.getDataSource("LoMeSdoAssortment").getLoadStatement( jsonQuerySda);
    var promotionSqlQuery = AppManager.getDataSource("LoMePromotion").getLoadStatement( jsonQueryPromotion);
    var historicSqlQuery = AppManager.getDataSource("LoMeHistoricProducts").getLoadStatement(jsonQueryHistoric);
    var oosSqlQuery = AppManager.getDataSource("LoMeOutOfStock").getLoadStatement( jsonQueryOos);
    var inventorySQLQuery = AppManager.getDataSource("LoMeTruckLoadItems").getLoadStatement(jsonQueryInventory);
  
    // #####################
    // ### Create Query  ###
    // #####################
    var productSqlQuery = "SELECT * FROM (" + loadProductQuery.sql + ") ";
    var query = "( " + productSqlQuery + ") AS product ";
    queryParams = queryParams.concat(loadProductQuery.params);
  
    if (considerListing == 1) {
      if (listing == "Hit") {
        query += "LEFT OUTER JOIN (" + listingWithoutModulesSqlQuery.sql + ") AS listing ON listing.prdMainPKey = product.pKey ";
        queryParams = queryParams.concat(listingWithoutModulesSqlQuery.params);
      }
      else {
        query += "LEFT OUTER JOIN (" + listingSqlQuery.sql + ") AS listing ON listing.prdMainPKey = product.pKey ";
        queryParams = queryParams.concat(listingSqlQuery.params);
      }
    }
    else {
      query += "LEFT OUTER JOIN (" + listingSqlQuery.sql + ") AS listing ON 1=0 ";
      queryParams = queryParams.concat(listingSqlQuery.params);
    }
  
    if (useSalesDocAssortment == 1 || filterBySdoAssortment == 1) {
      query += "LEFT OUTER JOIN (" + sdaSqlQuery.sql + ") AS sda ON sda.prdMainPKey = product.pKey ";
      queryParams = queryParams.concat(sdaSqlQuery.params);
    }
    else {
      query += "LEFT OUTER JOIN (" + sdaSqlQuery.sql + ") AS sda ON 1=0 ";
      queryParams = queryParams.concat(sdaSqlQuery.params);
    }
    if (considerPromotion == 1) {
      query += "LEFT OUTER JOIN (" + promotionSqlQuery.sql + ") AS promotion ON promotion.prdMainPKey = product.pKey ";
      queryParams = queryParams.concat(promotionSqlQuery.params);
    }
    else {
      query += "LEFT OUTER JOIN (" + promotionSqlQuery.sql + ") AS promotion ON 1=0 ";
      queryParams = queryParams.concat(promotionSqlQuery.params);
    }
    if (addHistoryItem == 1) {
      query += "LEFT OUTER JOIN (" + historicSqlQuery.sql + ") AS historic ON historic.prdMainPKey = product.pKey ";
      queryParams = queryParams.concat(historicSqlQuery.params);
    }
    else {
      query += "LEFT OUTER JOIN (" + historicSqlQuery.sql + ") AS historic ON 1=0 ";
      queryParams = queryParams.concat(historicSqlQuery.params);
    }
    if (considerOutOfStock != "No") {
      if (Utils.isDefined(clbMainPKey) && !(Utils.isEmptyString(clbMainPKey))) {
        query += "LEFT OUTER JOIN (" + oosSqlQuery.sql + ") AS oos ON oos.prdMainPKey = product.pKey ";
        queryParams = queryParams.concat(oosSqlQuery.params);
      }
      else {
        query += "LEFT OUTER JOIN (" + oosSqlQuery.sql + ") AS oos ON 1=0 ";
        queryParams = queryParams.concat(oosSqlQuery.params);
      }
    }
    else {
      query += "LEFT OUTER JOIN (" + oosSqlQuery.sql + ") AS oos ON 1=0 ";
      queryParams = queryParams.concat(oosSqlQuery.params);
    }

    if (considerInventory == "1" || filterByCurrentInventory) {
      query += "LEFT OUTER JOIN (" + inventorySQLQuery.sql + ") AS inventory ON inventory.prdId = product.pKey ";
      queryParams = queryParams.concat(inventorySQLQuery.params);

      // Invalid configuration
      if (!inventoryTemplateUsedForDisplay) {
        AppLog.error(
          "The 'considerInventory' or 'inventory filter' setting in the order template (PKey: " +
            me.getBoOrderMeta().getPKey() +
            ") is enabled. However, the inventory control template set to be used for display in the order item template (PKey: " +
            mainItemTemplate.getPKey() +
            ") is not present."
        );
      }
    } else {
      query += "LEFT OUTER JOIN (" + inventorySQLQuery.sql + ") AS inventory ON 1=0 ";
      queryParams = queryParams.concat(inventorySQLQuery.params);
    }
    orderItemsParams.push({ "field": "query", "value": query });
    orderItemsParams.push({ "field": "queryParams", "value": queryParams });
    
    //orderItemsParams are used to fill temptable and also to build the query to read from temp table (see BoOrder.BuildQueryCondition)
    orderItemsQuery.params = orderItemsParams;

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return orderItemsQuery;
}