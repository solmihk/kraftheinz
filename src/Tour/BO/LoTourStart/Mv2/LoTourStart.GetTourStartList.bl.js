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
 * @function getTourStartList
 * @this LoTourStart
 * @kind listobject
 * @namespace CORE
 * @param {TourDataBo} tourDataBo
 * @param {DomInteger} checkOutDocCount
 * @param {DomInteger} checkOutPendingDocCount
 * @returns me
 */
function getTourStartList(tourDataBo, checkOutDocCount, checkOutPendingDocCount){
    var me = this;
    

    
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    
    
    var tourStartItemList = [];
    me.removeAllItems();

    var vehicleDetails = {
      "pKey": PKey.next(),
      "activityName" : Localization.resolve("CardTourStart_VehicleDetails"),
      "activityId": 'vehicleDetails',
      "status" : BLConstants.TOUR_ACTIVITY.OPEN,
      "mandatory" : (tourDataBo.considerVehicleStatus == 'No' && ( tourDataBo.considerMileage == 'No' || tourDataBo.considerMileage == 'Optional')) ? 'No' : 'Yes'
    };

    var checkoutInventory = {
      "pKey": PKey.next(),
      "activityName" : Localization.resolve("CardTourStart_CheckoutInventory"),
      "activityId": 'checkoutInventory',
      "status" : BLConstants.TOUR_ACTIVITY.OPEN,
      "mandatory" : 'Yes'
    };

    var vehicleInspection = {
      "pKey": PKey.next(),
      "activityName" : Localization.resolve("CardTourStart_InspectVehicle"),
      "activityId": 'vehicleInspection',
      "status" : BLConstants.TOUR_ACTIVITY.OPEN,
      "mandatory" : 'Yes'
    };

    var safetyInspection = {
      "pKey": PKey.next(),
      "activityName" : Localization.resolve("CardTourStart_ConductSafetyChecks"),
      "activityId": 'safetyInspection',
      "status" : BLConstants.TOUR_ACTIVITY.OPEN,
      "mandatory" : 'Yes'
    };

    if (tourDataBo.vehicleDetailsReviewed) {
      vehicleDetails.status = BLConstants.TOUR_ACTIVITY.COMPLETED;
    }

    tourStartItemList.push(vehicleDetails);

    if (checkOutDocCount > 0) {
      if (checkOutPendingDocCount == 0) {
        checkoutInventory.status = BLConstants.TOUR_ACTIVITY.COMPLETED;
      }
      tourStartItemList.push(checkoutInventory);
    }

    var vehicleInspectionCheckList = tourDataBo.getVehicleInspectionTourCheckList();
    var safetyInspectionCheckList = tourDataBo.getSafetyInspectionTourCheckList();

    if(Utils.isDefined(vehicleInspectionCheckList)) {
      if(vehicleInspectionCheckList.getItemsByParamArray([{usage: BLConstants.TOURCHECKUSAGE.START_DAY}]).length > 0) {
        tourStartItemList.push(vehicleInspection);
        if(vehicleInspectionCheckList.getItemsByParamArray([{usage: BLConstants.TOURCHECKUSAGE.START_DAY,"op" : "EQ" }, {answer : 0, "op" : "EQ"}]).length == 0) {
          vehicleInspection.status = BLConstants.TOUR_ACTIVITY.COMPLETED;
        }
      }
    }

    if(Utils.isDefined(safetyInspectionCheckList)) {
      if(safetyInspectionCheckList.getItemsByParamArray([{usage: BLConstants.TOURCHECKUSAGE.START_DAY}]).length > 0) {
        tourStartItemList.push(safetyInspection);
        if(safetyInspectionCheckList.getItemsByParamArray([{usage: BLConstants.TOURCHECKUSAGE.START_DAY,"op" : "EQ" }, {answer : 0, "op" : "EQ"}]).length == 0) {
          safetyInspection.status = BLConstants.TOUR_ACTIVITY.COMPLETED;
        }
      }
    }

    me.addItems(tourStartItemList);

   
  
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}
