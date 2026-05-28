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
 * @function mergeProperties
 * @this BoTourData
 * @kind businessobject
 * @param {BoTourData} boTourData
 * @namespace CORE
 * @description Merges a defined list of properties from a BoTourData to current BoTourData
 * This is needed for Vehicle Details Screens. For this screen a new BoTourData is loaded.
 * When closing this vehicle details UI the properties must be merged into the BoTourData 
 * used for the tour cockpit because logic is executed which is using this properties for example
 * to set status Icons in Start/End Tour activitied card.
 */
function mergeProperties(boTourData){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    if(Utils.isDefined(boTourData)){
        me.setStartDate(boTourData.getStartDate());
        me.setStartTime(boTourData.getStartTime());
        me.setEndDate(boTourData.getEndDate());
        me.setEndTime(boTourData.getEndTime());
        me.setOdometerStart(boTourData.getOdometerStart());
        me.setOdometerEnd(boTourData.getOdometerEnd());
        me.setVehicleOkStart(boTourData.getVehicleOkStart());
        me.setVehicleStatusStart(boTourData.getVehicleStatusStart());
        me.setVehicleOkEnd(boTourData.getVehicleOkEnd());
        me.setVehicleStatusEnd(boTourData.getVehicleStatusEnd());
        me.setVehicleDetailsReviewed(boTourData.getVehicleDetailsReviewed());
        me.setEndTourVehicleDetailsReviewed(boTourData.getEndTourVehicleDetailsReviewed());
        me.setVehicleInspectionTourCheckList(boTourData.getVehicleInspectionTourCheckList());
        me.setSafetyInspectionTourCheckList(boTourData.getSafetyInspectionTourCheckList());
    }
    
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}