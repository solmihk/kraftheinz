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
 * @function setEARights
 * @this BoTourData
 * @kind businessobject
 * @namespace CORE
 * @param {String} invokedFrom
 * @param {Object} visitsList
 * @description This method sets the EARights for the Tour Details and tour checks based on the screen from which it is invoked
 */
function setEARights(invokedFrom, visitsList){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    
    var acl = me.getACL();
    var considerVehicleStatus = me.getConsiderVehicleStatus();

    if (Utils.isDefined(considerVehicleStatus)) {
      considerVehicleStatus = considerVehicleStatus.toLowerCase();
    }

    // Default invoked from for the Tour Process
    if (!Utils.isDefined(invokedFrom)) {
      invokedFrom = "ViewTourCard";
    }

    var pendingVisit = false;
    if (Utils.isDefined(visitsList)) {
      for (var visit of visitsList.getAllItems()) {  
        if (visit.getStatus() != BLConstants.VISIT.STATUS_COMPLETED) {
          pendingVisit = true;
          break;
        }
      }
    }

    if(me.getActualStartDate() === Utils.getMinDateAnsi()) {
      acl.removeRight(AclObjectType.PROPERTY, "actualStartDate", AclPermission.VISIBLE);
      acl.removeRight(AclObjectType.PROPERTY, "actualStartTime", AclPermission.VISIBLE);
    } else {
      acl.addRight(AclObjectType.PROPERTY, "actualStartDate", AclPermission.VISIBLE);
      acl.addRight(AclObjectType.PROPERTY, "actualStartTime", AclPermission.VISIBLE);
    } 
    if(me.getActualEndDate() === Utils.getMinDateAnsi()) {
        acl.removeRight(AclObjectType.PROPERTY, "actualEndDate", AclPermission.VISIBLE);
        acl.removeRight(AclObjectType.PROPERTY, "actualEndTime", AclPermission.VISIBLE);
    } else {
      acl.addRight(AclObjectType.PROPERTY, "actualEndDate", AclPermission.VISIBLE);
      acl.addRight(AclObjectType.PROPERTY, "actualEndTime", AclPermission.VISIBLE);
    }

    if (considerVehicleStatus == "no") {
      acl.removeRight(AclObjectType.PROPERTY, "vehicleOkStart", AclPermission.VISIBLE);
      acl.removeRight(AclObjectType.PROPERTY, "vehicleStatusStart", AclPermission.VISIBLE);
      acl.removeRight(AclObjectType.PROPERTY, "vehicleOkEnd", AclPermission.VISIBLE);
      acl.removeRight(AclObjectType.PROPERTY, "vehicleStatusEnd", AclPermission.VISIBLE);
    }
    
    var tourStatus = me.getTourStatus();
    const allFieldsForTour = [
      "startDate", "startTime", "endDate", "endTime",
      "actualStartDate", "actualStartTime", "actualEndDate", "actualEndTime",
      "luStartWarehouse", "luEndWarehouse", "luCoDriver",
      "luTruck", "luTrailer1", "luTrailer2", "odometerStart", "odometerEnd",
      "vehicleOkStart", "vehicleStatusStart", "vehicleOkEnd", "vehicleStatusEnd"
    ];
    const editableFieldsForTourStart = [
      "startDate", "startTime", "endDate", "endTime",
      "luStartWarehouse", "luEndWarehouse", "luCoDriver",
      "luTruck", "luTrailer1", "luTrailer2", "odometerStart",
      "vehicleOkStart", "vehicleStatusStart"
    ];
    const nonEditableFieldsForTourStart = [
      "actualStartDate", "actualStartTime", "actualEndDate", "actualEndTime",
      "odometerEnd",
      "vehicleOkEnd", "vehicleStatusEnd"
    ];
    const editableFieldsForTourEnd = [
      "endDate", "endTime",
      "luEndWarehouse",
      "odometerEnd",
      "vehicleOkEnd", "vehicleStatusEnd"
    ];
    const nonEditableFieldsForTourEnd = [
      "startDate", "startTime", 
      "actualStartDate", "actualStartTime", "actualEndDate", "actualEndTime",
      "luStartWarehouse", "luCoDriver",
      "luTruck", "luTrailer1", "luTrailer2", "odometerStart",
      "vehicleOkStart", "vehicleStatusStart"
    ];

    var editStartOfTheDayTourChecks = false;
    var editEndOfTheDayTourChecks = false;
    if (tourStatus === BLConstants.TOUR.STATUS_COMPLETED || tourStatus === BLConstants.TOUR.STATUS_CANCELLED) {
      acl.removeRight(AclObjectType.OBJECT, "BoTourData", AclPermission.EDIT);
      acl.removeRight(AclObjectType.OBJECT, "loTourTourChecks", AclPermission.EDIT);
    } else {
      acl.addRight(AclObjectType.OBJECT, "BoTourData", AclPermission.EDIT);
      acl.addRight(AclObjectType.OBJECT, "loTourTourChecks", AclPermission.EDIT);
      var editableFieldsForTourEndAndNonEditableFieldsForTourEnd = false;
      var editableFieldsForTourStartAndNonEditableFieldsForTourStart = false;
      var allFieldsNonEditable = false;
      if (tourStatus === BLConstants.TOUR.STATUS_INITIAL || tourStatus === BLConstants.TOUR.STATUS_OPEN) {
        allFieldsNonEditable = true;
        acl.removeRight(AclObjectType.OBJECT, "loTourTourChecks", AclPermission.EDIT);
      } else if (tourStatus === BLConstants.TOUR.STATUS_RUNNING) {
        if (invokedFrom === "ViewTourCard") {
          if (me.getStartTourActivitiesCompleted() == 0){
            editableFieldsForTourStartAndNonEditableFieldsForTourStart = true;
            editStartOfTheDayTourChecks = true;
          } else if (me.getEndTourVehicleDetailsReviewed() == 0 && !pendingVisit) {
            editEndOfTheDayTourChecks = true;
            if(me.getOdometerStart() >= me.getOdometerEnd()){
              me.setOdometerEnd(me.getOdometerStart());
            }
            editableFieldsForTourEndAndNonEditableFieldsForTourEnd = true;
          } else if (pendingVisit) {
            allFieldsNonEditable = true;
          }
          else {
            allFieldsNonEditable = true;
            editEndOfTheDayTourChecks = true;
          }
        } else if (invokedFrom === "StartTourCard") {
          if (me.getStartTourActivitiesCompleted() == 1 && !pendingVisit) {
            if(me.getOdometerStart() >= me.getOdometerEnd()){
              me.setOdometerEnd(me.getOdometerStart());
            }
            editableFieldsForTourEndAndNonEditableFieldsForTourEnd = true;
            editEndOfTheDayTourChecks = true;
          } else if (me.getStartTourActivitiesCompleted() == 0){
            editableFieldsForTourStartAndNonEditableFieldsForTourStart = true;
            editStartOfTheDayTourChecks = true;
          } else {
            allFieldsNonEditable = true;
          }
        } else if(invokedFrom === "EndTourCard") {
          if(me.getOdometerStart() >= me.getOdometerEnd()){
            me.setOdometerEnd(me.getOdometerStart());
          }
          editableFieldsForTourEndAndNonEditableFieldsForTourEnd = true;
          editEndOfTheDayTourChecks = true;
        }
      }

      if (editableFieldsForTourStartAndNonEditableFieldsForTourStart) {
        editableFieldsForTourStart.forEach(property => acl.addRight(AclObjectType.PROPERTY, property, AclPermission.EDIT));
        nonEditableFieldsForTourStart.forEach(property => acl.removeRight(AclObjectType.PROPERTY, property, AclPermission.EDIT));
        if (me.getLuTemplate().considerMultipleWarehouses == 0) {
          acl.removeRight(AclObjectType.PROPERTY, "luEndWarehouse", AclPermission.EDIT);
        }
      }

      if (editableFieldsForTourEndAndNonEditableFieldsForTourEnd) {
        editableFieldsForTourEnd.forEach(property => acl.addRight(AclObjectType.PROPERTY, property, AclPermission.EDIT));
        nonEditableFieldsForTourEnd.forEach(property => acl.removeRight(AclObjectType.PROPERTY, property, AclPermission.EDIT));
        if (me.getLuTemplate().considerMultipleWarehouses == 0) {
          acl.removeRight(AclObjectType.PROPERTY, "luEndWarehouse", AclPermission.EDIT);
        }
      }

      if (allFieldsNonEditable) {
        allFieldsForTour.forEach(property => acl.removeRight(AclObjectType.PROPERTY, property, AclPermission.EDIT));
      }

      var vehicleInspectionChecksList = me.getVehicleInspectionTourCheckList();
      var safetyInspectionChecksList = me.getSafetyInspectionTourCheckList();
      
      if(editStartOfTheDayTourChecks) {
        if(Utils.isDefined(vehicleInspectionChecksList)) {
         var items = vehicleInspectionChecksList.getItems();
          for(var i = 0; i < items.length; i++) {
            var currentVehicleInspectionChecksListItem = items[i];
            var aclRights = currentVehicleInspectionChecksListItem.getACL();
            if(currentVehicleInspectionChecksListItem.getUsage() == BLConstants.TOURCHECKUSAGE.END_DAY){
              aclRights.removeRight(AclObjectType.PROPERTY, "answer", AclPermission.EDIT);
            }
          }
        }
        
        if(Utils.isDefined(safetyInspectionChecksList)) {
          var items = safetyInspectionChecksList.getItems();
          for(var i = 0; i < items.length; i++) {
            var currentSafetyInspectionChecksListItem = items[i];
            var aclRights = currentSafetyInspectionChecksListItem.getACL();
            if(currentSafetyInspectionChecksListItem.getUsage() == BLConstants.TOURCHECKUSAGE.END_DAY){
              aclRights.removeRight(AclObjectType.PROPERTY, "answer", AclPermission.EDIT);
              
            }
          }
        }
      }
      if(editEndOfTheDayTourChecks) {
        if(Utils.isDefined(vehicleInspectionChecksList)) {
          var items = vehicleInspectionChecksList.getItems();
          for(var i = 0; i < items.length; i++) {
            var currentVehicleInspectionChecksListItem = items[i];
            var aclRights = currentVehicleInspectionChecksListItem.getACL();
            if(currentVehicleInspectionChecksListItem.getUsage() == BLConstants.TOURCHECKUSAGE.END_DAY){
              aclRights.addRight(AclObjectType.PROPERTY, "answer", AclPermission.EDIT);
            }
            if(currentVehicleInspectionChecksListItem.getUsage() == BLConstants.TOURCHECKUSAGE.START_DAY){
              aclRights.removeRight(AclObjectType.PROPERTY, "answer", AclPermission.EDIT);
            }
          }
        }
        if(Utils.isDefined(safetyInspectionChecksList)) {
          var items = safetyInspectionChecksList.getItems();
          for(var i = 0; i < items.length; i++) {
            var currentSafetyInspectionChecksListItem = items[i];
            var aclRights = currentSafetyInspectionChecksListItem.getACL();
            if(currentSafetyInspectionChecksListItem.getUsage() == BLConstants.TOURCHECKUSAGE.END_DAY){
              aclRights.addRight(AclObjectType.PROPERTY, "answer", AclPermission.EDIT);
            }
            if(currentSafetyInspectionChecksListItem.getUsage() == BLConstants.TOURCHECKUSAGE.START_DAY){
              aclRights.removeRight(AclObjectType.PROPERTY, "answer", AclPermission.EDIT);
            }
          }
        }
      }

      if(!editStartOfTheDayTourChecks && !editEndOfTheDayTourChecks) {
        if(Utils.isDefined(vehicleInspectionChecksList)) {
          var items = vehicleInspectionChecksList.getItems();
          for(var i = 0; i < items.length; i++) {
            var currentVehicleInspectionChecksListItem = items[i];
            var aclRights = currentVehicleInspectionChecksListItem.getACL();
            aclRights.removeRight(AclObjectType.PROPERTY, "answer", AclPermission.EDIT);
          }
        }
        if(Utils.isDefined(safetyInspectionChecksList)) {
          var items = safetyInspectionChecksList.getItems();
          for(var i = 0; i < items.length; i++) {
            var currentSafetyInspectionChecksListItem = items[i];
            var aclRights = currentSafetyInspectionChecksListItem.getACL();
            aclRights.removeRight(AclObjectType.PROPERTY, "answer", AclPermission.EDIT);
          }
        }
      }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}