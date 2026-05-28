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
 * @function beforeLoadAsync
 * @this BoUser
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} context - Execution context
 * @returns promise
 * @description Asynchronously loads and initializes user data including settings, roles, attachments, 
 * and supervisor status before the BoUser object is fully loaded
 */
function beforeLoadAsync(context){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise = Facade.getObjectAsync(BO_USER, context.jsonQuery).then(
  function (user) {

    if (!Utils.isDefined(user)) { 
      AppLog.error('No user loaded from database. Please check records on database level and corresponding DataSource for conditions.');
    }

    context.selfJson = user;
    me.setProperties(user);
    if (Utils.isEmptyString(Utils.getToggleText('DomCurrency',me.getCurrency(),true))) {
      //set text if no short text available
      me.setTranslatedCurrency(Utils.getToggleText('DomCurrency',me.getCurrency(),false));
    } else {
      //set short text if available
      me.setTranslatedCurrency(Utils.getToggleText('DomCurrency',me.getCurrency(),true));
    }

    // Obtain the translated short version for the distance unit. If a short version isn't available, use the full standard text.
    var distanceUnit = Utils.getToggleText('DomRpsDistanceDimension', me.getDistanceUnit(), true);

    if (Utils.isEmptyString(distanceUnit)) {
      me.setTranslatedDistanceUnit(Utils.getToggleText('DomRpsDistanceDimension', me.getDistanceUnit(), false));
    } else {
      me.setTranslatedDistanceUnit(distanceUnit);
    }
    //set temporary FW language, to be able to execute LoDataTypesForPicklistCache (setting whole user into context is not allowed before addPicklistValuesToToggleCache)
    Utils.setFallbackSalesforceLangPostfix(me.getSfLanguagePostfix());
    return Facade.getListAsync(LO_DATATYPESFORPICKLISTCACHE, {});
  }).then(    
  function (loDatatype) {
    //Add further toggles into toggle cache - these are not coming from Picklist Repo, but from DataType (used in call survey as dynamic picklists for which no real backend field - and picklist - exists)
    SalesforceTools.addPicklistValuesToToggleCache(loDatatype);
    
    // put user in app context so that macro replacement is already available during rest of load
    ApplicationContext.set('user', me);

    return BoFactory.loadObjectByParamsAsync(
      BO_USERSETTINGS,
      { "params": [{ "field": "usrMainPKey", value: me.getPKey(), "operator": "EQ" }] } 
    );
  }).then(
  function (settings) {
    me.setBoUserSettings(settings);
    if(settings.getUsrLandingPageMobility() == "MainMenu"){
      me.setShowCockpitInDashboard(true);
    } else{
      me.setShowCockpitInDashboard(false);
    }

    return BoFactory.loadObjectByParamsAsync(
      BO_USERSALES, 
      { "params": [{ "field": "usrMainPKey", value : me.getPKey(), "operator": "EQ" }] } 
    );
  }).then(
  function (boUserSales) {
    me.setBoUserSales(boUserSales);

    var jsonParams = [];

    jsonParams.push({
      "field" : "usrRole",
      "value" : "KeyAccountManager"
    });

    jsonParams.push({
      "field" : "usrPKey",
      "value" : me.getPKey()
    });

    var jsonQuery = {};
    jsonQuery.params = jsonParams;

    return BoFactory.loadObjectByParamsAsync(LU_USERHASROLEBYID, jsonQuery);
  }).then(
  function (luUserHasRoleById) {
    me.setLuUserHasRoleById(luUserHasRoleById);

    return BoFactory.loadListAsync(
      LO_USRATTACHMENTS, 
      { "params": [{ "field": "usrMainPKey", "value": me.getPKey(), "operator": "EQ" }] }
    );
  }).then(
  function (loUsrAttachments) {
    if (Utils.isDefined(loUsrAttachments)) {
      loUsrAttachments.setFilter("usage", "Picture");
      if (loUsrAttachments.getCount() > 0) {
        me.setProfilePicture(loUsrAttachments.getItems()[0].getMediaPath());
      } 
    }

    return BoFactory.loadObjectByParamsAsync(
      LU_ISSUPERVISOR, 
      { "params": [{ "field": "usrPKey", "value": me.getPKey(), "operator": "EQ" }] }
    );
  }).then(
  function (luIsSupervisor) {

    //#########################################
    //### check if user has supervisor role
    //#########################################
    if (Utils.isEmptyString(luIsSupervisor.getPKey())) {
      me.setIsSupervisor("0");
    } else {
      me.setIsSupervisor("1");
    }
  }
);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}