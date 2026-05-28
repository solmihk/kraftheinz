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
 * @function validateVehicleDetails
 * @this BoTourData
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {Object} messageCollector
 * @description This method validates the vehicle details in the Review Vehicle Details of the Start Tour Activities
 * @returns promise
 */
function validateVehicleDetails(messageCollector){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    var promise = when.resolve();
    if (
      me.getStartTourActivitiesCompleted() != 1 &&
      me.getTourStatus() === BLConstants.TOUR.STATUS_RUNNING
  ) {
      var startWarehouseId = me.getStartWarehouseId();
      var considerMileage = me.getConsiderMileage();
      var considerVehicle = me.getConsiderVehicle();
      var considerVehicleStatus = me.getConsiderVehicleStatus();
      var truckId = me.getTruckId();
      var trailer1Id = me.getTrailer1Id();
      var trailer2Id = me.getTrailer2Id();
      var odometerStart = me.getOdometerStart();
      var vehicleOkStart = me.getVehicleOkStart();
      var vehicleStatusStart = me.getVehicleStatusStart();

      if (Utils.isDefined(considerMileage)) {
        considerMileage = considerMileage.toLowerCase();
      }
      if (Utils.isDefined(considerVehicle)) {
        considerVehicle = considerVehicle.toLowerCase();
      }
      if (Utils.isDefined(considerVehicleStatus)) {
        considerVehicleStatus = considerVehicleStatus.toLowerCase();
      }

      if (considerMileage === "yes") {
        if (odometerStart == 0) {
          newError = {
            level: "error",
            objectClass: "BoTour",
            messageID: "ValidateOdometerStart",
          };
          messageCollector.add(newError);
        }
      }

      if (considerVehicleStatus.toLowerCase() === "statusreason" && vehicleOkStart == "0") {
        if (Utils.isEmptyString(vehicleStatusStart) || !Utils.isDefined(vehicleStatusStart)) {
          newError = {
            "level" : "error",
            "objectClass" : "BoTour",
            "messageID" : "ValidateVehicleStatusStart"
          };
          messageCollector.add(newError);
        }
      }

      function setVehicleDetailsReviewedValue() {
        // Vehicle details are valid if there are no errors i.e. messageCollector store length is zero and either `Consider Vehicle Status` is `No` or Vehicle checks are okay.
        if (
          messageCollector.store.length == 0 &&
          (considerVehicleStatus == "no" || vehicleOkStart == "1")
        ) {
          me.setVehicleDetailsReviewed("1");
        } else {
          me.setVehicleDetailsReviewed("0");
        }
      }

      if (considerVehicle !== "no") {
        var jqueryQuery = {};

        jqueryQuery.params = [
          {
            field: "warehouseId",
            value: startWarehouseId
          },
          {
            field: "vehicleTypes",
            value: ['TruckFast', 'TruckSlow', 'Trailer']
          },
        ];

        promise = BoFactory.loadListAsync(
          "LoVehicleByWarehouse",
          jqueryQuery
        ).then(function (vehicles) {
          var vehiclesList = Utils.isDefined(vehicles) ? vehicles.getAllItems() : [];
          var vehicleIdMap = {};

          for (var i = 0; i < vehiclesList.length; i++) {
            vehicleIdMap[vehiclesList[i].pKey] = true;
          }

          // TODO: Can we create a separate method and invoke it here to avoid duplicates.
          if (considerVehicle === "truck" || considerVehicle === "trucktrailer" || considerVehicle === "trucktrailers") {
            if (Utils.isEmptyString(truckId) || !Utils.isDefined(truckId) || !vehicleIdMap[truckId]) {
              newError = {
                "level" : "error",
                "objectClass" : "BoTour",
                "messageID" : "ValidateTruck"
              };
              messageCollector.add(newError);
            }
          }

          if (considerVehicle === "trucktrailer" || considerVehicle === "trucktrailers") {
            if (Utils.isEmptyString(trailer1Id) || !Utils.isDefined(trailer1Id) || !vehicleIdMap[trailer1Id]) {
              newError = {
                "level" : "error",
                "objectClass" : "BoTour",
                "messageID" : "ValidateTrailer"
              };
              messageCollector.add(newError);
            }
          }

          if (considerVehicle === "trucktrailers") {
            if (Utils.isEmptyString(trailer2Id) || !Utils.isDefined(trailer2Id) || !vehicleIdMap[trailer2Id]) {
              newError = {
                "level" : "error",
                "objectClass" : "BoTour",
                "messageID" : "ValidateTrailer"
              };
              messageCollector.add(newError);
            }
          }

          if(Utils.isDefined(trailer2Id) && Utils.isDefined(trailer1Id) &&
          !Utils.isEmptyString(trailer2Id) && !Utils.isEmptyString(trailer1Id) && trailer1Id === trailer2Id) {
            newError = {
              "level" : "error",
              "objectClass" : "BoTour",
              "messageID" : "Trailer1_Trailer2_Same_Validation"
            };
            messageCollector.add(newError);
          }

          setVehicleDetailsReviewedValue();
        });
      } else {
        setVehicleDetailsReviewedValue();
      }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}