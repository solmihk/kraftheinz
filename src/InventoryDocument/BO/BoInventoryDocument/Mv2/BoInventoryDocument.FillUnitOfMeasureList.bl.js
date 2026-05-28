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
 * @function fillUnitOfMeasureList
 * @this BoInventoryDocument
 * @kind businessobject
 * @namespace CORE
 * @param {DomPKey} productId
 * @param {String} defaultUom
 * @param {DomPKey} orderItemTemplateId
 * @description Function is filling the UoM list for selected main item
 *  Weak linked lists are used --> means changes between both lists are synced by framework
 * If defaultUom is given set focus to defaultUom otherwise select first item
 */
function fillUnitOfMeasureList(productId, defaultUom, orderItemTemplateId){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

  let firstItemId;
  let fitlerArray = [
    { "productId": productId, "op": "EQ" }
  ];

  //For CheckOut Doc there exist only one order item template
  //But for CheckIn Docs can exist multiple if multiple invetories must be checked in with one doc
  if (!Utils.isEmptyString(orderItemTemplateId)) {
    fitlerArray.push({ "orderItemTemplateId": orderItemTemplateId, "op": "EQ" });
  }

  //relevant main items which should be visible in detail list
  var mainListItemsByProductId = me.getLoItemsMainList().getItemsByParamArray(fitlerArray);

  if (mainListItemsByProductId.length > 0) {
    //sort items according to sort attribute coming frmo uom sort field
    function sortItems(a, b) {
      const aSort = a.sort;
      const bSort = b.sort;

      if (aSort > bSort) {
        return 1;
      } else if (bSort > aSort) {
        return -1;
      } else {
        return 0;
      }
    }
    mainListItemsByProductId.sort(sortItems);

    let selectedItem;
    me.getLoItemsMainList().suspendListRefresh();
    mainListItemsByProductId.forEach(item => {
      if (Utils.isEmptyString(selectedItem) && item.isOrderUnit == "1") {
        firstItemId = item.getPKey();
      }
      // If a uom item in detail list is invalid the main list item is also marked as invalid
      //  - main list shows only one item because uoms are combined
      //  - uom detail list is showing all items in detail
      // if we link visible item from main list to Uom detail list it might be that the main item is flaged as invalid because a uom not equals isOrderUnit is invalid
      // --> in that case the invalid icon must be removed
      if (
        me.isModReasonRequired() &&
        (item.getQuantityDifferenceInformation() == 0) ||
        !Utils.isEmptyString(item.getModificationReason())
      ) {
        //Remove invalid flag visible in the detail list
        item.setIconModReason(BLConstants.DefaultImages.EMPTY_IMAGE);
        item.setMissingModReason('0');
      }
    });
    me.getLoItemsMainList().resumeListRefresh(true);

    //clear UoM list
    var unitOfMeasureList = me.getLoItemsUnitOfMeasureList();
    unitOfMeasureList.removeAllItems();

    //weak link between main items and detail items
    unitOfMeasureList.addWeakReferencedItems(mainListItemsByProductId);

    //get default UoM item
    var defaultUomId;
    if (!Utils.isEmptyString(defaultUom)) {
      defaultUomId = me.getLoItemsMainList().getItemsByParam({
        "productId": productId,
        "uom": defaultUom
      });
    }

    //set current to first item to get focus in UI
    if (Utils.isEmptyString(defaultUom) || Utils.isEmptyString(defaultUomId[0]))
      unitOfMeasureList.setCurrentByPKey(firstItemId);
    else
      unitOfMeasureList.setCurrentByPKey(defaultUomId[0].getPKey());
  }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////


}