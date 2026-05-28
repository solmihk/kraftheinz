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
 * @function beforeSaveAsync
 * @this BoInventoryDocument
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {Object} context
 * @returns promise
 * @description Handles workflow state transitions and triggers save of related objects.
 */
function beforeSaveAsync(context){
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

    var workflowPromise = when.resolve();
    var deferreds = [];
    var isOrderPhaseChangeInProgress = me.getSetPhaseInBeforeSave() == "1";
    if (isOrderPhaseChangeInProgress && Utils.isDefined(me.getBoWorkflow())) {
      var actualState_beforeTransiton = me.getActualStatePKey();
      var actualStatePKey_afterTransition = " ";
      var nextStatePKey_afterTransition = " ";
      var phase_afterTransition = " ";
      //Determine ActualStatePKey to PKey of next phase
      var nextStates = me.getBoWorkflow().getNextStates(me.getActualStatePKey());


      if (nextStates.length > 0) {
        actualStatePKey_afterTransition = nextStates[0].toStatePKey;
        phase_afterTransition = nextStates[0].stateType;
        //Set NextStatePKey to ActualStatePKey (setting to nextStatePKey would not be correct - save at Web after sync would do state transition)
        nextStatePKey_afterTransition = nextStates[0].toStatePKey;
      }


      //Determine next responsible
      workflowPromise = me.getBoWorkflow().getNextResponsible(nextStatePKey_afterTransition, me.getResponsiblePKey(), me.getResponsiblePKey()).then(
        function (nextResponsible) {
          //Reset internal property to avoid duplicate phase and responsible setting
          me.setSetPhaseInBeforeSave("0");


          //Set next responsible, states and, phase
          //Note: If no responsible has been found, a message is displayed in after save
          if (Utils.isDefined(nextResponsible)) {
            me.setResponsiblePKey(nextResponsible);
            me.setActualStatePKey(actualStatePKey_afterTransition);
            me.setNextStatePKey(nextStatePKey_afterTransition);
            me.setPhase(phase_afterTransition);
            me.setSf_mobilityRelease("1");


            if (me.getBoWorkflow().getRecentStatePolicy() == "1") {
              return BoFactory.createListAsync(LO_ORDERRECENTSTATE, {});
            }
          }
        }).then(
          function (loRecentState) {
            if (Utils.isDefined(loRecentState)) {
              //Write recent state entry
              var jsonData = {};
              jsonData.pKey = PKey.next();
              jsonData.done = Utils.createDateToday();
              jsonData.sdoMainPKey = me.getPKey();
              jsonData.usrMainPKey = ApplicationContext.get('user').getPKey();
              jsonData.wfeStatePKey = actualState_beforeTransiton;
            }
          });
    }


    promise = workflowPromise.then(
      function () {

        me.prepareItemsForSave();

        deferreds.push(Facade.saveObjectAsync(me));
        //save inventory document items
        if (Utils.isDefined(me.getLoItemsMainList())) {
          deferreds.push(me.getLoItemsMainList().saveAsync());
        }
        if (Utils.isDefined(me.getLoSysSignatureAttribute())) {
          deferreds.push(me.getLoSysSignatureAttribute().saveAsync());
        }
        if (Utils.isDefined(me.getLoSysSignatureBlob())) {
          deferreds.push(me.getLoSysSignatureBlob().saveAsync());
        }
        if (Utils.isDefined(me.getLoInventories())) {
          deferreds.push(me.getLoInventories().saveAsync());
        }
        if (Utils.isDefined(me.getLoInventoryTransactions())) {
          deferreds.push(me.getLoInventoryTransactions().saveAsync());
        }
        return when.all(deferreds).then(
          function () {
            //Reset object status for all to prevent multiple saves
            me.setObjectStatus(STATE.PERSISTED, true);
          });
      });
  }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}