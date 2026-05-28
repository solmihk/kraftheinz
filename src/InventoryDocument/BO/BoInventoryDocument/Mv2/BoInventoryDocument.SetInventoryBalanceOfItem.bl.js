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
 * @function setInventoryBalanceOfItem
 * @this BoInventoryDocument
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {String} itemPKey
 * @returns promise
 * @description Sets inventory balance for a given item by finding matching inventory records, calculating balances,
 *  and updating item information. Handles user inventory scenarios with unit conversions.
 */
function setInventoryBalanceOfItem(itemPKey){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    var promise = when.resolve();

    var ivcMetaPKeys = [];
    var usrMainPKeys = [];
    var bpaMainPKeys = [];
    var prdMainPKeys = [];
    var tmgTourPKeys = [];
    var etpVehiclePKeys = [];

    var jsonParamsForFinding = [];
    var jsonQueryForFinding = {};

    // create pKey and refPKey dictionaries for LoItems
    var inventoryDocItemsDict = Utils.createDictionary();
    var orderItemsRefPKeyDict = Utils.createDictionary();
    var inventoryDocItems = me.getLoItemsMainList().getAllItems();

    for (var i = 0; i < inventoryDocItems.length; i++) {
      var inventoryDocItem = inventoryDocItems[i];
      var inventoryDocItemReferenceId = inventoryDocItem.getReferenceId();

      inventoryDocItemsDict.add(inventoryDocItem.getPKey(), inventoryDocItem);

      if (!orderItemsRefPKeyDict.containsKey(inventoryDocItemReferenceId)) {
        orderItemsRefPKeyDict.add(inventoryDocItemReferenceId, []);
      }
      orderItemsRefPKeyDict.data[inventoryDocItemReferenceId].push(inventoryDocItem);
    }

    var mainInventoryDocItem = inventoryDocItemsDict.get(itemPKey);
    var orderItemTemplate = me
      .getBoOrderTemplate()
      .getLoOrderItemMetas()
      .getItemTemplateByPKey(mainInventoryDocItem.getOrderItemTemplateId());

    mainInventoryDocItem.setObjectStatusFrozen(true);

    if (Utils.isDefined(orderItemTemplate)) {
      // Determine inventory information only if the item template is used to UseUserInventory or UseQuota
      if (
        orderItemTemplate.getUseUserInventory() == "1"
      ) {
        var inventoryInformationList =
        mainInventoryDocItem.getInventoryInformationList();
        var isInventoryInfoListValid =
        Utils.isDefined(inventoryInformationList) &&
        !Utils.isEmptyString(inventoryInformationList);

        // Determine balance only if not already done
        if (!isInventoryInfoListValid) {
          // Get inventory meta information with prepared search keys
          var inventoryTemplatesList = me
            .getBoOrderTemplate()
            .getIvcMetasByItemMeta(mainInventoryDocItem.getOrderItemTemplateId());

          for (var i = 0; i < inventoryTemplatesList.length; i++) {
            //do not consider cash float inventory only UserInventories and Quota (according to template switch)
            var metaId = inventoryTemplatesList[i].getMetaId();

            if (metaId === "UserInventory") {
              ivcMetaPKeys.push(inventoryTemplatesList[i].getIvcMetaPKey());
              usrMainPKeys.push(inventoryTemplatesList[i].getUsrMainPKey());
              bpaMainPKeys.push(inventoryTemplatesList[i].getBpaMainPKey());
              tmgTourPKeys.push(inventoryTemplatesList[i].getTmgTourPKey());
              etpVehiclePKeys.push(inventoryTemplatesList[i].getEtpVehiclePKey());
            }
          }

          prdMainPKeys.push(mainInventoryDocItem.getProductId());

          jsonParamsForFinding.push({
            field: "ivcMetaPKeys",
            value: "'" + ivcMetaPKeys.join("','") + "'",
          });
          jsonParamsForFinding.push({
            field: "usrMainPKeys",
            value: "'" + usrMainPKeys.join("','") + "'",
          });
          jsonParamsForFinding.push({
            field: "bpaMainPKeys",
            value: "'" + bpaMainPKeys.join("','") + "'",
          });
          jsonParamsForFinding.push({
            field: "prdMainPKeys",
            value: "'" + prdMainPKeys.join("','") + "'",
          });
          jsonParamsForFinding.push({
            field: "tmgTourPKeys",
            value: "'" + tmgTourPKeys.join("','") + "'",
          });
          jsonParamsForFinding.push({
            field: "etpVehiclePKeys",
            value: "'" + etpVehiclePKeys.join("','") + "'",
          });

          jsonQueryForFinding.params = jsonParamsForFinding;

          var jsonQueryForUnitConversion = {
            params: [
              {
                field: "productPKey",
                value: mainInventoryDocItem.getProductId(),
              },
            ],
          };
          var loUnitFactorForProduct;

          promise = BoFactory.loadObjectByParamsAsync(
            LO_UNITFACTORFORPRODUCT,
            jsonQueryForUnitConversion
          )
            .then(function (unitFactorForProductLo) {
              // Get conversion information for product
              loUnitFactorForProduct = unitFactorForProductLo;

              return BoFactory.loadObjectByParamsAsync(
                LO_INVENTORYFINDING,
                jsonQueryForFinding
              );
            })
            .then(function (loInventoryFinding) {
              // Build inventory information object and store at item
              var ivcInformation;
              var ivcInformationObject = [];
              var params;

              for (var i = 0; i < inventoryTemplatesList.length; i++) {
                params = {};
                params.ivcMetaPKey = inventoryTemplatesList[i].getIvcMetaPKey();
                params.usrMainPKey = inventoryTemplatesList[i].getUsrMainPKey();
                params.bpaMainPKey = inventoryTemplatesList[i].getBpaMainPKey();
                params.prdMainPKey = mainInventoryDocItem.getProductId();
                params.tmgTourPKey = inventoryTemplatesList[i].getTmgTourPKey();
                params.etpVehiclePKey =
                  inventoryTemplatesList[i].getEtpVehiclePKey();

                ivcInformation = {};
                ivcInformation.ivcMainPKey = " ";
                ivcInformation.balance = 0;

                var foundInventoryItems = loInventoryFinding.getItemsByParam(params);

                // If inventory found, add IvcMainPKey to IvcInformationObject
                if (foundInventoryItems.length > 0) {
                  var liInventory = foundInventoryItems[0];

                  ivcInformation.ivcMainPKey = liInventory.getIvcMainPKey();
                  ivcInformation.balance = liInventory.getBalance();
                }

                ivcInformation.ivcMetaByItemMeta = inventoryTemplatesList[i];
                ivcInformation.unitConversionInformation =
                  loUnitFactorForProduct;

                ivcInformationObject.push(ivcInformation);
              }

              var loOrderItems = orderItemsRefPKeyDict.get(mainInventoryDocItem.getReferenceId());
              for (var j = 0; j < loOrderItems.length; j++) {
                loOrderItems[j].setInventoryInformationList(ivcInformationObject);
              }

              mainInventoryDocItem.setObjectStatusFrozen(false);
            });
        }
      }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}