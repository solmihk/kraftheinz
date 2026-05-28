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
 * @this BoTourData
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {Object} result
 * @param {Object} context
 * @returns promise
 */
function afterLoadAsync(result, context){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    
    me.setEARights();
    me.setTourOrigStatus(me.getTourStatus());
    me.setOriginalStartTourActivitiesCompleted(me.getStartTourActivitiesCompleted());
    ApplicationContext.set(BLConstants.APPCTX.DSD.CURRENT_TOUR_ID, me.getPKey());
    var user = ApplicationContext.get("user");

    // Set the current tour in application context if the tour is loaded
    // This is used in 3 places :
    // 1. in setIvcRefPKeys for inventory
    // 2. BoSysReleaseProcess.CreateAttrMappingProductCheckOut.bl.js for Signature process
    // 3. BoInventoryDocument.AfterCreateAsync.bl.js
    
    var lu = BoFactory.instantiate("LuTourData", {
      pKey: me.getPKey(),
      dateFrom: me.getStartDate(),
      dateThru: me.getEndDate(),
      tmgMetaPKey: me.getTourTemplateId(),
      startEtpWarehousePKey: me.getStartWarehouseId(),
      endEtpWarehousePKey: me.getEndWarehouseId(),
      etpVehicleTruckPKey: me.getTruckId(),
      id: me.getPKey(),
      name: me.getTourName(),
      considerMultipleWarehouses: me
        .getLuTemplate()
        .getConsiderMultipleWarehouses(),
      defaultEtpVehicleTruckPKey: me.getTruckId(),
      driverName: user.getLastName() + ", " + user.getFirstName(),
    });

    ApplicationContext.set(BLConstants.APPCTX.DSD.CURRENT_TOUR, lu);

    var vehicleCheckJqueryQuery = {};
    vehicleCheckJqueryQuery.params = [{field: "tourId",value: me.getPKey()},{field: "checkType",value: BLConstants.TOURCHECKTYPE.VEHICLECHECK }];

    var promise = BoFactory.loadListAsync(LO_TOURTOURCHECK,vehicleCheckJqueryQuery).then(function (vehicleInspectionTourCheckList) {
      me.setVehicleInspectionTourCheckList(vehicleInspectionTourCheckList);
      if (Utils.isDefined(vehicleInspectionTourCheckList)) {
          let items = vehicleInspectionTourCheckList.getAllItems();
          for (let i = 0; i < items.length; i++) {
              if (items[i].getUsage() === BLConstants.TOURCHECKUSAGE.START_DAY) {
                  items[i].setGroupUsage(Localization.resolve("TourTourDetailsUI_StartDayVehicleChecksId"));
              } else if (items[i].getUsage() === BLConstants.TOURCHECKUSAGE.END_DAY) {
                  items[i].setGroupUsage(Localization.resolve("TourTourDetailsUI_EndDayVehicleChecksId"));
              }
          }
          vehicleInspectionTourCheckList.orderBy({"sort" : "ASC"});
      }
      var safetyCheckJqueryQuery = {};
      safetyCheckJqueryQuery.params = [{field: "tourId",value: me.getPKey()},{field: "checkType",value: BLConstants.TOURCHECKTYPE.SAFETYCHECK}];
        return BoFactory.loadListAsync(LO_TOURTOURCHECK,safetyCheckJqueryQuery);
    }).then(function (safetyInspectionTourCheckList) {
      me.setSafetyInspectionTourCheckList(safetyInspectionTourCheckList);
      
      if (Utils.isDefined(safetyInspectionTourCheckList)) {
          let items = safetyInspectionTourCheckList.getAllItems();
          for (let i = 0; i < items.length; i++) {
              if (items[i].getUsage() === BLConstants.TOURCHECKUSAGE.START_DAY) {
                  items[i].setGroupUsage(Localization.resolve("TourTourDetailsUI_StartDaySafetyChecksId"));
              } else if (items[i].getUsage() === BLConstants.TOURCHECKUSAGE.END_DAY) {
                  items[i].setGroupUsage(Localization.resolve("TourTourDetailsUI_EndDaySafetyChecksId"));
              }
          }
          safetyInspectionTourCheckList.orderBy({"sort" : "ASC"});
      }
      return when.resolve(me);
    });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
