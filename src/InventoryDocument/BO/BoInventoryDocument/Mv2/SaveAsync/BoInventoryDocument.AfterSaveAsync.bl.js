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
 * @function afterSaveAsync
 * @this BoInventoryDocument
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {Object} result
 * @param {Object} context
 * @returns promise
 * @description Shows error message in case of release issues.
 * Triggers background sync depending on the configuration (SyncOptions).
 */
function afterSaveAsync(result, context){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
  var promise = when.resolve();
  let orgPhase = me.getActualStatePKey();

  let docAlreadyReleased = (me.getPhase() === BLConstants.Order.PHASE_RELEASED && orgPhase === BLConstants.Order.PHASE_RELEASED) || (me.getPhase() === BLConstants.Order.PHASE_READY && orgPhase === BLConstants.Order.PHASE_READY);
  let docAlreadyCanceled = me.getPhase() === BLConstants.Order.PHASE_CANCELED && orgPhase === BLConstants.Order.PHASE_CANCELED;

  //skip logic for already released and canceled documents
  if (!docAlreadyReleased && !docAlreadyCanceled ) {

    if ((me.getValidateForRelease() == "1") && (me.getSetPhaseInBeforeSave() == "1") && (orgPhase == me.getPhase())) {
      var buttonValues = {};
      buttonValues[Localization.resolve("OK")] = "ok";

      promise = MessageBox.displayMessage(Localization.resolve("MessageBox_Title_Error"), Localization.resolve("NoResponsibleFoundByWorkflow"), buttonValues)
        .then(
          function () {
            return result;
          });
    } else {

      var syncOption = me.getBoOrderTemplate().getSyncOptions();

      //Trigger sync on release
      if (me.getPhase() === BLConstants.Order.PHASE_RELEASED && orgPhase !== BLConstants.Order.PHASE_RELEASED) {
        if (syncOption == BLConstants.SYNC.SYNC_OPTION_RELEASE || syncOption == BLConstants.SYNC.SYNC_OPTION_RELEASE_CANCEL) {
          Facade.startBackgroundReplication();
        }
      }
      //Trigger sync on cancel
      else if (me.getPhase() === BLConstants.Order.PHASE_CANCELED && orgPhase !== BLConstants.Order.PHASE_CANCELED) {

        if (syncOption == BLConstants.SYNC.SYNC_OPTION_CANCEL || syncOption == BLConstants.SYNC.SYNC_OPTION_RELEASE_CANCEL) {
          Facade.startBackgroundReplication();
        }
      }
    }
  }
   
  
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}