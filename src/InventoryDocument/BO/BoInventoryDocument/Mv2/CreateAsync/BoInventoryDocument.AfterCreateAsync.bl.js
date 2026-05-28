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
 * @function afterCreateAsync
 * @this BoInventoryDocument
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {Object} result
 * @param {Object} context
 * @returns promise
 * @description Takes care of
 *  - Attaching order template
 *  - Filling inventory reference keys
 *  - Finding Workflow config
 *  - Finding number generation config
 */
function afterCreateAsync(result, context){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

  if (!context) {
    context = {
      jsonQuery: {},
    };
  }

  var pKey = PKey.next();
  me.setPKey(pKey);

  var currentTourId = ApplicationContext.get(BLConstants.APPCTX.DSD.CURRENT_TOUR_ID);
  var currentUser = ApplicationContext.get("user").getPKey();
  var currentTour = ApplicationContext.get(BLConstants.APPCTX.DSD.CURRENT_TOUR);
  var currentVehicle = ApplicationContext.get(BLConstants.APPCTX.DSD.CURRENT_TOUR).getDefaultEtpVehicleTruckPKey();


  me.setOrderTemplateId(context.jsonQuery.orderTemplateId);
  me.setTourId(currentTourId);
  me.setOrderDate(Utils.createAnsiDateTimeToday());
  me.setResponsiblePKey(currentUser);
  me.setOwnerPKey(currentUser);
  me.setTotalValue(0);
  me.setTotalValueReceipt(0);
  me.setGrossTotalValue(0);
  me.setGrossTotalValueReceipt(0);
  me.setReleaseTime(Utils.getMinDate());
  me.setTruckId(currentVehicle);

  if(currentTour) {
    me.setTourEndWarehouseId(currentTour.getEndEtpWarehousePKey());
  }
  
  var lookupParams = me.prepareLookupsLoadParams(me);

  var promise = BoFactory.createObjectAsync(
    "BoHelperSimplePricingCalculator",
    {}
  )
  .then(function (calculator) {

    //Set pricing handler
    me.setSimplePricingCalculator(calculator);

    return me.loadLookupsAsync(lookupParams);
  })
  .then(function (lookups) {
    me.assignLookups(lookups);

    var orderTemplateQuery = {};
    var orderTemplateParams = [];

    orderTemplateParams.push({
      field: "pKey",
      value: me.getOrderTemplateId(),
    });
    orderTemplateParams.push({ field: "createOrOpenOrder", value: "1" });

    orderTemplateQuery.params = orderTemplateParams;

    return BoFactory.loadObjectByParamsAsync(
      BO_ORDERMETA,
      orderTemplateQuery
    );
  })
  .then(function (orderTemplate) {
    me.setBoOrderTemplate(orderTemplate);

    // Set InventoryReferenceIds once order template is loaded
    me.setInventoryReferenceIds();

    // Set inventory search keys for item meta and payment metas
    me.getBoOrderTemplate().setIvcSearchKeysForItemMetas(
      me.getOrderAccountId(),
      me.getInventoryReference1Id(),
      me.getInventoryReference2Id(),
      me.getInventoryReference3Id(),
      me.getInventoryReference4Id(),
      me.getInventoryReference5Id()
    );

    me.setDocumentType(orderTemplate.getSdoSubType());
    me.setWfeWorkflowPKey(orderTemplate.getWfeWorkflowPKey());

    return BoFactory.loadObjectByParamsAsync(
      BO_WORKFLOW,
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
    if (Utils.isDefined(boWorkflow)) {
      me.setBoWorkflow(boWorkflow);
      var wfeInitialStateJson = boWorkflow.getInitialState();

      if (Utils.isDefined(wfeInitialStateJson)) {
        me.setPhase("Initial");
        me.setActualStatePKey(wfeInitialStateJson.toStatePKey);
        me.setNextStatePKey(me.getActualStatePKey());
      }
    }

    var orderTemplate = me.getBoOrderTemplate();

    if (
      orderTemplate &&
      orderTemplate.getDocNumberGenBehavior() === "Creation"
    ) {
      return SysNumber.getSysNumberAsync(orderTemplate.getSysNumberPKey());
    } else {
      return when.resolve(me.getPKey()); 
    }
  })
  .then(function (sysnumber) {
    me.setOrderId(sysnumber);
    me.fillDescription();
    me.setObjectStatus(STATE.NEW);
    //load relevent inventory items to populate order items
    return me.fetchCheckInItems();
  })
  .then(function (checkInItems) {

    //Populate order items
    return me.populateCheckInItems(checkInItems);
  })
  .then(function () {
    //add changed handler
    me.addItemChangedEventListener('loItemsMainList', me.onInventoryDocumentItemChanged);

    //EA Right handling
    me.setEARights();

    //calculate document
    return me.calculateInventoryDocumentValue();
  })
  .then(function () {
    me.setCalculationStatus("1");
    return when.resolve(me);
  });


    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}