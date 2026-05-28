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
 * @function afterLoadAsync
 * @this LoQuestions
 * @kind listobject
 * @async
 * @namespace CORE
 * @param {Object} result
 * @param {Object} context
 * @returns promise
 * @description In this afterLoadAsync method, we identify and handle duplicate visit jobs. If duplicates are found, they are 
 * excluded from the UI display, and a warning message is logged.
 */
function afterLoadAsync(result, context) {
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    var initialQuestions = me.getAllItems();
    var finalQuestions = [];
    var questionsDict = {};
    var visitJobsKeys = [
      "bpaMainPKey",
      "clbMainPKey",
      "clbPOSCheckPKey",
      "defaultValue",
      "done",
      "history",
      "jobDefListPKey",
      "jobDefinitionListText",
      "jobDefinitionMetaPKey",
      "jobDefinitionPKey",
      "jobListPKey",
      "jobMetaPKey",
      "lastValue",
      "listed",
      "mandatory",
      "manual",
      "pKey",
      "pOS",
      "planned",
      "posId",
      "prdMainPKey",
      "prdPOSContentPKey",
      "questionText",
      "targetValue",
      "value",
      "visible",
      "visitDate",
      "visitTime",
    ];

    me.removeAllItems();

    function printRequiredFields(visitJob) {
      var printObj = {};

      for (var i = 0; i < visitJobsKeys.length; i++) {
        var keyName = visitJobsKeys[i];
        printObj[keyName] = visitJob[keyName];
      }

      AppLog.info(JSON.stringify(printObj));
    }

    for (var i = 0; i < initialQuestions.length; i++) {
      var currentQuestion = initialQuestions[i];
      var questionUniqueKey =
        currentQuestion.getJobDefinitionPKey() +
        "+" +
        currentQuestion.getJobListPKey() +
        "+" +
        (currentQuestion.posId ? currentQuestion.posId : "");

      if (questionsDict[questionUniqueKey]) {
        var id1 = currentQuestion.getPKey();
        var id2 = questionsDict[questionUniqueKey].getPKey();

        AppLog.warn(
          "Duplicate question found. Skipping display in the UI. id1 - " +
            id1 +
            " id2 - " +
            id2
        );

        AppLog.info("First Question --> ");
        printRequiredFields(currentQuestion.getData());

        AppLog.info("Second Question --> ");
        printRequiredFields(questionsDict[questionUniqueKey].getData());
      } else {
        questionsDict[questionUniqueKey] = currentQuestion;
        finalQuestions.push(currentQuestion);
      }
    }

    me.addItems(finalQuestions);

    var promise = when.resolve(result);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}