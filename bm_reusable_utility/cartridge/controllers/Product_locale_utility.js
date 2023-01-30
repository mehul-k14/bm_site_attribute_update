'use strict';

/* Script Modules */
var app = require('*/cartridge/scripts/app');
var guard = require('*/cartridge/scripts/guard');
var Resource = require('dw/web/Resource');
var Response = require('~/cartridge/scripts/util/Response');
var StringUtils = require('dw/util/StringUtils');
var URLUtils = require('dw/web/URLUtils');
var Logger = require('dw/system/Logger').getLogger('paymentgateway');
var Site = require('dw/system/Site');
/**
 * Renders the transaction overview in business manager
 */
exports.Show = guard.ensure(['get', 'https'], function () {
    var parameterMap = request.httpParameterMap;
    var AllSites = Site.getAllSites();
    var SiteIds = [];
    for (let i = 0; i < AllSites.length; i++) {
        SiteIds.push(AllSites[i].name);
    }
    app.getView({
        SiteIds: SiteIds,
    }).render('locale_forms/product_locale');
});

exports.GetFormData = guard.ensure(['post', 'https'], function () {
    var parameterMap = request.httpParameterMap;
    var controller_flag = parameterMap.controller_flag;
    var AllSites = Site.getAllSites();
    var CurrentSite = Site.getCurrent();
    var ProductMgr = require('dw/catalog/ProductMgr');
    var AllowedLocales = CurrentSite.getAllowedLocales();
    var Data = JSON.parse(parameterMap.data);
    var formData = Data.data;

    // if (!formData.controller_flag) {
    var ArrayList = require('dw/util/ArrayList');
    var pids = formData.data;
    var flag = false;
    var index = [];
    for (let i = 0; i < pids.length; i++) {
        let product = ProductMgr.getProduct(pids[i]);

        if (!product) {
            flag = true;
            index.push(i + 1);
        }

    }

    Response.renderJSON({
        pids: pids,
        index: index,
        flag: flag,
    })
   
});

exports.GetAttributes = guard.ensure(['get', 'https'], function () {
    var pr = dw.system.System.getPreferences();
    var ProductMgr = require('dw/catalog/ProductMgr');
    var parameterMap = request.httpParameterMap;
    var svcresult = {};
    var BearerToken;
    var sampleService = require('*/cartridge/scripts/svc/service.js')
    var token = sampleService.createToken();
    var tokenResponse = token.call(pr.custom);
    var formData = JSON.parse(parameterMap.data);

    var pids = formData.data;
    var flag = false;
    var index = [];
    for (let i = 0; i < pids.length; i++) {
        let product = ProductMgr.getProduct(pids[i]);

        if (!product) {
            flag = true;
            index.push(i + 1);
        }

    }
    if (flag) {
         return Response.renderJSON({
            index: index,
            flag: flag,
        });
    }
    else {
        if (tokenResponse.ok) {
            var tokenData = JSON.parse(tokenResponse.object.text);
            BearerToken = tokenData.token_type + ' ' + tokenData.access_token;
        }

        var getAttributes = sampleService.getAttributedefinitions();
        var getAttributesresponse = getAttributes.call(BearerToken);

        if (getAttributesresponse.ok) {
            var obj = JSON.parse(getAttributesresponse.object.text);
        }
    

        Response.renderJSON({
            obj: obj.data,
            index: index,
            flag: flag
        });
    }
});


exports.CheckCatalog = guard.ensure(['post', 'https'], function () {
    var parameterMap = request.httpParameterMap;
    var CatalogMgr = require('dw/catalog/CatalogMgr');
    var Response = require('~/cartridge/scripts/util/Response');
    
    var flag = false;
    var catalogId = JSON.parse(parameterMap.data);
    var catalog = CatalogMgr.getCatalog(catalogId.trim());

    if(!catalog){
        flag = true;
    }
    
    Response.renderJSON({
        flag: flag
    });

  
});

exports.SubmitData = guard.ensure(['post', 'https'], function () {
    var pr = dw.system.System.getPreferences();
    var Site = require('dw/system/Site').getCurrent();
    var System = require('dw/system');
    var Logger = require('dw/system/Logger');
    var URLUtils = require('dw/web/URLUtils');
    var parameterMap = request.httpParameterMap;
    var Response = require('~/cartridge/scripts/util/Response');
    var getXML = require('*/cartridge/scripts/helpers/generateXML');
    var attr_infos = JSON.parse(parameterMap.data);
    var catalogId = attr_infos[attr_infos.length-1];
    //removing last element
    attr_infos.pop();
    //generating XML
    getXML.generateXML(attr_infos, catalogId);

    // changing values
    var pr = dw.system.System.getPreferences();
    var svcresult = {};
    var BearerToken;
    var sampleService = require('*/cartridge/scripts/svc/service.js')
    var token = sampleService.createToken();
    var tokenResponse = token.call(pr.custom);

    if (tokenResponse.ok) {
        var tokenData = JSON.parse(tokenResponse.object.text);
        BearerToken = tokenData.token_type + ' ' + tokenData.access_token;
    }

    var obj = {
        Token: BearerToken,
        payload: "parameters"[
            {
                "name": "WorkingFolder",
                "value": "attributesUpdate"
            },
            {
                "name": "FileName",
                "value": "attributes.xml"
            }
        ]
    }
    var svc = sampleService.AttributesUpdate();
    var svcResponse = svc.call(obj);
    if (svcResponse.ok) {

        var msg ={ msg: Resource.msg('label.job.response.ok', 'locale', null)}
    }
    else {
        var msg ={ msg: Resource.msg('label.job.response.notok', 'locale', null)};
    }

    Response.renderJSON({
        data: msg
    });
});


