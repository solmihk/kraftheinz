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
 * @function validateVehicleDetailEnd
 * @this BoTourData
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {Object} messageCollector
 * @description This method validates the vehicle details in the Review Vehicle Details of the End Tour Activities
 * @returns promise
 */
function validateVehicleDetailEnd(messageCollector){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    var jqueryParams = [];
    var jqueryQuery = {};
    jqueryParams.push({
    "field" : "tourPKey",
    "value" : me.getPKey()
    });
    jqueryQuery.params = jqueryParams;
    var promise = BoFactory.loadObjectByParamsAsync(LU_TOURVISITSCOUNT, jqueryQuery).then(function(luTourVisitsCount) {
        if(me.getStartTourActivitiesCompleted() != 0 && luTourVisitsCount.tourVisitsCount == 0){
            var considerMileage = me.getConsiderMileage();
            var considerVehicleStatus = me.getConsiderVehicleStatus();
            var odometerStart = me.getOdometerStart();
            var odometerEnd = me.getOdometerEnd();
            var vehicleOkEnd = me.getVehicleOkEnd();
            var vehicleStatusEnd = me.getVehicleStatusEnd();
    
            if (Utils.isDefined(considerMileage)) {
                considerMileage = considerMileage.toLowerCase();
            }
            if (Utils.isDefined(considerVehicleStatus)) {
                considerVehicleStatus = considerVehicleStatus.toLowerCase();
            }
    
            if (considerMileage === "yes") {
                if (odometerEnd == 0 || (odometerEnd < odometerStart)) {
                newError = {
                    level: "error",
                    objectClass: "BoTour",
                    messageID: "ValidateOdometerEnd",
                };
                messageCollector.add(newError);
                }
            }
    
            if (considerVehicleStatus.toLowerCase() === "statusreason" && vehicleOkEnd == "0") {
                if (Utils.isEmptyString(vehicleStatusEnd) || !Utils.isDefined(vehicleStatusEnd)) {
                newError = {
                    "level" : "error",
                    "objectClass" : "BoTour",
                    "messageID" : "ValidateVehicleStatusEnd"
                };
                messageCollector.add(newError);
                }
            }
    
            // Vehicle details are valid if there are no errors i.e. messageCollector store length is zero and either `Consider Vehicle Status` is `No` or Vehicle checks are okay.
            if (
                messageCollector.store.length == 0
            ) {
                me.setEndTourVehicleDetailsReviewed("1");
            } else {
                me.setEndTourVehicleDetailsReviewed("0");
            }
        }
    });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    return promise;
}
