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
 * @function populateCheckInItems
 * @this BoInventoryDocument
 * @kind businessobject
 * @async
 * @param {array} listOfCheckInItems 
 * @param {array} persistedCheckInItems  
 * @namespace CORE
 * @returns promise
 * @description Adds check-in inventory items to main list. 
 *  + Calculates Difference 
 *  + Create UOM Information String
 *  + Sets "isOrderUnit" filter
 * 
 * CREATE mode: 
 *     Setting quantity to given target quantity (calculation via inventory transaction records)
 * LOAD mode: 
 *    Load order items from inventory (prepopulation) + load already persisted order items and merge both lists
 *    Distribution algorithm to distribute quantites to order unit is executed
 * RELEASED mode:
 *    Loads order items for a released inventory document only from persisted order items. In Persisted order 
 *    items for each Product + Order Item Template group, an UOM that has isOrderUnit as true is used as main 
 *    item . If such an UOM is not available, then an UOM that has lowest sort value is used as main item.
 * 
 */
function populateCheckInItems(listOfCheckInItems, persistedCheckInItems) {
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

  var promise = when.resolve(me);
  var deferreds = [];
  
  if (me.getDocumentType() === BLConstants.Order.DOCUMENT_TYPE_PRODUCT_CHECK_IN) {
    switch (me.getBoOrderTemplate().getItemPresettingPolicy()) {

      //The system shows no line items, the user has to add / scan all products manually
      case "BlindMode":
        AppLog.error("'Blind Mode' is not supported for inventory checkin documents. Please set the 'Item Presetting Policy' of the order template to 'Prepopulated'.");
        break;

      //Non-blind mode: The system shows the line item with the expected quantity
      case "NonBlindMode":
        AppLog.error("'Non Blind Mode' is not supported for inventory checkin documents. Please set the 'Item Presetting Policy' of the order template to 'Prepopulated'.");
        break;

      // User needs to update only the quantities for products with deviations to theexpected 
      case "Prepopulated":

        if ([BLConstants.Order.PHASE_RELEASED, BLConstants.Order.PHASE_READY].includes(me.getPhase()) && Utils.isDefined(persistedCheckInItems)){
          //#################
          //## RELEASED MODE ##
          //#################

            let groupedPersistedItems = Utils.groupBy(persistedCheckInItems, function (item) {
              return [item.productId, item.orderItemTemplateId].join(',');
            });

            for (let persistedItemGroupKey in groupedPersistedItems) {
              let persistedItemGroup = groupedPersistedItems[persistedItemGroupKey];

              let orderUOMItem = Utils.find(persistedItemGroup, function (item) {
                return item.isOrderUnit == '1';
              });

              if(!orderUOMItem){
                // Choosing the first item as per sort order ( nulls first ) as dummy isOrderUnit to be shown on left side.
                persistedItemGroup.sort((a, b) => (a.sort || 0 ) - (b.sort || 0));
                orderUOMItem = persistedItemGroup[0];
                orderUOMItem.isOrderUnit = '1';
              }

              for (let item of persistedItemGroup) {
                item.mainItemReference = orderUOMItem.pKey;
                
                // Set object status as persisted to avoid saving temporary any modifications
                item.objectStatus = STATE.PERSISTED;
              }
              
              // Considering only persisted items to display for RELEASED document 
              listOfCheckInItems = persistedCheckInItems;
            }   
        }
        else if (Utils.isDefined(listOfCheckInItems) && listOfCheckInItems.length > 0) {
          
          if (Utils.isDefined(persistedCheckInItems)) {
            //#################
            //## LOAD MODE ##
            //#################
            let dicPersistedItems = Utils.createDictionary();
            let dicMainItemReferencesOfPersistedItems = Utils.createDictionary();
            let dicMainItemReferencesOfPrepopulatedItems = Utils.createDictionary();
            let uniqueKey;

            //add peristed items to dictionary
            persistedCheckInItems.forEach((persistedItem) => {
              uniqueKey = persistedItem.productId + persistedItem.orderItemTemplateId + persistedItem.uom;
              dicPersistedItems.add(uniqueKey, persistedItem);

              //prepare dictionary with main item references for persisted items
              //these entries are already be stored to DB 
              //for main item reference use IDs of stored order items if exist
              uniqueKey = persistedItem.productId + persistedItem.orderItemTemplateId;              
              if(persistedItem.isOrderUnit){
                dicMainItemReferencesOfPersistedItems.add(uniqueKey, persistedItem.pKey);
              }
            });

            //prepare dictionary with main item references for prepopulated items
            //if there are no stored order items which can be used to set main item reference use IDs of prepopulated items
            listOfCheckInItems.forEach((prepopulatedItem) => {
              uniqueKey = prepopulatedItem.productId + prepopulatedItem.orderItemTemplateId; 
              if(!dicMainItemReferencesOfPersistedItems.containsKey(uniqueKey) && prepopulatedItem.isOrderUnit){
                dicMainItemReferencesOfPrepopulatedItems.add(uniqueKey, prepopulatedItem.pKey);
              }
            });

            //##############################################
            //## merge checkIn items with persisted items ##
            //##############################################
            listOfCheckInItems.forEach((listOfCheckInItem) => {
              uniqueKey = listOfCheckInItem.productId + listOfCheckInItem.orderItemTemplateId + listOfCheckInItem.uom;

              if (Utils.isDefined(dicPersistedItems.get(uniqueKey))) {

                //perisited item available
                let persistedItem = dicPersistedItems.get(uniqueKey);

                //copy over persisted item
                for (var prop in persistedItem) {
                  listOfCheckInItem[prop] = persistedItem[prop];
                }
                
                //Do not update items as long as user is not modifying it (no changes so for only loaded from DB)
                listOfCheckInItem.objectStatus = STATE.PERSISTED;

              } else {
                //no item for product/orderItemTemplate/Uom combination exists on DB
                listOfCheckInItem.pKey = PKey.next();
                listOfCheckInItem.orderId = me.getPKey();
                //target quantity can be set to 0 because there are no matching order items and as long as there exist only one initial checkIn document no new products can be added
                //if multiple check in documents are supported in future (which can influence inventory products) distribution algorithm executed in create case must also be executed in load case
                listOfCheckInItem.targetQuantity = 0;
                //prepopulated items should not be stored automatically
                listOfCheckInItem.objectStatus = STATE.NEW;
              }

              //set main item reference that mod reason handling (marking invalid item) works
              //there must be a relation between main item and uom items so that item of main list and item of uom list can be marked as invalid
              //if there exist peristed items the id of persisted item must be used for setting main item reference
              listOfCheckInItem.mainItemReference = null;
              uniqueKey = listOfCheckInItem.productId + listOfCheckInItem.orderItemTemplateId;
              if(dicMainItemReferencesOfPersistedItems.containsKey(uniqueKey)){
                listOfCheckInItem.mainItemReference = dicMainItemReferencesOfPersistedItems.get(uniqueKey)
              }else if(dicMainItemReferencesOfPrepopulatedItems.containsKey(uniqueKey)){
                listOfCheckInItem.mainItemReference = dicMainItemReferencesOfPrepopulatedItems.get(uniqueKey)
              }
            });
          }
          else {
            //#################
            //## CREATE MODE ##
            //#################

            /*
            * Full example of distribution algorithm 
            *
            * Note: Only valid in case of “Always use smallest unit as IvcControlMeasure”
            *
            * This example also shows behavior if there would be a larger unit than "Order Unit" and if there would be one more smaller unit between Order unit and smallest Unit.
            *
            * Example (all Units have Order_Ability=true):
            *   Consumer Unit (bottle): pieces per smallest → 1
            *   Intermediate Unit (Packs): pieces per smallest → 6 (=6 bottles)
            *   Sales Unit (Crate) / is also ORDER Unit → pieces per smallest → 12 (=2 packs)
            *   Layer pieces per smallest → 144 (=12 Crates)
            *
            * Inventory is expected to hold 167:
            *   Consumer Unit: 11
            *   Intermediate Unit: 0
            *   Sales Unit: 13
            *   Layer: 0
            * no Usage of "Layer" since we start with our order unit which is "Sales Unit (Crate)"
            * no Usage of "Intermediate Unit (Packs)" since we only start with our order unit ("Sales Unit (Crate)") and then put the rest directly to the smallest Unit           
            */

            let groupedCheckInItems = Utils.groupBy(listOfCheckInItems, function (item) {
              return [item.productId, item.orderItemTemplateId].join(',');
            });

            for (let checkInItemGroupKey in groupedCheckInItems) {
              let checkInItemGroup = groupedCheckInItems[checkInItemGroupKey];
              let productText = "";
              if(Utils.isDefined(checkInItemGroup[0])){
                productText = checkInItemGroup[0].description1;
              }

              let orderUOMItem = Utils.find(checkInItemGroup, function (item) {
                return item.isOrderUnit == '1';
              });

              let smallestUOMItem = Utils.find(checkInItemGroup, function (item) {
                return item.piecesPerSmallestUnit === 1;
              });

              let inventoryUOMUnit = Utils.find(checkInItemGroup, function (item) {
                return (item.isInventoryUom == '1' && item.targetQuantity > 0);
              });

              let inventoryTargetQuantityInSmallestUnit = inventoryUOMUnit ?
                (inventoryUOMUnit.targetQuantity * inventoryUOMUnit.piecesPerSmallestUnit)
                : 0;

              // Check if orderUOMItem is present , also smallestUOMItem is present or smallestUOMItem is not required.
              if (orderUOMItem &&
                (smallestUOMItem || inventoryTargetQuantityInSmallestUnit % orderUOMItem.piecesPerSmallestUnit === 0)) {
                
                //Distribute major quantity to orderUOMItem;
                orderUOMItem.quantity = Math.trunc(
                  inventoryTargetQuantityInSmallestUnit / orderUOMItem.piecesPerSmallestUnit
                );
                
                //Distribute remainder qty to smallestUOMItem.
                //This happens when orderUOMItem is not the smallestUOMItem and inventory quantity is not divisible by orderUOMItem.piecesPerSmallestUnit
                let remainderQuantity = inventoryTargetQuantityInSmallestUnit % orderUOMItem.piecesPerSmallestUnit;
                if(remainderQuantity != 0){
                  smallestUOMItem.quantity = remainderQuantity;
                }
              }else{
                if(!Utils.isDefined(orderUOMItem)){
                  AppLog.error("For the product '" + productText + "' exists no order unit. The order unit is mandatory for check-in documents.");
                }else if(!Utils.isDefined(smallestUOMItem) && inventoryTargetQuantityInSmallestUnit % orderUOMItem.piecesPerSmallestUnit != 0){
                  AppLog.error("For the product '" + productText + "' exists no smallest unit (pieces per smallest = 1). The smallest unit is mandatory for check-in documents.");
                }
              }

              for (let item of checkInItemGroup) {
                item.pKey = PKey.next();
                item.orderId = me.getPKey();
                item.objectStatus = STATE.NEW;

                item.mainItemReference = orderUOMItem ? orderUOMItem.pKey : null;

                // Reset targetQuantity to quantity after above distribution
                item.targetQuantity = item.quantity || 0;

                //make item dirty to store it if qty is set
                if (item.quantity > 0) {
                  item.objectStatus = (STATE.NEW | STATE.DIRTY);
                }
              }
            }
          }
        }

        let loItemsMainList = me.getLoItemsMainList();
        loItemsMainList.addItems(listOfCheckInItems);

        //calculate difference once Li object are available after filling the list
        loItemsMainList.suspendListRefresh();
        let mainListItems = me.getLoItemsMainList().getAllItems();
        mainListItems.forEach((item) => {
          me.calculateItemDifference(item);
          deferreds.push(me.calculateItemValue(item, me.getBoOrderTemplate()));
        });
        loItemsMainList.resumeListRefresh(true);

        //create main item unit information
        me.createDisplayInformationForMainItemList(loItemsMainList.getAllItems());

        //show only the main items
        loItemsMainList.setFilter("isOrderUnit", "1", "EQ");
        promise = when.all(deferreds);
    }
  }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////


}