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
    var SiteIds=[];
    for(let i=0; i<AllSites.length; i++){
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
    var formData = JSON.parse(parameterMap.parameterNames[0])

    if(!formData.controller_flag){ 
        var ArrayList = require('dw/util/ArrayList');
        var pids = formData.data;
        var flag = false;
        var index = [];
        var pids_status = [];
        for(let i=0; i<pids.length; i++){
            let product = ProductMgr.getProduct(pids[i]);

            pids_status.push({
                isOnline : product.online,
                isSearchable : product.searchable
            }) 

            if(!product)
            {
                flag = true;
                index.push(i+1);
            }
        
        }

        if(flag){
            return Response.renderJSON({
                index:index,
                flag:flag
            });
        }
        Response.renderJSON({
            pids:pids,
            flag:flag,
            pids_status:pids_status
        })
    }

    if(formData.controller_flag){
        var data = formData.data;
        // var ArrayList = require('dw/util/ArrayList');
        for(let i=0; i<formData.pid_len; i++){
            for(let j=0; j<formData.Site_len; j++){

                var pid  = data[i].pid;
            }
        }
        var products = formData.productIds;
        var Sites = formData.SiteNames;
        // var pids = productData[0];
        // var siteNames = productData[1];
    
        
        Response.renderJSON({ 
            productData: productData
        });

    }
    
});

exports.GetAttributes  = guard.ensure(['get','https'], function () {
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

    var getAttributes = sampleService.getAttributedefinitions();
    var getAttributesresponse = getAttributes.call(BearerToken);

    if(getAttributesresponse.ok){
        var obj = JSON.parse(getAttributesresponse.object.text);
    }
    
    Response.renderJSON({ 
        obj:obj.data
    });

})


