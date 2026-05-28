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
 * @function beforeSaveAsync
 * @this BoTourData
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {Object} context
 * @returns promise
 */
function beforeSaveAsync(context){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    var tourStatus = me.getTourStatus();
    var tourOrigStatus = me.getTourOrigStatus();
    if(tourStatus == BLConstants.TOUR.STATUS_COMPLETED && tourOrigStatus!= BLConstants.TOUR.STATUS_COMPLETED) {
        if(me.getShouldAllowEndDayTimeTracking() == 1) {
            let ansiDateTime = Utils.createAnsiDateTimeNow();
            me.setActualEndDate(Utils.convertAnsiDateTime2AnsiDate(ansiDateTime));
            me.setActualEndTime(ansiDateTime.substring(11,16));
        }
    }
    
    var promise = Facade.saveObjectAsync(me).then(
        function() {
          var promises = [];
      
          if (Utils.isDefined(me.getVehicleInspectionTourCheckList())) {
            promises.push(me.getVehicleInspectionTourCheckList().saveAsync());
          }

          if (Utils.isDefined(me.getSafetyInspectionTourCheckList())) {
            promises.push(me.getSafetyInspectionTourCheckList().saveAsync());
          }
      
          return when.all(promises).then(
            function () {
              me.setObjectStatus(STATE.PERSISTED, true);
            }
          );
        }
      );
    
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}