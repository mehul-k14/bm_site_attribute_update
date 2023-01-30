var System = require('dw/system');
var Site = require('dw/system/Site').getCurrent();
var hostName = System.Site.current.httpHostName;
var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');


function createToken() {
    var service = LocalServiceRegistry.createService('Create_Token', {
        createRequest: function (svc,params) {
            var token = (params.client_Id+':'+params.client_pass);
            var config = svc.getConfiguration();
            var credential = config.getCredential();
            var url = credential.getURL();
            url = url + 'client_id='+params.client_Id+'&client_secret='+params.client_pass+'&grant_type=client_credentials';
            svc = svc.setURL(url);
            svc = svc.setRequestMethod('POST');
            svc.addHeader('Content-Type', 'application/x-www-form-urlencoded');
            svc.addHeader('grant_type', 'client_credentials');
            svc.addHeader('Authorization', token);
        },
        parseResponse: function (svc, response) {
            return response;
        },
        filterLogMessage: function (msg) {
            return msg;
        }
    });
    return service;
}

function getAttributedefinitions() {
    var service = LocalServiceRegistry.createService('getSitespecificattributes', {
        createRequest: function (svc, params) {
            var config = svc.getConfiguration();
            var credential = config.getCredential();
            var url = credential.getURL(); 
            ///system_object_definitions/Product/attribute_definitions?
            url = 'https://' + hostName + '/s/-/dw/data/v22_8' + url+'/start=50&count=106&select=(**)';
            svc.setURL(url);
            svc.setRequestMethod('GET');
            svc.addHeader('Content-Type', 'application/json');
            svc.addHeader('Authorization', params);
        },
        parseResponse: function (svc, response) {
            return response;
        },
        filterLogMessage: function (msg) {
            return msg;
        }
    });
    return service;
}

function AttributesUpdate(){
    var service = LocalServiceRegistry.createService('ocapi_job_automation', {
        createRequest: function (svc, params) {
            var url = 'https://'+ hostName +'/s/-/dw/data/v22_8/jobs/Attributes_update/executions'; 
            svc = svc.setURL(url);
            svc = svc.setRequestMethod('POST');
            svc.addHeader('Content-Type', 'application/json');
            svc.addHeader('Accept', 'application/json');
            svc.addHeader('Authorization', params.Token);
            return JSON.stringify(params.payload);
        },
        parseResponse: function (svc, response) {
            return response;
        },
        filterLogMessage: function (msg) {
            return msg;
        }
    });
    return service;
}

module.exports = {
    createToken: createToken,
    getAttributedefinitions: getAttributedefinitions,
    AttributesUpdate:AttributesUpdate
}