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
 * @function filterSurveysByPos
 * @this BoJobManager
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 * @param {DomPKey} posId
 * @param {String} isPromotionFilterSet
 * @param {String} isDiscrepanciesFilterSet
 * @param {Object} boCall
 * @returns posId
 * @description Filters and loads survey products for a given Point of Sale (POS), applies promotion and discrepancy filters, 
 * sets visibility and editability of survey columns based on the current POS and call status, and updates the current survey products list in the BoJobManager. 
 * It also handles the initialization of survey products if they haven't been defined yet.
 */
function filterSurveysByPos(posId, isPromotionFilterSet, isDiscrepanciesFilterSet, boCall){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
  //read current POS
  var loCurrentPOS = me.getLoPOS().getItemsByParam({ "posId": posId });

  if (loCurrentPOS.length > 0) {
    var liCurrentPOS = loCurrentPOS[0];
    me.getLoPOS().setCurrent(liCurrentPOS);

    //get survey products of POS
    var loProducts = liCurrentPOS.getSurveyProducts();

    //survey products not yet defined
    if (!Utils.isDefined(loProducts)) {
      loProducts = BoFactory.instantiate(LO_JOBPRODUCTS);
      loProducts.setObjectStatus(STATE.PERSISTED);
      loProducts.setObjectStatusFrozen(true);
      loProducts.orderBy({
        "prdId": "ASC"
      });
      liCurrentPOS.setSurveyProducts(loProducts);

      // Filter surveyColumns based on measuretype
      // store ==> surveycolumns with measuretype store visible
      // Pos ==> surveyColumns with measureType POS visible

      //set promotion filter
      if (isPromotionFilterSet == "1") {
        loProducts.setFilter("planned", "1");
      }

      //set discrepancies filter
      if (isDiscrepanciesFilterSet == "1") {
        loProducts.setFilter("hasDiscrepance", "1");
      }

    }
    //survey products already defined
    else {
      loProducts.resetAllFilters();

      if (isDiscrepanciesFilterSet == "1") {
        loProducts.setFilter("hasDiscrepance", "1");
      }

      if (isPromotionFilterSet == "1") {
        loProducts.setFilter("planned", "1");
      }
    }

    //hide or lock survey columns 
    me.setEARightsOfSurveyColumns(posId, boCall, loProducts);

    if (loProducts.getCount() > 0) {
      loProducts.setCurrent(loProducts.getItems()[0]);
    }

    //set liCurrentSurveys to BoJobMAnager and add changedHandler if not already added
    me.setLoCurrentSurveyProducts(loProducts);
    if (loProducts.__itemChangedListener === null) {
      loProducts.addItemChangedEventListener(me.onSurveyChanged, me, 'loCurrentSurveyProducts');
    }
  }

  if (Utils.isDefined(boCall.getLoProductCategoryFilter())) {
    boCall.getLoProductCategoryFilter().onTabChange(boCall);
  }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return posId;
}