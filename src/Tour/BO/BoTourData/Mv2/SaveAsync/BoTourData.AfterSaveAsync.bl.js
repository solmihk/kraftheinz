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
 * @function afterSaveAsync
 * @this BoTourData
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {Object} result
 * @param {Object} context
 * @returns promise
 */
function afterSaveAsync(result, context){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    
    var promise=when.resolve(result);
		
    var tourStatus = me.getTourStatus();
    var tourOrigStatus = me.getTourOrigStatus();
    if (tourStatus != tourOrigStatus) {
      me.setObjectStatusFrozen(true);
      me.setTourOrigStatus(tourStatus);
      me.setObjectStatusFrozen(false);
    }
    var startTourActivitiesCompleted = me.getStartTourActivitiesCompleted();
    var originalStartTourActivitiesCompleted = me.getOriginalStartTourActivitiesCompleted();
    if (startTourActivitiesCompleted != originalStartTourActivitiesCompleted) {
      me.setObjectStatusFrozen(true);
      me.setOriginalStartTourActivitiesCompleted(startTourActivitiesCompleted);
      me.setObjectStatusFrozen(false);
    }
    var syncOptions = me.getLuTemplate().getSyncOptions();
    
    if (tourStatus == BLConstants.TOUR.STATUS_COMPLETED && tourOrigStatus != BLConstants.TOUR.STATUS_COMPLETED && (syncOptions === "OnTourEnd" || syncOptions === "OnTourEndStart")) {
      Facade.startBackgroundReplication();
      //Reset object status for all to prevent multiple saves
      me.setObjectStatus(STATE.PERSISTED, true);
    } else if((startTourActivitiesCompleted == "1" && originalStartTourActivitiesCompleted != "1") && (syncOptions === "OnTourStart" || syncOptions === "OnTourEndStart")){ 
      //To trigger auto sync when "Activities Completed" of "Start Tour Activities" card is clicked
      Facade.startBackgroundReplication();
      //Reset object status for all to prevent multiple saves
      me.setObjectStatus(STATE.PERSISTED, true);
    }
  
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}