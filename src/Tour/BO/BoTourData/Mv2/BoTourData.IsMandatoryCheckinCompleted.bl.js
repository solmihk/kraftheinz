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
 * @function isMandatoryCheckinCompleted
 * @this BoTourData
 * @kind businessobject
 * @async
 * @param {Object} tourDocuments
 * @namespace CORE
 * @description Returns true if mandatory checkins are completed.
 * @returns promise
 */
function isMandatoryCheckinCompleted(tourDocuments) {
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    const MANDATORY = "Mandatory";
    var jqueryParams = [];
    var jqueryQuery = {};
    jqueryParams.push({
        field: "tourId",
        value: me.getPKey()
    });
    jqueryQuery.params = jqueryParams;

    return BoFactory.loadObjectByParamsAsync(
        "LoTourObjectReference",
        jqueryQuery
    ).then(function (loTourObjectReference) {
        var orderTemplatesDict = Utils.createDictionary();

        for (let tourObjectReference of loTourObjectReference.getAllItems()) {
            if (
                tourObjectReference.usage === "SdoMeta.ProductCheckIn" &&
                (tourObjectReference.prdCheckInPolicy === "Complete" ||
                    tourObjectReference.prdCheckInPolicy === "Partial")
            ) {
                orderTemplatesDict.add(
                    tourObjectReference.orderTemplateId,
                    MANDATORY
                );
            }
        }

        // Get the checkin documents which are released to consider those order templates
        for (let doc of tourDocuments.getAllItems()) {
            const isProductCheckin =
                doc.documentType ===
                BLConstants.Order.DOCUMENT_TYPE_PRODUCT_CHECK_IN;

            const isReleasedOrClosed =
                doc.phase === BLConstants.Order.PHASE_CLOSED ||
                doc.phase === BLConstants.Order.PHASE_READY ||
                doc.phase === BLConstants.Order.PHASE_RELEASED;

            if (
                isProductCheckin &&
                isReleasedOrClosed &&
                orderTemplatesDict.get(doc.orderTemplateId) === MANDATORY
            ) {
                orderTemplatesDict.remove(doc.orderTemplateId);
            }
        }

        return orderTemplatesDict.keys().length === 0;
    });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
}
