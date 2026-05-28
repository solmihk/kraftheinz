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
 * @function buildQueryCondition
 * @this LoOrderItems
 * @kind listobject
 * @namespace CORE
 * @param {Object} jsonParams
 * @param {DomString} criterionFilterValue
 * @returns sqlParams
 * @description This function is used to determine all relevant filter for disposal list proposal
 * The returned sqlParams are used to select the relevant products from temp table TmpOrderItemMergeResult_T
 * --> see DsLoOrderItemsPrepopulation
 */
function buildQueryCondition(jsonParams, criterionFilterValue){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

  var mainItemTemplate;
  var disposalListProposal;
  var considerListing;
  var listing;
  var listingWithModules;
  var considerPromotion;
  var useBpaAssortment;
  var filterByBpaAssortment;
  var useSalesDocAssortment;
  var filterBySdoAssortment;
  var considerOutOfStock;
  var addHistoryItem;
  var criterionFilterAttribute = "";
  var itemListOption;
  var sdoSubType;
  var phase;
  var syncStatus;
  var considerInventory;
  var filterByCurrentInventory;
  var hitClosedListing;
  var collectClosedListing;
  var sdoMainPKey;
  var commitDate;
  var specialOrderHandling;
  var considerSelectablePromotion;
  var customerPKey;
  var callOutOfStockProducts;
  var hasFilterEnabled = false;

  var index = 0;
  for (index in jsonParams.params) {

    switch (jsonParams.params[index].field) {
      case "mainItemTemplate":
        mainItemTemplate = jsonParams.params[index].value;
        break;
      case "disposalListProposal":
        disposalListProposal = jsonParams.params[index].value;
        break;
      case "considerListing":
        considerListing = jsonParams.params[index].value;
        break;
      case "listing":
        listing = jsonParams.params[index].value;
        break;
      case "listingWithModules":
        listingWithModules = jsonParams.params[index].value;
        break;
      case "considerPromotion":
        considerPromotion = jsonParams.params[index].value;
        break;
      case "useBpaAssortment":
        useBpaAssortment = jsonParams.params[index].value;
        break;
      case "filterByBpaAssortment":
        filterByBpaAssortment = jsonParams.params[index].value;
        break;
      case "useSalesDocAssortment":
        useSalesDocAssortment = jsonParams.params[index].value;
        break;
      case "filterBySdoAssortment":
        filterBySdoAssortment = jsonParams.params[index].value;
        break;
      case "considerOutOfStock":
        considerOutOfStock = jsonParams.params[index].value;
        break;
      case "addHistoryItem":
        addHistoryItem = jsonParams.params[index].value;
        break;
      case "criterionFilterAttribute":
        criterionFilterAttribute = jsonParams.params[index].value;
        break;
      case "itemListOption":
        itemListOption = jsonParams.params[index].value;
        break;
      case "sdoSubType":
        sdoSubType = jsonParams.params[index].value;
        break;
      case "phase":
        phase = jsonParams.params[index].value;
        break;
      case "syncStatus":
        syncStatus = jsonParams.params[index].value;
        break;
      case "considerInventory":
        considerInventory = jsonParams.params[index].value;
        break;
      case "filterByCurrentInventory":
        filterByCurrentInventory = jsonParams.params[index].value;
        break;
      case "hitClosedListing":
        hitClosedListing = jsonParams.params[index].value;
        break;
      case "collectClosedListing":
        collectClosedListing = jsonParams.params[index].value;
        break;
      case "sdoMainPKey":
        sdoMainPKey = jsonParams.params[index].value;
        break;
      case "commitDate":
        commitDate = jsonParams.params[index].value;
        break;
      case "specialOrderHandling":
        specialOrderHandling = jsonParams.params[index].value;
        break;
      case "considerSelectablePromotion":
        considerSelectablePromotion = jsonParams.params[index].value;
        break;
      case "customerPKey":
        customerPKey = jsonParams.params[index].value;
        break;
      case "callOutOfStockProducts":
        callOutOfStockProducts = jsonParams.params[index].value;
        break;
    }
  }

  //Reset the filters when none of lists considered
  if ((considerListing === '0' &&
    addHistoryItem === '0' &&
    considerPromotion === '0' &&
    useBpaAssortment == '0' &&
    useSalesDocAssortment == '0' && 
    considerInventory == '0')) 
    {
      filterByCurrentInventory = '0';
      filterByBpaAssortment = '0';
      filterBySdoAssortment = '0';
  }

  // Result variable
  var queryCondition;
  //default persisted item condition which must be part of where condition but not part of mergeEngine_invalidated condition
  const PERSISTED_ITEM_CONDITION = " OR persistedProduct.IsPersistedItem = #presentDefault#"
  var invalid_Item_Condition;
  var isCollection = 'Collection';
  var isHit = 'Hit';
  var isNone = 'None';
  var presentDefault = '1';
  var jsonQuerySelectPromotion = {};
  var jsonQueryPersisted = {};
  var sdoMetaPosition;
  //Authorization list
  var cndAL = "";
  var cndALListing = "";
  var cndALListingWithModules = "";
  var cndALClosedListing = "";
  //Promotion
  var cndPrm = "";
  //Sales document assortment
  var cndSdo = "";
  var cndFilterBySdoAssortment = "";
  //Out of stock products
  var cndOos = "";
  //Historic products
  var cndHist = "";
  //Current Inventory
  var cndCI = "";
  var cndFilterByCurrentInventory = "";

  if (Utils.isDefined(mainItemTemplate)) {
    sdoMetaPosition = mainItemTemplate.getPrdProposalItemMetaPosition();
  }


  // ##########################
  // ### Delivery Documents ###
  // ##########################
  if ((sdoSubType == BLConstants.Order.DOCUMENT_TYPE_DELIVERY) && (disposalListProposal == "None")) {
    // Handle delivery document prepopulation - only persisted items are in the list
    queryCondition = " (persistedProduct.IsPersistedItem = #presentDefault#) ";
  }
  else {

    // #####################################
    // ### Normal disposal list proposal ###
    // #####################################

    // Show only persisted items for non editable orders
    if ((phase == BLConstants.Order.PHASE_RELEASED) || (phase == BLConstants.Order.PHASE_CANCELED) || (phase == BLConstants.Order.PHASE_READY) || (syncStatus == BLConstants.Order.NOT_SYNCABLE)) {
      queryCondition = " (persistedProduct.IsPersistedItem = #presentDefault#) ";
    }
    else {

      // ##########################
      // ### Authorization list ###
      // ##########################
      cndAL = "";
      cndALListing = "";
      cndALListingWithModules = "";
      cndALClosedListing = "";

      // ##########################
      // ### Consider Listing   ###
      // ##########################
      if (considerListing == 1) {

        if (listing == "Hit") {
          // LO_MEAUTHORIZATIONLIST_WITHOUT_MODULES
          cndALListing = "proposedProduct.Listing = #isHit#";
          cndALListingWithModules = "proposedProduct.ListingWithModules = #isNone#";
        }
        else {
          // LO_MEAUTHORIZATIONLIST
          cndALListing = "proposedProduct.Listing = #isNone#";
          cndALListingWithModules = "proposedProduct.ListingWithModules = #isHit#";
        }

        //closed listing
        if (hitClosedListing == 1 || collectClosedListing == 1) {
          if (mainItemTemplate.getUseClosedListing() == 1) {
            hasFilterEnabled = true;
            cndALClosedListing = "proposedProduct.Listed = #presentDefault#";
          }
        }

        if (!Utils.isEmptyString(cndALListing)) {
          cndAL = cndALListing;
        }

        if (!Utils.isEmptyString(cndALListingWithModules)) {
          if (!Utils.isEmptyString(cndAL)) {
            cndAL += " AND ";
          }

          cndAL += cndALListingWithModules;
        }
      }

      // ############################
      // ### Consider Promotion   ###
      // ############################
      cndPrm = "";

      if (considerPromotion == 1) {
        cndPrm = "proposedProduct.Promoted = #presentDefault#";
      }

      // ###################################
      // ### Sales document assortment   ###
      // ###################################
      cndSdo = "";
      cndFilterBySdoAssortment = "";

      if (useSalesDocAssortment == 1) {
        cndSdo = "proposedProduct.SdoAssortment = #presentDefault#";
      }

      if (filterBySdoAssortment == 1) {
        hasFilterEnabled = true;
        cndFilterBySdoAssortment = "proposedProduct.SdoAssortment = #presentDefault#";
      }

      // ##############################
      // ### Out of Stock Products  ###
      // ##############################
      cndOos = "";

      if (considerOutOfStock != "No") {
        cndOos = "proposedProduct.OutOfStock = #presentDefault#";
      }

      // ##########################
      // ### Historic products  ###
      // ##########################
      cndHist = "";

      if (addHistoryItem == 1) {
        cndHist = "proposedProduct.History = #presentDefault#";
      }

      // ##################
      // ### Inventory  ###
      // ##################
      if (considerInventory == 1) {
        cndCI = "proposedProduct.IsAvailableInventory = #presentDefault#";
      }
      if (filterByCurrentInventory == 1) {
        hasFilterEnabled = true;
        cndFilterByCurrentInventory = "proposedProduct.IsAvailableInventory = #presentDefault#";

      }

      // ##############################
      // ### Build Query Condition  ###
      // ##############################
      //Moved Historical/Promotional Products condition to align with the conditions when only one filter is on and either of them are on.
      queryCondition = "";

      //### Add historic items enabled  ###
      if (!Utils.isEmptyString(cndHist)) {
        queryCondition = "(" + cndHist + ")";
      }

      //### Consider Promotion enabled  ###
      if (!Utils.isEmptyString(cndPrm)) {
        if (Utils.isEmptyString(queryCondition)) {
          queryCondition = "(" + cndPrm + ")";
        }
        else {
          queryCondition += " OR (" + cndPrm + ")";
        }
      }

      //If authorization list is not closed, allow promoted products that are not contained in the listing => OR
      if ((Utils.isEmptyString(cndALClosedListing)) && (filterBySdoAssortment == "0") && (filterByCurrentInventory == "0")) {

        //No filtering at all
        if (!Utils.isEmptyString(cndAL)) {
          if (Utils.isEmptyString(queryCondition)) {
            queryCondition += " (" + cndAL + ")";
          }
          else {
            queryCondition += " OR (" + cndAL + ")";
          }
        }
        else {
          if (Utils.isEmptyString(queryCondition)) {
            queryCondition += "(1 = 0)";
          }
        }

        //Note: Query Condition cannot be empty for next 3 checks

        //### Use SdoAssortment enabled  ###
        if (!Utils.isEmptyString(cndSdo)) {
          queryCondition += " OR (" + cndSdo + ")";
        }

        //### Use out of stock enabled  ###
        if (!Utils.isEmptyString(cndOos)) {
          queryCondition += " OR (" + cndOos + ")";
        }

        //### Use inventory enabled  ###
        if (!Utils.isEmptyString(cndCI)) {
          queryCondition += " OR (" + cndCI + ")";
        }
      }
      else {
        // ########################################################################################
        // ###  Filter exists (e.g. closed listing, filter by SdoAssortment, CurrentInventory)  ###
        // ########################################################################################

        // #########################
        // ###  Listing enabled  ###
        // #########################
        if (!Utils.isEmptyString(cndAL)) {

          if (Utils.isEmptyString(queryCondition)) {
            queryCondition += "(" + cndAL + ")";
          }
          else {
            queryCondition += " OR (" + cndAL + ")";
          }

          //### Use SdoAssortment enabled  ###
          if (!Utils.isEmptyString(cndSdo)) {
            queryCondition += " OR (" + cndSdo + ")";
          }

          //### Consider Inventory enabled  ###
          if (!Utils.isEmptyString(cndCI)) {
            queryCondition += " OR (" + cndCI + ")";
          }

          // Wrap query condition in brackets
          queryCondition = "(" + queryCondition + ")";

          // #########################
          // ###  Adding  filters  ###
          // #########################

          // #########################################
          // ###  FilterBySalesDocumentAssortment  ###
          // #########################################

          //### Filter by SdoAssortment enabled ###
          if (!Utils.isEmptyString(cndFilterBySdoAssortment)) {
            hasFilterEnabled = true;
            queryCondition += " AND (" + cndFilterBySdoAssortment + ")";
          }

          // ##################################
          // ###  FilterByCurrentInventory  ###
          // ##################################

          //### Filter by inventory enabled ###
          if (!Utils.isEmptyString(cndFilterByCurrentInventory)) {
            hasFilterEnabled = true;
            queryCondition += " AND (" + cndFilterByCurrentInventory + ")";
          }

          // ########################
          // ###  Closed Listing  ###
          // ########################
          if (!Utils.isEmptyString(cndALClosedListing)) {
            hasFilterEnabled = true;
            queryCondition += " AND (" + cndALClosedListing + ")";
          }
        }
        else {
          // ##########################
          // ###  Listing disabled  ###
          // ##########################

          if (Utils.isEmptyString(queryCondition)) {
            if ((Utils.isEmptyString(cndSdo) && !Utils.isEmptyString(cndFilterBySdoAssortment)) || (!Utils.isEmptyString(cndSdo) && Utils.isEmptyString(cndFilterBySdoAssortment))) {
              queryCondition += "(1 = 0)";
            }
            else {
              queryCondition += "(1 = 1)";
            }
          }

          //### Use SdoAssortment enabled ###
          if (!Utils.isEmptyString(cndSdo)) {
            queryCondition += " OR (" + cndSdo + ")";
          }

          //### Consider Inventory enabled ###
          if (!Utils.isEmptyString(cndCI)) {
            queryCondition += " OR (" + cndCI + ")";
          }

          // Wrap query condition in brackets
          queryCondition = "(" + queryCondition + ")";

          // #########################
          // ###  Adding  filters  ###
          // #########################

          // #########################################
          // ###  FilterBySalesDocumentAssortment  ###
          // #########################################
          if (!Utils.isEmptyString(cndFilterBySdoAssortment)) {
            hasFilterEnabled = true;
            queryCondition += " AND (" + cndFilterBySdoAssortment + ")";
          }

          // ##################################
          // ###  FilterByCurrentInventory  ###
          // ##################################
          if (!Utils.isEmptyString(cndFilterByCurrentInventory)) {
            hasFilterEnabled = true;
            queryCondition += " AND (" + cndFilterByCurrentInventory + ")";
          }
        }
      }
      
      // Wrap query condition in brackets
      queryCondition = "(" + queryCondition + ")";

      // #####################################
      // ###  include the persisted Items  ###
      // #####################################
      queryCondition += PERSISTED_ITEM_CONDITION;

      // Wrap query condition in brackets
      queryCondition = "(" + queryCondition + ")";

      // Restriction of level in case of hierarchy
      // ###################################################
      // ###  Restriction of level in case of hierarchy  ###
      // ###       (needed for breadcrumb control)       ###
      // ###################################################
      if (itemListOption == "Hierarchy") {
        if (Utils.isDefined(criterionFilterAttribute) && Utils.isDefined(criterionFilterValue) && (criterionFilterValue != "ALL")) {
          queryCondition += " AND #criterionFilterAttribute# = #criterionFilterValue#";
        }
        else if (criterionFilterValue != "ALL") {
          queryCondition += " AND IsPersistedItem = #presentDefault#";
        }
      }

      // #######################################################################
      // ###                 Selectable Promotion                            ###
      // ###                                                                 ###
      // ### Persisted items that are invalid                                ###
      // ### NOTE: Invalidated items are returned (but without PrdMainPKey)  ### 
      // ### and are still handled by LoOrderItems.processInvalidatedItems() ###
      // #######################################################################
      if (considerSelectablePromotion == '1') {
        queryCondition += " OR selectablePromoted = #presentDefault# ";
      }
    }
  }

  
  // ##########################################################################################################################
  // ###                       Invalidate Items / MergeEngine_invalidated                                                   ###
  // ###                                                                                                                    ###
  // ### Persisted item condition must be removed. Otherwise all persisted order items are valid                            ###
  // ### Standard invalidations checks of Products (for example ProductState, Field/Delivery Availability, UOM checks)      ###
  // ### are done via DsLoMeProductInformation                                                                              ### 
  // ### With this condition additional checks like closed listing, sdoAssortmentFilter and inventoryFilter are handled)    ###
  // ### NOTE:                                                                                                              ###
  // ### If products are not part of the inital proposal list it does not necessarily mean that these products are invalid. ###
  // ### These products can be added manually. Only filters can invalidate items. If there is a item which is not part      ###
  // ### of the filter it is invalid.                                                                                       ###
  // ### --> Hence setting the invalid item condition only if at least one filter is enabled.                               ###
  // ##########################################################################################################################
  invalid_Item_Condition = queryCondition;
  if(!hasFilterEnabled){
    invalid_Item_Condition = '';
  }else{
    invalid_Item_Condition = invalid_Item_Condition.replace(PERSISTED_ITEM_CONDITION, "");
  }


  // ############################################
  // ###  Prepare Selectable Promotion params ###
  // ############################################
  jsonQuerySelectPromotion.params = [];
  jsonQuerySelectPromotion.params.push({ "field": "commitDate", "value": commitDate });
  jsonQuerySelectPromotion.params.push({ "field": "specialOrderHandling", "value": specialOrderHandling });
  jsonQuerySelectPromotion.params.push({ "field": "considerSelectablePromotion", "value": considerSelectablePromotion });
  jsonQuerySelectPromotion.params.push({ "field": "sdoMainPKey", "value": sdoMainPKey });
  jsonQuerySelectPromotion.params.push({ "field": "customerPKey", "value": customerPKey });
  //Order Items Query
  jsonQueryPersisted.params = [];
  jsonQueryPersisted.params.push({ "field": "sdoMainPKey", "value": sdoMainPKey });

  if (!Utils.isDefined(criterionFilterValue)) {
    criterionFilterValue = "";
  }

  // ###########################
  // ###  Prepare SQL Params ###
  // ###########################
  var sqlParams = [];
  sqlParams.push({
    "field": "queryCondition",
    "value": queryCondition
  });
  sqlParams.push({
    "field": "jsonQuerySelectPromotion",
    "value": jsonQuerySelectPromotion
  });
  sqlParams.push({
    "field": "jsonQueryPersisted",
    "value": jsonQueryPersisted
  });
  sqlParams.push({
    "field": "isCollection",
    "value": isCollection
  });
  sqlParams.push({
    "field": "isHit",
    "value": isHit
  });
  sqlParams.push({
    "field": "isNone",
    "value": isNone
  });
  sqlParams.push({
    "field": "sdoMetaPosition",
    "value": sdoMetaPosition
  });
  sqlParams.push({
    "field": "presentDefault",
    "value": presentDefault
  });
  sqlParams.push({
    "field": "criterionFilterAttribute",
    "value": criterionFilterAttribute
  });
  sqlParams.push({
    "field": "criterionFilterValue",
    "value": criterionFilterValue
  });
  sqlParams.push({
    "field": "sdoMainPKey",
    "value": sdoMainPKey
  });
  sqlParams.push({
    "field": "mainItemTemplate",
    "value": mainItemTemplate
  });
  sqlParams.push({
    "field": "callOutOfStockProducts",
    "value": callOutOfStockProducts
  });
  sqlParams.push({
    "field": "considerOutOfStock",
    "value": considerOutOfStock
  });
  sqlParams.push({
    "field": "invalidItemCondition",
    "value": invalid_Item_Condition
  });
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return sqlParams;
}