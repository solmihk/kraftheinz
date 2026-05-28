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
 * @function isReadOnly
 * @this BoCall
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 * @param {DomString} isDSDMode
 * @returns isCallReadOnly
 * @description Function is checking if the visit is read only. 
 *  The visit is read only if:
 *    - Status is in "Completed" or "Abandoned"
 *    - Status is "Planned" and explicit visit start is enabled
 *    - Responsible is not manager of the visit account
 *    - Substitution is running
 *    - In DSD --> A tour is on context which is NOT running
 *    - In DSD --> Status is not "InProgress"
 *  This function is used across the complete App to lock visits and visit related features like Questions, Surveys ...
 *  There is another function called BoCall.ignoreReadOnly which can be used to unlock specific features for visit which are read only (by this function) 
 *  but which ore only locked because of the status (readOnlyInfo.byCallStatus = true) and which are in Status "Planned".
 *  This is needed for explicit start visits (explicit start flag in visit template) for example to enable re-schedule and note editing in "Planned" state 
 */
function isReadOnly(isDSDMode) {
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    //Fallback if DSD Mode is not handed over
    if (!Utils.isDefined(isDSDMode)) {
        isDSDMode = ApplicationContext.get(BLConstants.APPCTX.DSD.DSDMODE);
    } else {
        if (isDSDMode == "true" || isDSDMode == "1") {
            isDSDMode = true;
        } else {
            isDSDMode = false;
        }
    }
    
    var callStatus = false;
    var readOnlyInfo = {
        "byCallStatus" : false,
        "byCustomerManagementInfo" : false,
        "byNotRunningTourInContext" : false,
        "byDSDVisitNotInProgress" : false,
    };

    if (me.getClbStatus() === BLConstants.VISIT.STATUS_COMPLETED || 
        me.getClbStatus() === BLConstants.VISIT.STATUS_ABANDONED) {
        callStatus = true;
        readOnlyInfo.byCallStatus = callStatus;
    }

    //if explicit start visit is enabled visit must be read only if status is "Planned"
    if (!isDSDMode &&  me.getLuCallMeta().getIsStartVisitRqrToCheckIn() == '1') {
        callStatus = callStatus || me.getClbStatus() === BLConstants.VISIT.STATUS_PLANNED;
        readOnlyInfo.byCallStatus = callStatus;
    }

    var customerManagementInfo = (me.getReadOnlyBySubstitution() == "1" || (!Utils.isEmptyString(me.getBpaMainPKey()) && me.getLuCustomerManagementInfo().getIsSubstituted() == "0" && me.getResponsiblePKey() !== me.getLuCustomerManagementInfo().getReferenceUsrMainPKey()));

    if (me.getReadOnlyBySubstitution() == "1" || (!Utils.isEmptyString(me.getBpaMainPKey()) && me.getLuCustomerManagementInfo().getIsSubstituted() == "0" && me.getResponsiblePKey() !== me.getLuCustomerManagementInfo().getReferenceUsrMainPKey())) {
        readOnlyInfo.byCustomerManagementInfo = true;
    }

    // DSD --> read only if current tour in context but not running
    var notRunningTourInContext = false;
    if (
        (ApplicationContext.get(BLConstants.APPCTX.DSD.DSDMODE) || isDSDMode) &&
        Utils.isEmptyString(ApplicationContext.get(BLConstants.APPCTX.DSD.RUNNING_TOUR))
    ) {
        notRunningTourInContext = true;
        readOnlyInfo.byNotRunningTourInContext = true;
    }

    // DSD --> visit is only editable if status is in progress
    var dsdVisitNotInProgress = false;
    if (ApplicationContext.get(BLConstants.APPCTX.DSD.DSDMODE) || isDSDMode) {
        dsdVisitNotInProgress = me.getClbStatus() !== BLConstants.VISIT.STATUS_INPROGRESS;
        readOnlyInfo.byDSDVisitNotInProgress = dsdVisitNotInProgress;
    }

    me.setReadOnlyInfo(readOnlyInfo);

    var isCallReadOnly = (callStatus || customerManagementInfo || notRunningTourInContext || dsdVisitNotInProgress);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return isCallReadOnly;
}