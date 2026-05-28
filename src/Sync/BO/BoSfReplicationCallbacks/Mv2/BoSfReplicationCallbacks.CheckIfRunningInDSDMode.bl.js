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
 * @function checkIfRunningInDSDMode
 * @this BoSfReplicationCallbacks
 * @kind businessobject
 * @async
 * @namespace CORE
 * @returns promise
 * @deprecated
 * @description This function is used to check if app is running in DSD-Mode. 
 *  If user has TourUser role the app is running in DSD Mode.
 *  There is also a flag (BLConstants.APPCTX.DSD.DSDMODE / "runningInDSDMode") available in Application Context which can be used to check this.
 *  BUT this Application Context flag is not yet available which sync handling. It is set when app UI opens (what is at later point in time).
 */
function checkIfRunningInDSDMode() {
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    var promise = when.resolve();
    var runningInDSDMode = false;

    //fetch statement from datasource
    var dataSource = AppManager.getDataSourceByDataSourceName("DsBoSfReplicationCallbacks");
    var statement = dataSource.getCustomStatement("AssignedRole")({ userId: Facade.getSfUserId() });

    promise = Facade.executeQueries([statement]).then(
        function (result) {

            if (result.length > 0) {
                var assignedRoles = [];
                result[0].forEach(element => assignedRoles.push(element.usrRoleId));
                if (assignedRoles.includes('TourUser')) {
                    runningInDSDMode = true;
                }
            } 
            return when.resolve(runningInDSDMode);
        }
    );

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}