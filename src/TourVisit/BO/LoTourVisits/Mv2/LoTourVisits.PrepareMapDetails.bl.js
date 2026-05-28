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
 * @function prepareMapDetails
 * @this LoTourVisits
 * @kind listobject
 * @async
 * @param {String} visitPKey
 * @param {Integer} latitude
 * @param {Integer} longitude
 * @namespace CORE
 * @returns promise
 */
function prepareMapDetails(visitPKey, latitude, longitude) {
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    var mapDetails = BoFactory.instantiate("LuMapDetail");
    var distanceUnit = ApplicationContext.get('user').getDistanceUnit();
    var distance = 0;
    var jsonParams = [];
    var jsonQuery = {};
    var promise = when.resolve();
    var tourVisit;

    //add customer details
    if (Utils.isDefined(visitPKey)) {
        tourVisit = me.getItemByPKey(visitPKey);
        mapDetails.setPKey(tourVisit.getCustomerId());
        mapDetails.setName(tourVisit.getCustomerName());
        mapDetails.setMainAddress(tourVisit.getCustomerAddress());
    }

    //add distance
    if (!(latitude === 0 && longitude === 0)) {
        distance = Utils.distanceBetween(latitude, longitude, tourVisit.getLatitude(), tourVisit.getLongitude(), distanceUnit);
        distance = Utils.round(distance, 2, 1) + " " + distanceUnit;
        mapDetails.setDistance(distance);
    } else {
        mapDetails.setDistance(" ");
    }

    //add customer picture
    var addCond = "AND SF_File.Usage__c = 'Icon' ";
    jsonParams.push({ "field": "referencePKey", "value": mapDetails.getPKey() });
    jsonParams.push({ "field": "addCond", "value": addCond });
    jsonQuery.params = jsonParams;
  
    promise = BoFactory.loadObjectByParamsAsync("LoBpaAttachment", jsonQuery).then(
      function (loBpaAttachment) {
        if (Utils.isDefined(loBpaAttachment)) {
          if (loBpaAttachment.getCount() > 0) {
            var attachment = loBpaAttachment.getAllItems()[0];
            mapDetails.setCustomerProfilePicture(attachment.getMediaPath());
            mapDetails.setCustomerPictureFileType(attachment.getType());
          }
        }
        return mapDetails;
    });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
    return promise;
}