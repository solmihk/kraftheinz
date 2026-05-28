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
 * @function setInventoryReferenceIds
 * @this BoInventoryDocument
 * @kind businessobject
 * @namespace CORE
 * @description Sets inventory reference IDs based on the configuration from the order template, supporting different reference types like DefaultUsr, ActualUsr, Tour, and Vehicle.
 */
function setInventoryReferenceIds(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * In this method, we will set the inventory reference Id's. We read the configuration from order template and set the corresponding Id's.
     */
    var EMPTY_STRING = " ";
    var currentUserId = ApplicationContext.get("user").getPKey();
    var tourId = me.getTourId();
    var vehicleId = me.getTruckId();

    function getInventoryReferenceValue(inventoryReferenceUsage) {
      if (inventoryReferenceUsage == "DefaultUsr") {
        AppLog.error("Setting a default user value for the inventory reference field is not a supported configuration in the order template.");
        return EMPTY_STRING;
      } else if (inventoryReferenceUsage == "ActualUsr") {
        return currentUserId;
      } else if (inventoryReferenceUsage == "Tour") {
        return tourId;
      } else if (inventoryReferenceUsage == "Vehicle") {
        return vehicleId;
      }

      return EMPTY_STRING;
    }

    var inventoryReference1Usage = me.getBoOrderTemplate().getIvcRefPKey1Usage();
    var inventoryReference2Usage = me.getBoOrderTemplate().getIvcRefPKey2Usage();
    var inventoryReference3Usage = me.getBoOrderTemplate().getIvcRefPKey3Usage();
    var inventoryReference4Usage = me.getBoOrderTemplate().getIvcRefPKey4Usage();
    var inventoryReference5Usage = me.getBoOrderTemplate().getIvcRefPKey5Usage();

    me.setInventoryReference1Id(
      getInventoryReferenceValue(inventoryReference1Usage)
    );
    me.setInventoryReference2Id(
      getInventoryReferenceValue(inventoryReference2Usage)
    );
    me.setInventoryReference3Id(
      getInventoryReferenceValue(inventoryReference3Usage)
    );
    me.setInventoryReference4Id(
      getInventoryReferenceValue(inventoryReference4Usage)
    );
    me.setInventoryReference5Id(
      getInventoryReferenceValue(inventoryReference5Usage)
    );

    me.endEdit();

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
  }