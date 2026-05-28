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
 * @function processInventoryActions
 * @this BoInventoryDocument
 * @kind businessobject
 * @async
 * @namespace CORE
 * @returns promise
 * @description Processes inventory actions by creating missing inventories and transactions for valid items 
 *  with positive quantities. Validates inventory template keys and handles errors.
 */
function processInventoryActions() {
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    // Find inventory and set balance for inventoryDocItems with quantity > 0 but without InventoryInformationList
    var deferreds = [];
    var orderItemTemplatesMap = me
      .getBoOrderTemplate()
      .getItemMetaJsonDictionary();
    var inventoryDocItems = me.getLoItemsMainList().getAllItems();

    for (var i = 0; i < inventoryDocItems.length; i++) {
      var inventoryDocItem = inventoryDocItems[i];
      var orderItemTemplate = orderItemTemplatesMap.get(
        inventoryDocItem.getOrderItemTemplateId()
      );
      var inventoryInformationList =
        inventoryDocItem.getInventoryInformationList();
      var isInventoryInfoListValid =
        Utils.isDefined(inventoryInformationList) &&
        !Utils.isEmptyString(inventoryInformationList);

      if (
        Utils.isDefined(orderItemTemplate) &&
        orderItemTemplate.useUserInventory == "1" &&
        inventoryDocItem.getQuantity() > 0 &&
        !isInventoryInfoListValid
      ) {
        deferreds.push(
          me.setInventoryBalanceOfItem(inventoryDocItem.getPKey())
        );
      }
    }

    // Checks whether the id is valid when the policy is "One"
    function isInValidInventoryTemplateKey(policy, id) {
      var isValidId = Utils.isDefined(id) && !Utils.isEmptyString(id);

      return policy === "One" && !isValidId;
    }

    // Create transactions and missing inventories

    var promise = when.all(deferreds).then(function () {
      //-------------------------------------------
      // Product inventories
      //-------------------------------------------

      // Create loInventories and loInventoryTransactions
      me.setLoInventories(BoFactory.instantiate(LO_INVENTORY));
      me.setLoInventoryTransactions(
        BoFactory.instantiate(LO_INVENTORYTRANSACTION)
      );

      // Create missing inventories and write transactions

      var validationErrors = [];
      var loInventories = me.getLoInventories();
      var loInventoryTransactions = me.getLoInventoryTransactions();
      var inventoryDocItems = me.getLoItemsMainList().getAllItems();

      for (var i = 0; i < inventoryDocItems.length; i++) {
        var inventoryDocItem = inventoryDocItems[i];
        var inventoryInformationList =
          inventoryDocItem.getInventoryInformationList();
        var orderItemTemplate = orderItemTemplatesMap.get(
          inventoryDocItem.getOrderItemTemplateId()
        );
        var isInventoryInfoListValid =
          Utils.isDefined(inventoryInformationList) &&
          !Utils.isEmptyString(inventoryInformationList);

        if (
          Utils.isDefined(orderItemTemplate) &&
          orderItemTemplate.useUserInventory == "1" &&
          inventoryDocItem.getQuantity() > 0 &&
          isInventoryInfoListValid
        ) {
          // Write transaction for each inventory control template (combination of IvcMeta and IvcTaMeta)
          for (var j = 0; j < inventoryInformationList.length; j++) {
            var inventoryInformation = inventoryInformationList[j];

            if (Utils.isEmptyString(inventoryInformation)) {
              inventoryInformation = inventoryInformationList[0];
            }

            var ivcMetaByItemMeta = inventoryInformation.ivcMetaByItemMeta;
            var errorMessage =
              "Creating inventory for product id - " +
              inventoryDocItem.productId +
              ", product description - " +
              inventoryDocItem.description1 +
              ", orderId - " +
              inventoryDocItem.orderId +
              ", inventory control template id - " +
              ivcMetaByItemMeta.ivcMetaPKey +
              ", inventory transaction template id - " +
              ivcMetaByItemMeta.ivcTaMetaPKey +
              " failed as ";
            var skipInventoryCreation = false;

            if (
              isInValidInventoryTemplateKey(
                ivcMetaByItemMeta.getTmgPolicy(),
                ivcMetaByItemMeta.getTmgTourPKey()
              )
            ) {
              errorMessage += "Tour Id is not available.";
              skipInventoryCreation = true;
            }

            if (
              isInValidInventoryTemplateKey(
                ivcMetaByItemMeta.getVehiclePolicy(),
                ivcMetaByItemMeta.getEtpVehiclePKey()
              )
            ) {
              errorMessage += "Vehicle Id is not available.";
              skipInventoryCreation = true;
            }

            if (
              isInValidInventoryTemplateKey(
                ivcMetaByItemMeta.getUsrPolicy(),
                ivcMetaByItemMeta.getUsrMainPKey()
              )
            ) {
              errorMessage += "User Id is not available.";
              skipInventoryCreation = true;
            }

            // Create inventory if not already exists
            if (Utils.isEmptyString(inventoryInformation.ivcMainPKey)) {
              if (skipInventoryCreation) {
                AppLog.error(errorMessage);
                continue;
              }
              inventoryInformation.ivcMainPKey =
                loInventories.createInventoryForOrderItem(
                  inventoryDocItem,
                  inventoryInformation,
                  me.getBoOrderTemplate().getProductInventoryRecordTypeId()
                );
            }

            // Write transaction (could be still empty in case of a not found quota - quotas are not created automatically)
            if (!Utils.isEmptyString(inventoryInformation.ivcMainPKey)) {
              var orderDate = me.getOrderDate();
              var validationError =
                loInventoryTransactions.createTransactionForOrderItem(
                  inventoryDocItem,
                  inventoryInformation,
                  orderItemTemplate.checkUserInventoryOver,
                  orderItemTemplate.checkQuotaOver,
                  orderDate
                );

              if (Utils.isDefined(validationError)) {
                validationErrors.push(validationError);
              }
            }
          }
        }
      }

      return validationErrors;
    });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}