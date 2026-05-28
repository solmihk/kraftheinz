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
 * @function validGeoLocationVisit
 * @this BoCall
 * @kind businessobject
 * @async
 * @namespace CORE
 * @description This method validates if Geo Location of the User is within the Geofence distance of the Store location at the Start and End of the Visit
 * @returns promise
 */
function validGeoLocationVisit(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    var messageCollector = new MessageCollector();
    var promise;
    var validateGeoLocationForVisit;
    var accountLatitude;
    var accountLongitude;
    var deviation;
    var newError;
    var distanceUnit;
    var geofenceDistance;
    var startVisit = false;
    var completeVisit = false;

    // Determine if DSD Mode is active
    var isDSDMode = ApplicationContext.get(BLConstants.APPCTX.DSD.DSDMODE) || false;

    // Default settings for Explicit Start Visits
    var isExplicitStartVisit = isDSDMode || me.getLuCallMeta().getIsStartVisitRqrToCheckIn() == "1";
    
    // If Explicit Start Visit, me.getClbStatus() = Planned (Visit to be Started) & (me.getClbStatus() != me.getOriginalClbStatus && me.getClbStatus() = "Completed") (Visit to be Completed)
    // Determine geolocation validation for the visit status
    if (isExplicitStartVisit && me.getClbStatus() === me.getOriginalClbStatus() && me.getClbStatus() === BLConstants.VISIT.STATUS_PLANNED) { // This means the visit is in the process to get started If Explicit Start Visit
        if (Utils.isDefined(me.getLuCallMeta().getStartVstGeolcValidation())) {
            validateGeoLocationForVisit = me.getLuCallMeta().getStartVstGeolcValidation();
            startVisit = true;
        }
    } else if (me.getClbStatus() != me.getOriginalClbStatus() && me.getClbStatus() === BLConstants.VISIT.STATUS_COMPLETED) { //  This means the visit is in the process to get completed independent of Explicit Start Visit
        if (Utils.isDefined(me.getLuCallMeta().getCmplVstGeolcValidation())) {
            validateGeoLocationForVisit = me.getLuCallMeta().getCmplVstGeolcValidation();
            completeVisit = true;
        }
    } 

    if(validateGeoLocationForVisit === "Error" || validateGeoLocationForVisit === "Warning"){
        promise = Utils.getCurrentPosition().then(function (position) {
            var isLocationAvailable = true;
            if (!Utils.isDefined(position)) {
                // User Location Not Available
                isLocationAvailable = false;
                AppLog.info("Validate Geo Location for the Visit - User Location is not defined");
            }

            if(!Utils.isDefined(me.getLuCustomer().getLatitude())){
                // Account Latitude Not Available
                isLocationAvailable = false;
                AppLog.info("Validate Geo Location for the Visit - Latitude of the Store is not defined");
            } else {
                accountLatitude = me.getLuCustomer().getLatitude();
            }

            if(!Utils.isDefined(me.getLuCustomer().getLongitude())){
                // Account Longitude Not Available
                isLocationAvailable = false;
                AppLog.info("Validate Geo Location for the Visit - Longitude of the Store is not defined");
            } else {
                accountLongitude = me.getLuCustomer().getLongitude();
            }

            if(!Utils.isDefined(ApplicationContext.get('user').getDistanceUnit())){
                // Distance Unit Not Available
                isLocationAvailable = false;
                AppLog.info("Validate Geo Location for the Visit - Distance Unit for the Sales Organization is not defined");
            } else {
                distanceUnit = ApplicationContext.get('user').getDistanceUnit();
            }

            if(!Utils.isDefined(ApplicationContext.get('user').getGeofenceDistance())){
                // Geofence Distance Not Available
                isLocationAvailable = false;
                AppLog.info("Validate Geo Location for the Visit - Geofence Distance for the Sales Organization is not defined");
            } else {
                geofenceDistance = ApplicationContext.get('user').getGeofenceDistance();
            }

            const isHardValidation = (validateGeoLocationForVisit === "Error" && isLocationAvailable);

            if(isLocationAvailable){
                AppLog.info("Validate Geo Location for the Visit - position - latitude :" + position.latitude);
                AppLog.info("Validate Geo Location for the Visit - position - longitude :" + position.longitude);
                AppLog.info("Validate Geo Location for the Visit - account - latitude :" + accountLatitude);
                AppLog.info("Validate Geo Location for the Visit - account - longitude :" + accountLongitude);
                AppLog.info("Validate Geo Location for the Visit - distanceUnit :" + distanceUnit);
                deviation = Utils.distanceBetween(position.latitude, position.longitude, accountLatitude, accountLongitude, distanceUnit);
                AppLog.info("Validate Geo Location for the Visit - deviation :" + deviation);
                AppLog.info("Validate Geo Location for the Visit - geofenceDistance :" + geofenceDistance);
                if(deviation > geofenceDistance){
                    if(isHardValidation){
                        newError = {
                            "level" : "error",
                            "objectClass" : "BoCall",
                            "messageID" : "CasClbCallsGeofenceValidation"
                        };
                    } else {
                        if (startVisit) {
                            newError = {
                                "level" : "error",
                                "objectClass" : "BoCall",
                                "messageID" : "CasClbCallsGeoLocationOutsideRangeVisitStart"
                            };
                        } else if (completeVisit) {
                            newError = {
                                "level" : "error",
                                "objectClass" : "BoCall",
                                "messageID" : "CasClbCallsGeoLocationOutsideRangeVisitComplete"
                            };
                        }
                    }
                    messageCollector.add(newError);
                }
            } else {
                if (startVisit) {
                    newError = {
                        "level" : "error",
                        "objectClass" : "BoCall",
                        "messageID" : "CasClbCallsGeoLocationNotAvailableVisitStart"
                    };
                } else if (completeVisit) {
                    newError = {
                        "level" : "error",
                        "objectClass" : "BoCall",
                        "messageID" : "CasClbCallsGeoLocationNotAvailableVisitComplete"
                    };
                }
                messageCollector.add(newError);
            }

            // If no Error messages, then valid Geo Location for the visit
            const hasMessages = messageCollector.getMessages().length > 0;
            if (!hasMessages) {
                return when.resolve("valid");
            }

            const validationMessages = messageCollector.getMessages().join("<br>");
            const buttonValues = {};
            if (isHardValidation) {
                buttonValues[Localization.resolve("Ok")] = "invalid";
            }
            if (!isHardValidation) {
                // Warn the User to proceed with Visit Start/Complete 
                buttonValues[Localization.resolve("Yes")] = "valid";
                buttonValues[Localization.resolve("No")] = "invalid";
            }
            return MessageBox.displayMessage(Localization.resolve("MessageBox_Title_Attention"), validationMessages, buttonValues).then(function(result){
                // If User accepts to proceed with Visit Start/Complete
                if(result === 'valid'){
                    if (startVisit) {
                        me.setIsVstStartOsidRange("1");
                    } else if (completeVisit) {
                        me.setIsVstCmplOsidRange("1");
                    }
                }
                return when.resolve(result);
            });
        });
    } else {
        promise = when.resolve("valid");
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}