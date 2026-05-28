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
 * @function getTourEndList
 * @this LoTourEnd
 * @kind listobject
 * @namespace CORE
 * @param {TourDataBo} tourDataBo
 * @param {Integer} checkinDocCount
 * @param {Integer} pendingCheckinDocCount
 * @param {DomBool} isMandatoryCheckinCompleted
 * @returns me
 * @description This method takes tour data as input and prepares a list of tasks to be displayed in the End Tour Activities card. Each task is assigned the correct status icon, indicating whether it is open or completed.
 */
function getTourEndList(tourDataBo, checkinDocCount, pendingCheckinDocCount, isMandatoryCheckinCompleted) {
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    var tourEndItemsList = [];
    me.removeAllItems();

    var vehicleDetails = {
      pKey: PKey.next(),
      activityName: Localization.resolve("CardTourStart_VehicleDetails"),
      activityId: "vehicleDetails",
      status: BLConstants.TOUR_ACTIVITY.OPEN,
    };

    var checkinInventory = {
      pKey: PKey.next(),
      activityName: Localization.resolve("CardTourEnd_CheckinInventory"),
      activityId: "checkinInventory",
      status: BLConstants.TOUR_ACTIVITY.OPEN,
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

    if (tourDataBo.endTourVehicleDetailsReviewed) {
      vehicleDetails.status = BLConstants.TOUR_ACTIVITY.COMPLETED;
    }

    if (
      checkinDocCount > 0 &&
      pendingCheckinDocCount === 0 &&
      isMandatoryCheckinCompleted
    ) {
        checkinInventory.status = BLConstants.TOUR_ACTIVITY.COMPLETED;
    }

    var vehicleInspectionCheck = tourDataBo.getVehicleInspectionTourCheckList();
    var safetyInspectionCheck = tourDataBo.getSafetyInspectionTourCheckList();

    if(Utils.isDefined(vehicleInspectionCheck)) {
      if(vehicleInspectionCheck.getItemsByParamArray([{usage: BLConstants.TOURCHECKUSAGE.END_DAY}]).length > 0) {
        tourEndItemsList.push(vehicleInspection);
        if(vehicleInspectionCheck.getItemsByParamArray([{usage: BLConstants.TOURCHECKUSAGE.END_DAY,"op" : "EQ" }, {answer : 0, "op" : "EQ"}]).length == 0) {
          vehicleInspection.status = BLConstants.TOUR_ACTIVITY.COMPLETED;
        }
      }
    }

    if(Utils.isDefined(safetyInspectionCheck)) {
      if(safetyInspectionCheck.getItemsByParamArray([{usage: BLConstants.TOURCHECKUSAGE.END_DAY}]).length > 0) {
        tourEndItemsList.push(safetyInspection);
        if(safetyInspectionCheck.getItemsByParamArray([{usage: BLConstants.TOURCHECKUSAGE.END_DAY,"op" : "EQ" }, {answer : 0, "op" : "EQ"}]).length == 0) {
          safetyInspection.status = BLConstants.TOUR_ACTIVITY.COMPLETED;
        }
      }
    }

    tourEndItemsList.push(vehicleDetails);
    tourEndItemsList.push(checkinInventory);

    me.addItems(tourEndItemsList);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}