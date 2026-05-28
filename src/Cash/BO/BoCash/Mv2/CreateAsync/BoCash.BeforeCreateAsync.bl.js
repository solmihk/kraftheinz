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
// NOTE:                                                                                     //
// - If you have created PRE and POST functions, they will be executed in the same order     //
//   as before.                                                                              //
// - If you have created a REPLACE to override core function, only the REPLACE function will //
//   be executed. PRE and POST functions will be executed in the same order as before.       //
//                                                                                           //
// - For new customizations, you can directly modify this file. There is no need to use the  //
//   PRE, POST, and REPLACE functions.                                                       //
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
 * -> module: Use CORE or CUSTOM. If you are a Salesforce client or an implementation partner, always use CUSTOM to enable a seamless release upgrade.
 * -> maxRuntime: Maximum time this function is allowed to run, takes integer value in ms. If the max time is exceeded, error is logged.
 * -> returns: Type and variable name in which the return value is stored.
 * @function beforeCreateAsync
 * @this BoCash
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} context
 * @returns promise
 * @deprecated 'Cash' module no longer used 
 */
function beforeCreateAsync(context){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
var jParams;
var jQuery;

me.beginEdit();

var pKey = PKey.next();
me.setPKey(pKey);

me.updateProperties(context.jsonQuery);

me.setInitiationDate(Utils.createAnsiDateTimeToday());
me.setCommitDate(Utils.createAnsiDateTimeToday());
me.setDeliveryDate(Utils.createAnsiDateTimeToday());

var user = ApplicationContext.get("user");
me.setInitiatorPKey(user.getPKey());
me.setResponsiblePKey(user.getPKey());
me.setOwnerPKey(user.getPKey());
me.setSalesOrg(user.getBoUserSales().getSalesOrg());
var runningTourPKey = " ";
var etpWarehousePKey = " ";

/* if (Utils.isDefined(ApplicationContext.get("currentTourPKey"))) {
  runningTourPKey = ApplicationContext.get("currentTourPKey");

  var runningTour = ApplicationContext.get(BLConstants.APPCTX.DSD.CURRENT_TOUR);

  if (Utils.isEmptyString(me.getEtpWarehousePKey())) {
    if (Utils.isDefined(runningTour)) {
      etpWarehousePKey = runningTour.getStartEtpWarehousePKey();
    }
    me.setEtpWarehousePKey()(etpWarehousePKey);
  }
} */
me.setTmgMainPKey(runningTourPKey);

me.endEdit();

var jsonParams = me.prepareLookupsLoadParams(me);

var promise = Facade.loadLookupsAsync(jsonParams)
  .then(function (lookups) {
    me.assignLookups(lookups);

    return BoFactory.loadObjectByParamsAsync(
      BO_ORDERMETA,
      {
        params: [
          {
            field: "pKey",
            value: me.getSdoMetaPKey(),
            operator: "EQ"
          }
        ]
      }
    );
  })
  .then(function (object) {
    me.setBoCashMeta(object);

    me.setDocumentType(me.getBoCashMeta().getSdoSubType());
    me.setDocTaType(me.getBoCashMeta().getDocTaType());

    if (me.getDocumentType() != "Expenses") {
      me.setExpenseType(" ");
    }

    if (
      me.getDocumentType() == BLConstants.Order.DOCUMENT_TYPE_CASH_CHECK_IN  ||
      me.getDocumentType() == "Expenses"
    ) {
      me.setDebitCredit("Credit");
    } else {
      me.setDebitCredit("Debit");
    }

    me.setWfeWorkflowPKey(me.getBoCashMeta().getWfeWorkflowPKey());
    return BoFactory.loadObjectByParamsAsync(
      "BoWorkflow",
      {
        params: [
          {
            field: "pKey",
            value: me.getWfeWorkflowPKey(),
            operator: "EQ"
          }
        ]
      }
    );
  })
  .then(function (boWorkflow) {
    me.setBoWorkflow(boWorkflow);

    var wfeInitialStateJson = boWorkflow.getInitialState();
    if (Utils.isDefined(wfeInitialStateJson)) {
      me.setPhase("Initial");
      me.setActualStatePKey(wfeInitialStateJson.toStatePKey);
      me.setNextStatePKey(me.getActualStatePKey());
    }
    //################################################
    //### Create Recent State for workflow history ###
    //################################################
    return BoFactory.createListAsync(LO_ORDERRECENTSTATE, {});
  })
  .then(function (loCashWfeRecentState) {
    me.setLoWfeRecentState(loCashWfeRecentState);

    return BoFactory.loadObjectByParamsAsync(
      "LuInitialAndNextState",
      {
        params: [
          {
            field: "wfeWorkflowPKey",
            value: me.getWfeWorkflowPKey(),
            operator: "EQ"
          }
        ]
      }
    );
  })
  .then(function (luInitialAndNextState) {
    //Set ActualStatePKey to PKey of initial state
    me.setActualStatePKey(luInitialAndNextState.getInitialStatePKey());

    var initialStateType = luInitialAndNextState.getInitialStateType();
    if (initialStateType == "initial") {
      initialStateType = "Initial";
    }
    me.setPhase(initialStateType);
    //Set NextStatePKey to ActualStatePKey
    me.setNextStatePKey(luInitialAndNextState.getInitialStatePKey());

    if (me.getBoCashMeta().getDocNumberGenBehavior() == "Creation") {
      return SysNumber.getSysNumberAsync(me.getBoCashMeta().getSysNumberPKey());
    } else {
      return " ";
    }
  })
  .then(function (sysnumber) {
    //Set id (generated by number generator)
    me.setId(sysnumber);

    return BoFactory.loadObjectByParamsAsync(
      LU_USER,
      {
        params: [
          {
            field: "pKey",
            value: me.getResponsiblePKey(),
            operator: "EQ"
          }
        ]
      }
    );
  })
  .then(function (luResponsible) {
    me.setLuResponsible(luResponsible);

    return BoFactory.loadObjectByParamsAsync(
      LU_USER,
      {
        params: [
          {
            field: "pKey",
            value: me.getOwnerPKey(),
            operator: "EQ"
          }
        ]
      }
    );
  })
  .then(function (luOwner) {
    me.setLuOwner(luOwner);

    var sdoMetaPKey = me.getSdoMetaPKey(),
      debitCredit = me.getDebitCredit(),
      jsonQuery = {},
      jsonParams = [];

    jsonParams.push({
      field: "SdoMetaPKey",
      operator: "EQ",
      value: sdoMetaPKey,
    });
    jsonParams.push({
      field: "SdoMainDebitCredit",
      operator: "EQ",
      value: debitCredit,
    });
    jsonQuery.params = jsonParams;

    return BoFactory.loadObjectByParamsAsync(LO_PAYMENTMETA, jsonQuery);
  })
  .then(function (loPaymentMeta) {
    if (Utils.isDefined(loPaymentMeta)) {
      me.getBoCashMeta().setLoPaymentMeta(loPaymentMeta);
    }

    if (
      me.getDocumentType() === BLConstants.Order.DOCUMENT_TYPE_CASH_CHECK_IN  ||
      me.getDocumentType() == "Expenses"
    ) {
      var jsonQuery = {};
      var jsonParams = [];

      jsonParams.push({
        field: "tmgMainPKey",
        operator: "EQ",
        value: me.getTmgMainPKey(),
      });
      jsonParams.push({
        field: "loPaymentMeta",
        operator: "EQ",
        value: me.getBoCashMeta().getLoPaymentMeta(),
      });
      jsonParams.push({
        field: "sdoMainPKey",
        operator: "EQ",
        value: me.getPKey(),
      });

      jsonQuery.params = jsonParams;

      return BoFactory.loadObjectByParamsAsync(
        LO_CHECKINPAYMENTITEMS,
        jsonQuery
      );
    } else {
      return undefined;
    }
  })
  .then(function (loCheckInPayments) {
    if (Utils.isDefined(loCheckInPayments)) {
      me.setLoCheckInPayment(loCheckInPayments);
      me.calculateAmount(loCheckInPayments);
      me.addItemChangedEventListener("loCheckInPayment",me.onCheckInItemChanged);
    }

    //Set State
    me.setObjectStatus(STATE.NEW | STATE.DIRTY);

    return me;
  });
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}