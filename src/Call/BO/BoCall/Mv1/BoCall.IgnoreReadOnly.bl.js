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
 * @function ignoreReadOnly
 * @this BoCall
 * @kind businessobject
 * @namespace CORE
 * @returns ignoreReadOnly
 * @description In general "Planned" visits are editable.
 *  But if explicit visit start is enabled "Planned" visits are read only.
 *  There are some use cases like editing the visit not or rescheduling the visit which 
 *  should also be possible for "locked" explicit visit start vists. To check if this read only
 *  lock can be overwritten this function can be used.
 *  Overwrite read only must not be done in case lock exists e.g. because of substitution, 
 *  no management relation, not the responsible, no running tour in DSD case etc.
 * 
 */
function ignoreReadOnly(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    let ignoreReadOnly = false;
    let readOnlyInfo = me.getReadOnlyInfo();

    if (Utils.isDefined(readOnlyInfo) &&
        me.getClbStatus() === BLConstants.VISIT.STATUS_PLANNED &&
        readOnlyInfo.byCallStatus === true &&
        readOnlyInfo.byCustomerManagementInfo === false &&
        readOnlyInfo.byNotRunningTourInContext === false &&
        readOnlyInfo.byDSDVisitNotInProgress === false
    ) {
        ignoreReadOnly = true;
    }
    
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return ignoreReadOnly;
}