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
 * @function validateWarehouseAndDriver
 * @this BoTourData
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {Object} messageCollector
 * @description This method validates the if the Co-Driver is part of the Start and End Warehouse of the Tour.
 * @returns promise
 */
function validateWarehouseAndDriver(messageCollector) {
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    var promise = when.resolve();
    var warehouseId;
    var startWarehouseId = me.getStartWarehouseId();
    var endWarehouseId = me.getEndWarehouseId();
    var coDriverUserId = me.getCoDriverUserId();
    var isStartWarehouseValid =
      Utils.isDefined(startWarehouseId) && !Utils.isEmptyString(startWarehouseId);
    var isEndWarehouseValid =
      Utils.isDefined(endWarehouseId) && !Utils.isEmptyString(endWarehouseId);
    var isCoDriverValid =
      Utils.isDefined(coDriverUserId) && !Utils.isEmptyString(coDriverUserId);
    
    if(me.getStartTourActivitiesCompleted() === 0){
      if (me.getLuTemplate().considerMultipleWarehouses === 0) {
        if (isStartWarehouseValid) {
          warehouseId = startWarehouseId;
          promise = validateWarehouseCoDriver(warehouseId);
        }
      } else {
        if (isStartWarehouseValid) {
          warehouseId = startWarehouseId;
          promise = validateWarehouseCoDriver(warehouseId);
        }
        if (isEndWarehouseValid) {
          warehouseId = endWarehouseId;
          promise = validateWarehouseCoDriver(warehouseId);
        }
      }
    } else {
      if (me.getLuTemplate().considerMultipleWarehouses === 1) {
        if (isEndWarehouseValid) {
          warehouseId = endWarehouseId;
          promise = validateWarehouseCoDriver(warehouseId);
        }
      }
    }

    function validateWarehouseCoDriver (warehouseId) {
      var promise = when.resolve();
      if (isCoDriverValid) {
        var jqueryQuery = {};

        jqueryQuery.params = [
          {
            field: "warehouseId",
            value: warehouseId,
          },
          {
            field: "coDriverUserId",
            value: coDriverUserId,
          },
        ];

        promise = BoFactory.loadObjectByParamsAsync(
          "LuTourWarehouseAndCoDriver",
          jqueryQuery
        ).then(function (warehouseUser) {
          var isValid =
            Utils.isDefined(warehouseUser) &&
            Utils.isDefined(warehouseUser.pKey);

          if (!isValid) {
            newError = {
              level: "error",
              objectClass: "BoTour",
              messageID: "ValidateWarehouseAndCoDriver",
            };
            messageCollector.add(newError);
          }
        });
      }
      return promise;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////


}
