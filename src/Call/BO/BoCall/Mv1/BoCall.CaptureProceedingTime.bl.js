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
 * @function captureProceedingTime
 * @this BoCall
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 * @param {String} CallComplete
 * @param {DomBool} isDSDMode
 * @returns true
 */
function captureProceedingTime(CallComplete, isDSDMode){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
// CallComplete = true -> Execution of this method is during cancellation / completion of call

if (me.getLuCallMeta().getCaptureProceedingTime() == "1") {
  if (CallComplete === "true") {
    if (me.getClbStatus() === BLConstants.VISIT.STATUS_ABANDONED) {
      me.setBeginTime(Utils.createAnsiDateTimeNow());
      me.setFinishTime(Utils.createAnsiDateTimeNow());
    } else {
      me.setFinishTime(Utils.createAnsiDateTimeNow());
      me.setStopTimeEffective(Utils.createAnsiDateTimeNow());
      me.setStopTimeEffectiveTimezoneOffset(Utils.createDateNow().getTimezoneOffset());
    }
  } else {
    if (me.getClbStatus() === BLConstants.VISIT.STATUS_PLANNED && !isDSDMode) {
      me.setBeginTime(Utils.createAnsiDateTimeNow());
    }
  }
  // if ActualStartDateTime/StartTimeEffective & ActualEndDateTime/StopTimeEffective is equal, 
  // and ActualEndDateTime is not minDate/1700-01-01 00:00:00,
  // add 1 second to ActualEndDateTime to avoid sync issue
  // adding the check of DSD mode because in DSD mode we have dedicated start and end visit button.
  if(Utils.isDefined(me.getStartTimeEffective()) && 
    Utils.isDefined(me.getStopTimeEffective()) && 
    me.getStartTimeEffective() === me.getStopTimeEffective() && 
    !isDSDMode && 
    me.getStopTimeEffective() !== Utils.getMinDate()) 
  {
    var stopTimeEffective = Utils.convertAnsiDate2Date(me.getStopTimeEffective());
    stopTimeEffective.setSeconds(stopTimeEffective.getSeconds()+1);
    me.setStopTimeEffective(Utils.convertDateTime2Ansi(stopTimeEffective));

    // NOTE: Never calculate offset of minDate/1700-01-01 00:00:00
    // Modern date - standardized timezone
    // new Date('2024-01-01 00:00:00').getTimezoneOffset() // -60 (CET is UTC+1)
    // ------------------------------------------------------------
    // Historical date - local mean time
    // new Date('1700-01-01 00:00:00').getTimezoneOffset() // -53 (LMT was UTC+0:53)
    me.setStopTimeEffectiveTimezoneOffset(Utils.createDateNow().getTimezoneOffset());
  }
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return true;
}