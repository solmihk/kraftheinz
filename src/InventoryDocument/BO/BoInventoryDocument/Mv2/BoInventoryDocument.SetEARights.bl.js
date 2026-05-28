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
 * @function setEARights
 * @this BoInventoryDocument
 * @kind businessobject
 * @namespace CORE
 * @description Sets access control rights for the InventoryDocument business object and its associated 
 *  ItemsUnitOfMeasureList. It manages editing permissions based on the product check-in policy, document 
 *  phase, running tour status, and modification reason visibility. This function controls the visibility 
 *  and editability of various properties to ensure proper access management.
 */
function setEARights() {
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    var aclBoInventoryDocument = me.getACL();
    var aclLoItemsUnitOfMeasureList = me.getLoItemsUnitOfMeasureList().getACL();

    if (me.getBoOrderTemplate().getPrdCheckInPolicy() === "Complete") {
        aclLoItemsUnitOfMeasureList.removeRight(AclObjectType.PROPERTY, "leftQuantity", AclPermission.EDIT);
    }

    //lock inventory document based on phase or missing running tour
    var lockedPhases = [
        BLConstants.Order.PHASE_RELEASED, 
        BLConstants.Order.PHASE_CANCELED, 
        BLConstants.Order.PHASE_READY, 
        BLConstants.Order.PHASE_FEEDBACK, 
        BLConstants.Order.PHASE_VOIDED
    ];
    var lockedByPhase = false;
    if (lockedPhases.indexOf(me.getPhase()) > -1) {
        lockedByPhase = true;
    }

    //lock inventory document based on phase or missing running tour
    var lockedByRunningTour = true;
    if (Utils.isDefined(ApplicationContext.get(BLConstants.APPCTX.DSD.RUNNING_TOUR)) &&
        ApplicationContext.get(BLConstants.APPCTX.DSD.RUNNING_TOUR) === me.getTourId()) {
        lockedByRunningTour = false;
    }

    if (lockedByPhase || lockedByRunningTour) {
        aclBoInventoryDocument.removeRight(AclObjectType.OBJECT, "BoInventoryDocument", AclPermission.EDIT);
        aclLoItemsUnitOfMeasureList.removeRight(AclObjectType.PROPERTY, "modificationReason", AclPermission.EDIT);
        aclLoItemsUnitOfMeasureList.removeRight(AclObjectType.PROPERTY, "checkInReasonCode", AclPermission.EDIT);
    }

    //hide modification reason if not required
    if (me.isModReasonVisible()) {
        aclLoItemsUnitOfMeasureList.addRight(AclObjectType.PROPERTY, "modificationReason", AclPermission.VISIBLE);
        aclLoItemsUnitOfMeasureList.addRight(AclObjectType.PROPERTY, "checkInReasonCode", AclPermission.VISIBLE);
    } else {
        aclLoItemsUnitOfMeasureList.removeRight(AclObjectType.PROPERTY, "modificationReason", AclPermission.VISIBLE);
        aclLoItemsUnitOfMeasureList.removeRight(AclObjectType.PROPERTY, "checkInReasonCode", AclPermission.VISIBLE);
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////


}