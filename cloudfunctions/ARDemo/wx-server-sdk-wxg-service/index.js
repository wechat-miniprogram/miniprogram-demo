module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/api/inner/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/api/inner/api/api.ts":
/*!**********************************!*\
  !*** ./src/api/inner/api/api.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getAPIs = void 0;
const callWXInnerAPI_1 = __webpack_require__(/*! ./callWXInnerAPI */ "./src/api/inner/api/callWXInnerAPI.ts");
const callWXSvrkit_1 = __webpack_require__(/*! ./callWXSvrkit */ "./src/api/inner/api/callWXSvrkit.ts");
const callSvrkit_1 = __webpack_require__(/*! ./callSvrkit */ "./src/api/inner/api/callSvrkit.ts");
const callTencentInnerAPI_1 = __webpack_require__(/*! ./callTencentInnerAPI */ "./src/api/inner/api/callTencentInnerAPI.ts");
function getAPIs(cloud) {
    return {
        callWXInnerAPI: callWXInnerAPI_1.default(cloud),
        callWXSvrkit: callWXSvrkit_1.default(cloud),
        callSvrkit: callSvrkit_1.default(cloud),
        callTencentInnerAPI: callTencentInnerAPI_1.default(cloud),
    };
}
exports.getAPIs = getAPIs;


/***/ }),

/***/ "./src/api/inner/api/callSvrkit.ts":
/*!*****************************************!*\
  !*** ./src/api/inner/api/callSvrkit.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// @deprecated kainniu api
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = __webpack_require__(/*! utils/error */ "./src/utils/error.ts");
const msg_1 = __webpack_require__(/*! utils/msg */ "./src/utils/msg.ts");
const openapi_1 = __webpack_require__(/*! ../../../protobuf/openapi */ "./src/protobuf/openapi.js");
const error_config_1 = __webpack_require__(/*! config/error.config */ "./src/config/error.config.ts");
const API_NAME = 'callSvrkit';
function getCallSvrkit(cloud) {
    return function callSvrkit(options) {
        return new Promise(async (resolve, reject) => {
            if (!options) {
                return reject(error_1.returnAsFinalCloudSDKError({
                    errMsg: 'Params for callSvrkit must be an object instead of ' + typeof options,
                }, API_NAME));
            }
            try {
                if (!options.pbInstance) {
                    throw new Error('pbInstance must be provided');
                }
            }
            catch (e) {
                return reject(error_1.returnAsFinalCloudSDKError(e, API_NAME));
            }
            try {
                const svrkitData = {
                    apiName: options.pbInstance.data.apiName,
                    reqData: options.pbInstance.data.reqBodyBuffer,
                };
                const pbMessage = openapi_1.CommApiData.encode({
                    apiType: openapi_1.CommApiData.ApiType.SVRKIT_API,
                    svrkitData,
                }).finish();
                const wxResp = await cloud.provider.api.callWXOpenAPI({
                    api: API_NAME,
                    data: Buffer.from(pbMessage),
                }, {
                    instance: cloud.instance,
                });
                let svrkitResponse;
                let svrkitResponseBuffer;
                let svrkitErrCode = 0;
                if (wxResp) {
                    if (wxResp.errorCode) {
                        // wx system error, for example: no permission
                        throw new error_1.CloudSDKError({
                            errCode: error_config_1.ERR_CODE[error_config_1.ERR_CODE[wxResp.errorCode]] || wxResp.errorCode,
                            errMsg: `${error_config_1.ERR_CODE[error_config_1.ERR_CODE.WX_SYSTEM_ERROR]}: error code: ${wxResp.errorCode}`
                        });
                    }
                    else {
                        svrkitErrCode = wxResp.svrkitErrorCode;
                        if (wxResp.svrkitErrorCode !== 0) {
                            throw {
                                errCode: error_config_1.ERR_CODE.WX_SYSTEM_ERROR,
                                errMsg: `internal svrkit error, code ${wxResp.svrkitErrorCode}`,
                            };
                        }
                        if (!wxResp.respData) {
                            throw {
                                errCode: error_config_1.ERR_CODE.WX_SYSTEM_ERROR,
                                errMsg: `internal svrkit error, empty respData`,
                            };
                        }
                        svrkitResponseBuffer = wxResp.respData;
                        const pbRespMsg = options.pbInstance.resProto.decode(wxResp.respData);
                        if (options.convertResp && options.convertResp.bytes === false) {
                            if (!options.pbInstance.resProto) {
                                throw new Error('please ensure \'pbInstance\' is generated using @tencent/cloud-functions-tools whose version is greater or equal to 1.3.0');
                            }
                            svrkitResponse = options.pbInstance.resProto.toObject(pbRespMsg, {
                                long: String
                            });
                        }
                        else {
                            svrkitResponse = pbRespMsg.toJSON();
                        }
                    }
                }
                resolve({
                    svrkitErrCode,
                    svrkitResponse,
                    svrkitResponseBuffer,
                    errMsg: msg_1.apiSuccessMsg(API_NAME),
                    errCode: 0,
                });
            }
            catch (e) {
                const error = error_1.returnAsFinalCloudSDKError(e, API_NAME);
                return reject(error);
            }
        });
    };
}
exports.default = getCallSvrkit;


/***/ }),

/***/ "./src/api/inner/api/callTencentInnerAPI.ts":
/*!**************************************************!*\
  !*** ./src/api/inner/api/callTencentInnerAPI.ts ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __webpack_require__(/*! utils/assert */ "./src/utils/assert.ts");
const error_1 = __webpack_require__(/*! utils/error */ "./src/utils/error.ts");
const msg_1 = __webpack_require__(/*! utils/msg */ "./src/utils/msg.ts");
const openapi_1 = __webpack_require__(/*! ../../../protobuf/openapi */ "./src/protobuf/openapi.js");
const error_config_1 = __webpack_require__(/*! config/error.config */ "./src/config/error.config.ts");
const utils_1 = __webpack_require__(/*! utils/utils */ "./src/utils/utils.ts");
const getHTTPMethodNumber = (method) => {
    switch (method.toLowerCase()) {
        case 'get': {
            return openapi_1.HTTP_METHODS.HTTP_GET;
        }
        case 'post': {
            return openapi_1.HTTP_METHODS.HTTP_POST;
        }
        case 'put': {
            return openapi_1.HTTP_METHODS.HTTP_PUT;
        }
        case 'patch': {
            return openapi_1.HTTP_METHODS.HTTP_PATCH;
        }
        case 'head': {
            return openapi_1.HTTP_METHODS.HTTP_HEAD;
        }
        case 'delete': {
            return openapi_1.HTTP_METHODS.HTTP_DELETE;
        }
        default: {
            throw new Error(`unsupported HTTP method ${method}`);
        }
    }
};
const API_NAME = 'callTencentInnerAPI';
function getCallTencentInnerAPI(cloud) {
    return function callTencentInnerAPI(options) {
        const apiName = 'callTencentInnerAPI';
        return new Promise(async (resolve, reject) => {
            if (!options) {
                return reject(error_1.returnAsFinalCloudSDKError({
                    errMsg: 'Params for callTencentInnerAPI must be an object instead of ' + typeof options,
                }, apiName));
            }
            try {
                assert_1.assertType(options, {
                    modid: 'number',
                    cmdid: 'number',
                    path: 'string',
                    method: 'string',
                });
                if (options.headers) {
                    assert_1.assertType(options, {
                        headers: 'object',
                    });
                }
            }
            catch (e) {
                return reject(error_1.returnAsFinalCloudSDKError(e, apiName));
            }
            try {
                const innerData = {
                    modid: options.modid,
                    cmdid: options.cmdid,
                    url: options.path,
                    method: getHTTPMethodNumber(options.method),
                    useHttps: options.https,
                    headers: [],
                };
                if (options.headers) {
                    for (const key in options.headers) {
                        innerData.headers.push(`${key.toLowerCase()}: ${options.headers[key]}`);
                    }
                }
                if (options.body) {
                    // @ts-ignore
                    innerData.body = Buffer.from(options.body);
                }
                const pbMessage = openapi_1.CommApiData.encode({
                    apiType: openapi_1.CommApiData.ApiType.INNER_API,
                    innerData,
                }).finish();
                const wxResp = await cloud.provider.api.callWXOpenAPI({
                    api: API_NAME,
                    data: Buffer.from(pbMessage),
                }, {
                    // this is the new protocol
                    instance: cloud.instance,
                    // @deprecated
                    // the following 2 lines are deprecated, for compatibility only
                    // to be deleted.
                    defaultConfig: utils_1.getServiceConfigFromDefaultConfig(cloud.config),
                    apiConfig: options.config,
                    // @ts-ignore
                    version: options.apiVersion || 'v2',
                });
                let body;
                let contentType = '';
                let statusCode;
                let rawHeaders = [];
                let err;
                if (wxResp) {
                    if (options.autoParse) {
                        if (/application\/json/.test(wxResp.contentType)) {
                            // json response
                            try {
                                body = JSON.parse(wxResp.respData.toString());
                            }
                            catch (parseWXRespJSONError) {
                                // wx server says it's a json but instead it is not a valid json
                                throw new error_1.CloudSDKError({
                                    errCode: error_config_1.ERR_CODE.WX_SYSTEM_ERROR,
                                    errMsg: msg_1.apiFailMsg(API_NAME, `response body is not a valid json: ${wxResp.respData.toString()}`)
                                });
                            }
                        }
                        else if (/text\/plain/.test(wxResp.contentType)) {
                            // text response
                            body = wxResp.respData.toString();
                        }
                    }
                    if (!body) {
                        // buffer body
                        body = wxResp.respData;
                    }
                    if (wxResp.contentType) {
                        contentType = wxResp.contentType.trim();
                    }
                    if (wxResp.httpCode) {
                        statusCode = wxResp.httpCode;
                    }
                    if (wxResp.headers) {
                        // @ts-ignore
                        rawHeaders = wxResp.headers;
                    }
                }
                else {
                    throw {
                        errCode: error_config_1.ERR_CODE.WX_SYSTEM_ERROR,
                        errMsg: `internal server error, empty resp buffer`,
                    };
                }
                if (err) {
                    reject(err);
                    return;
                }
                resolve({
                    body,
                    contentType,
                    statusCode,
                    rawHeaders,
                    errMsg: msg_1.apiSuccessMsg(API_NAME),
                    errCode: 0,
                });
            }
            catch (e) {
                const error = error_1.returnAsFinalCloudSDKError(e, apiName);
                return reject(error);
            }
        });
    };
}
exports.default = getCallTencentInnerAPI;


/***/ }),

/***/ "./src/api/inner/api/callWXInnerAPI.ts":
/*!*********************************************!*\
  !*** ./src/api/inner/api/callWXInnerAPI.ts ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __webpack_require__(/*! utils/assert */ "./src/utils/assert.ts");
const error_1 = __webpack_require__(/*! utils/error */ "./src/utils/error.ts");
const msg_1 = __webpack_require__(/*! utils/msg */ "./src/utils/msg.ts");
function getCallWXInnerAPI(cloud) {
    return function callWXInnerAPI(options) {
        const apiName = 'callWXInnerAPI';
        return new Promise(async (resolve, reject) => {
            if (!options) {
                return reject(error_1.returnAsFinalCloudSDKError({
                    errMsg: 'Params for callWXInnerAPI must be an object instead of ' + typeof options,
                }, apiName));
            }
            try {
                assert_1.assertType(options, {
                    cmdid: 'number'
                });
            }
            catch (e) {
                return reject(error_1.returnAsFinalCloudSDKError(e, apiName));
            }
            try {
                const result = await cloud.getAPIs().callOpenAPI({
                    api: '/inner/wxtransfer',
                    data: {
                        cmdid: options.cmdid,
                        req_data: JSON.stringify(options.data || {}),
                    },
                    config: options.config,
                });
                let parsedResult = result.result;
                try {
                    if (typeof parsedResult === 'string') {
                        parsedResult = JSON.parse(parsedResult);
                    }
                }
                catch (_) {
                    // no nothing
                }
                return resolve({
                    result: parsedResult,
                    errMsg: msg_1.apiSuccessMsg(apiName),
                });
            }
            catch (e) {
                const error = error_1.returnAsFinalCloudSDKError(e, apiName);
                return reject(error);
            }
        });
    };
}
exports.default = getCallWXInnerAPI;


/***/ }),

/***/ "./src/api/inner/api/callWXSvrkit.ts":
/*!*******************************************!*\
  !*** ./src/api/inner/api/callWXSvrkit.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __webpack_require__(/*! utils/assert */ "./src/utils/assert.ts");
const error_1 = __webpack_require__(/*! utils/error */ "./src/utils/error.ts");
const msg_1 = __webpack_require__(/*! utils/msg */ "./src/utils/msg.ts");
function getCallWXSvrkit(cloud) {
    return function callWXSvrkit(options) {
        const apiName = 'callWXSvrkit';
        return new Promise(async (resolve, reject) => {
            if (!options) {
                return reject(error_1.returnAsFinalCloudSDKError({
                    errMsg: 'Params for callWXSvrkit must be an object instead of ' + typeof options,
                }, apiName));
            }
            const pbInstance = options.pbInstance;
            if (pbInstance) {
                options = Object.assign(Object.assign({}, options), pbInstance.data);
                delete options.pbInstance;
            }
            try {
                assert_1.assertType(options, {
                    serviceName: 'string',
                    funcName: 'string',
                    magic: 'number',
                    cmdid: 'number',
                });
            }
            catch (e) {
                return reject(error_1.returnAsFinalCloudSDKError(e, apiName));
            }
            try {
                const result = await cloud.getAPIs().callOpenAPI({
                    api: '/inner/svrkitclientcall',
                    data: {
                        req_body_buffer: options.reqBodyBuffer.toString('base64'),
                        service_name: options.serviceName,
                        func_name: options.funcName,
                        magic: options.magic,
                        cmdid: options.cmdid,
                        headuin: options.headuin,
                        route_method: options.routeMethod,
                        idc_route_method: options.idcRouteMethod,
                        exist_resp: options.existResp,
                    },
                    config: options.config,
                    timeout: options.timeout,
                    retryOptions: options.retryOptions,
                });
                // @ts-ignore
                let parsedResult = result.result;
                if (parsedResult.baseresponse && parsedResult.baseresponse.errcode !== 0) {
                    parsedResult.ret = parsedResult.baseresponse.errcode;
                }
                if (parsedResult.ret === 0) {
                    parsedResult.respBodyBuffer = Buffer.from(parsedResult.resp_body_buffer, 'base64');
                    delete parsedResult.resp_body_buffer;
                    if (pbInstance && options.existResp) {
                        const pbRespMsg = pbInstance.decode(parsedResult.respBodyBuffer);
                        if (options.convertResp && options.convertResp.bytes === false) {
                            if (!pbInstance.resProto) {
                                throw new Error('please ensure \'pbInstance\' is generated using @tencent/cloud-functions-tools whose version is greater or equal to 1.3.0');
                            }
                            parsedResult.respBody = pbInstance.resProto.toObject(pbRespMsg, {
                                long: String
                            });
                        }
                        else {
                            parsedResult.respBody = pbRespMsg.toJSON();
                        }
                    }
                }
                const returnValue = {
                    ret: parsedResult.ret,
                    result: parsedResult.result,
                    respBodyBuffer: parsedResult.respBodyBuffer,
                    respBody: parsedResult.respBody,
                    errMsg: msg_1.apiSuccessMsg(apiName),
                };
                resolve(returnValue);
            }
            catch (e) {
                const error = error_1.returnAsFinalCloudSDKError(e, apiName);
                return reject(error);
            }
        });
    };
}
exports.default = getCallWXSvrkit;


/***/ }),

/***/ "./src/api/inner/index.ts":
/*!********************************!*\
  !*** ./src/api/inner/index.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.createService = exports.SERVICE_NAME = void 0;
const api_1 = __webpack_require__(/*! ./api/api */ "./src/api/inner/api/api.ts");
exports.SERVICE_NAME = 'inner';
function createService(cloud) {
    return {
        name: exports.SERVICE_NAME,
        getAPIs: api_1.getAPIs.bind(null, cloud),
    };
}
exports.createService = createService;
exports.default = createService;


/***/ }),

/***/ "./src/api/utils/api/signature.ts":
/*!****************************************!*\
  !*** ./src/api/utils/api/signature.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.MidasSignature = exports.signature = void 0;
const crypto = __webpack_require__(/*! crypto */ "crypto");
const utils_1 = __webpack_require__(/*! utils/utils */ "./src/utils/utils.ts");
function signature(options) {
    switch (options.type) {
        case 'midas': {
            return new MidasSignature(options);
        }
    }
}
exports.signature = signature;
class MidasSignature {
    constructor(options) {
        this.type = 'midas';
        if (!options.params || !Array.isArray(options.params)) {
            throw new Error('options.params must be a string array');
        }
        if (!options.secret) {
            throw new Error('options.secret must be provided');
        }
        this.params = options.params;
        this.secret = options.secret;
    }
    compute(cgiPath, method, secret, paramValues) {
        // sort params by ascii
        const paramNames = [...this.params].sort().map(name => utils_1.convertCase(name, {
            from: 'camelcase',
            to: 'snakecase',
        }));
        // get params string
        const paramStr = paramNames.map(paramName => {
            if (!paramValues.hasOwnProperty(paramName)) {
                throw new Error(`Cannot compute signature: lack of param '${paramName}'`);
            }
            return `${paramName}=${paramValues[paramName]}`;
        }).join('&');
        // concatenate params string, cgi path, and midas secret
        const signSource = paramStr + `&org_loc=${cgiPath}&method=${method}&secret=${secret}`;
        // sign
        const signature = crypto.createHmac('sha256', secret).update(signSource).digest('hex');
        return signature;
    }
}
exports.MidasSignature = MidasSignature;
exports.default = signature;


/***/ }),

/***/ "./src/config/error.config.ts":
/*!************************************!*\
  !*** ./src/config/error.config.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TCB_ERR_CODE = exports.ERR_CODE = void 0;
exports.ERR_CODE = {
    '-1': 'unknown error',
    UNKNOWN_ERROR: -1,
    // 以 6 开始的是由微信服务器侧产生的错误码
    // 以 5 开始的是由腾讯云侧产生的错误码
    // 以 4 开始的是本地 SDK 产生的错误
    // 接下来两位表示具体业务类型：01通用，02数据库，03文件，04云函数
    // 最后三位表示具体的错误
    // 小程序 SDK 云函数
    '-404001': 'empty call result',
    SDK_FUNCTIONS_EMPTY_CALL_RESULT: -404001,
    '-404002': 'empty event id',
    SDK_FUNCTIONS_EMPTY_EVENT_ID: -404002,
    '-404003': 'empty poll url',
    SDK_FUNCTIONS_EMPTY_POLL_URL: -404003,
    '-404004': 'empty poll result json',
    SDK_FUNCTIONS_EMPTY_POLL_RESULT_JSON: -404004,
    '-404005': 'exceed max poll retry',
    SDK_FUNCTIONS_EXCEED_MAX_POLL_RETRY: -404005,
    '-404006': 'empty poll result base resp',
    SDK_FUNCTIONS_EMPTY_POLL_RESULT_BASE_RESP: -404006,
    '-404007': 'error while polling for the result, poll result base resp ret %s',
    SDK_FUNCTIONS_POLL_RESULT_BASE_RESP_RET_ABNORMAL: -404007,
    '-404008': 'error while polling for the result, polling server return a status code of %s',
    SDK_FUNCTIONS_POLL_RESULT_STATUS_CODE_ERROR: -404008,
    '-404009': 'error while polling for the result: %s',
    SDK_FUNCTIONS_POLL_ERROR: -404009,
    // 微信服务器
    '-601001': 'system error',
    WX_SYSTEM_ERROR: -601001,
    '-601002': 'system args error',
    WX_SYSTEM_ARGS_ERROR: -601002,
    '-601003': 'system network error',
    WX_SYSTEM_NETWORK_ERROR: -601003,
    '-601004': 'api permission denied',
    WX_API_PERMISSION_DENIED: -601004,
    '-601005': 'invalid cloudID',
    WX_INVALID_CLOUDID: -601005,
    '-601006': 'cloudID expired',
    WX_CLOUDID_EXPIRED: -601006,
    '-601007': 'cloudID and calling user does not match',
    WX_CLOUDID_USER_NOT_MATCH: -601007,
    '-601008': 'server-side request timedout',
    WX_SERVER_REQUEST_TIMEOUT: -601008,
    '-601009': 'missing mobile phone',
    WX_MISSING_MOBILE_PHONE: -601009,
    '-601010': 'no write permission',
    WX_NO_WRITE_PERMISSION: -601010,
    '-601011': 'no privilege permission',
    WX_NO_PRIVILEGE_PERMISSION: -601011,
    '-601012': 'unauthorized env',
    WX_UNAUTHORIZED_ENV: -601012,
    '-601013': 'no multiend permission',
    WX_NO_MULTIEND_PERMISSION: -601013,
    '-601015': 'access denied (cloudfunction cloudbase_auth returns empty errCode)',
    WX_CLOUDBASE_AUTH_RETURN_EMPTY_ERRCODE: -601015,
    '-601016': 'missing env auth info',
    WX_MISSING_ENV_AUTH_INFO: -601016,
    '-601017': 'access denied (cloudbase_auth returns non-zero errCode)',
    WX_CLOUDBASE_AUTH_RETURN_NON_ZERO_ERRCODE: -601017,
    '-602018': 'unauthorized API',
    WX_UNAUTHORIZED_API: -601018,
    '-602001': 'database query result size exceed limit (1MB)',
    WX_DATABASE_QUERY_SIZE_EXCEED_LIMIT: -602001,
    '-604001': 'cloudfunction result size exceed limit (1MB)',
    WX_CLOUDFUNCTION_RESULT_SIZE_EXCEED_LIMIT: -604001,
    '-604100': 'API not found',
    WX_FUNCTIONS_SERVER_OPENAPI_NOT_FOUND: -604100,
    '-604101': 'function has no permission to call this API',
    WX_FUNCTIONS_SERVER_OPENAPI_NO_PERMISSION: -604101,
    '-604102': 'call open API timeout',
    WX_FUNCTIONS_SERVER_OPENAPI_TIMEOUT: -604102,
    '-604103': 'call open API system error',
    WX_FUNCTIONS_SERVER_OPENAPI_SYSTEM_ERROR: -604103,
    '-604104': 'illegal source of invocation',
    WX_FUNCTIONS_SERVER_OPENAPI_ILLEGAL_INVOCATION_SOURCE: -604104,
    // 腾讯云通用
    '-501001': 'resource system error',
    TCB_RESOURCE_SYSTEM_ERROR: -501001,
    '-501002': 'resource server timeout',
    TCB_RESOURCE_SERVER_TIMEOUT: -501002,
    '-501003': 'exceed request limit',
    TCB_EXCEED_REQUEST_LIMIT: -501003,
    '-501004': 'exceed concurrent request limit',
    TCB_EXCEED_CONCURRENT_REQUEST_LIMIT: -501004,
    '-501005': 'invalid env',
    TCB_INVALID_ENV: -501005,
    '-501006': 'invalid common parameters',
    TCB_INVALID_COMMON_PARAM: -501006,
    '-501007': 'invalid parameters',
    TCB_INVALID_PARAM: -501007,
    '-501008': 'invalid request source',
    TCB_INVALID_REQUEST_SOURCE: -501008,
    '-501009': 'resource not initialized',
    TCB_RESOURCE_NOT_INITIALIZED: -501009,
    // 腾讯云数据库
    '-502001': 'database request fail',
    TCB_DB_REQUEST_FAIL: -502001,
    '-502002': 'database invalid command',
    TCB_DB_INVALID_COMMAND: -502002,
    '-502003': 'database permission denied',
    TCB_DB_PERMISSION_DENIED: -502003,
    '-502004': 'database exceed collection limit',
    TCB_DB_EXCEED_COLLECTION_LIMIT: -502004,
    '-502005': 'database collection not exists',
    TCB_DB_COLLECTION_NOT_EXISTS: -502005,
    // 腾讯云文件管理
    '-503001': 'storage request fail',
    TCB_STORAGE_REQUEST_FAIL: -503001,
    '-503002': 'storage permission denied',
    TCB_STORAGE_PERMISSION_DENIED: -503002,
    '-503003': 'storage file not exists',
    TCB_STORAGE_FILE_NOT_EXISTS: -503003,
    '-503004': 'storage invalid sign parameter',
    TCB_STORAGE_INVALID_SIGN_PARAM: -503004,
    // 腾讯云云函数
    '-504001': 'functions request fail',
    TCB_FUNCTIONS_REQUEST_FAIL: -504001,
    '-504002': 'functions execute fail',
    TCB_FUNCTIONS_EXEC_FAIL: -504002,
};
exports.TCB_ERR_CODE = {
    // 通用
    SUCCESS: 0,
    SYS_ERR: -501001,
    SERVER_TIMEOUT: -501002,
    EXCEED_REQUEST_LIMIT: -501003,
    EXCEED_CONCURRENT_REQUEST_LIMIT: -501004,
    INVALIID_ENV: -501005,
    INVALID_COMMON_PARAM: -501006,
    INVALID_PARAM: -501007,
    INVALID_REQUEST_SOURCE: -501008,
    RESOURCE_NOT_INITIAL: -501009,
    // 数据库
    DATABASE_REQUEST_FAILED: -502001,
    DATABASE_INVALID_OPERRATOR: -502002,
    DATABASE_PERMISSION_DENIED: -502003,
    DATABASE_COLLECTION_EXCEED_LIMIT: -502004,
    DATABASE_COLLECTION_NOT_EXIST: -502005,
    // 文件
    STORAGE_REQUEST_FAIL: -503001,
    STORAGE_EXCEED_AUTHORITY: -503002,
    STORAGE_FILE_NONEXIST: -503003,
    STORAGE_SIGN_PARAM_INVALID: -503004,
    // 云函数
    FUNCTIONS_REQUEST_FAIL: -504001,
    FUNCTIONS_EXECUTE_FAIL: -504002,
};


/***/ }),

/***/ "./src/protobuf/openapi.js":
/*!*********************************!*\
  !*** ./src/protobuf/openapi.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/


var $protobuf = __webpack_require__(/*! protobufjs/minimal */ "protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.KeyValuePair = (function() {

    /**
     * Properties of a KeyValuePair.
     * @exports IKeyValuePair
     * @interface IKeyValuePair
     * @property {string|null} [key] KeyValuePair key
     * @property {Uint8Array|null} [value] KeyValuePair value
     * @property {string|null} [contenttype] KeyValuePair contenttype
     * @property {string|null} [filename] KeyValuePair filename
     */

    /**
     * Constructs a new KeyValuePair.
     * @exports KeyValuePair
     * @classdesc Represents a KeyValuePair.
     * @implements IKeyValuePair
     * @constructor
     * @param {IKeyValuePair=} [properties] Properties to set
     */
    function KeyValuePair(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * KeyValuePair key.
     * @member {string} key
     * @memberof KeyValuePair
     * @instance
     */
    KeyValuePair.prototype.key = "";

    /**
     * KeyValuePair value.
     * @member {Uint8Array} value
     * @memberof KeyValuePair
     * @instance
     */
    KeyValuePair.prototype.value = $util.newBuffer([]);

    /**
     * KeyValuePair contenttype.
     * @member {string} contenttype
     * @memberof KeyValuePair
     * @instance
     */
    KeyValuePair.prototype.contenttype = "";

    /**
     * KeyValuePair filename.
     * @member {string} filename
     * @memberof KeyValuePair
     * @instance
     */
    KeyValuePair.prototype.filename = "";

    /**
     * Creates a new KeyValuePair instance using the specified properties.
     * @function create
     * @memberof KeyValuePair
     * @static
     * @param {IKeyValuePair=} [properties] Properties to set
     * @returns {KeyValuePair} KeyValuePair instance
     */
    KeyValuePair.create = function create(properties) {
        return new KeyValuePair(properties);
    };

    /**
     * Encodes the specified KeyValuePair message. Does not implicitly {@link KeyValuePair.verify|verify} messages.
     * @function encode
     * @memberof KeyValuePair
     * @static
     * @param {IKeyValuePair} message KeyValuePair message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    KeyValuePair.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.key != null && message.hasOwnProperty("key"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.key);
        if (message.value != null && message.hasOwnProperty("value"))
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.value);
        if (message.contenttype != null && message.hasOwnProperty("contenttype"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.contenttype);
        if (message.filename != null && message.hasOwnProperty("filename"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.filename);
        return writer;
    };

    /**
     * Encodes the specified KeyValuePair message, length delimited. Does not implicitly {@link KeyValuePair.verify|verify} messages.
     * @function encodeDelimited
     * @memberof KeyValuePair
     * @static
     * @param {IKeyValuePair} message KeyValuePair message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    KeyValuePair.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a KeyValuePair message from the specified reader or buffer.
     * @function decode
     * @memberof KeyValuePair
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {KeyValuePair} KeyValuePair
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    KeyValuePair.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.KeyValuePair();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.key = reader.string();
                break;
            case 2:
                message.value = reader.bytes();
                break;
            case 3:
                message.contenttype = reader.string();
                break;
            case 4:
                message.filename = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a KeyValuePair message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof KeyValuePair
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {KeyValuePair} KeyValuePair
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    KeyValuePair.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a KeyValuePair message.
     * @function verify
     * @memberof KeyValuePair
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    KeyValuePair.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.key != null && message.hasOwnProperty("key"))
            if (!$util.isString(message.key))
                return "key: string expected";
        if (message.value != null && message.hasOwnProperty("value"))
            if (!(message.value && typeof message.value.length === "number" || $util.isString(message.value)))
                return "value: buffer expected";
        if (message.contenttype != null && message.hasOwnProperty("contenttype"))
            if (!$util.isString(message.contenttype))
                return "contenttype: string expected";
        if (message.filename != null && message.hasOwnProperty("filename"))
            if (!$util.isString(message.filename))
                return "filename: string expected";
        return null;
    };

    /**
     * Creates a KeyValuePair message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof KeyValuePair
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {KeyValuePair} KeyValuePair
     */
    KeyValuePair.fromObject = function fromObject(object) {
        if (object instanceof $root.KeyValuePair)
            return object;
        var message = new $root.KeyValuePair();
        if (object.key != null)
            message.key = String(object.key);
        if (object.value != null)
            if (typeof object.value === "string")
                $util.base64.decode(object.value, message.value = $util.newBuffer($util.base64.length(object.value)), 0);
            else if (object.value.length)
                message.value = object.value;
        if (object.contenttype != null)
            message.contenttype = String(object.contenttype);
        if (object.filename != null)
            message.filename = String(object.filename);
        return message;
    };

    /**
     * Creates a plain object from a KeyValuePair message. Also converts values to other types if specified.
     * @function toObject
     * @memberof KeyValuePair
     * @static
     * @param {KeyValuePair} message KeyValuePair
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    KeyValuePair.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.key = "";
            if (options.bytes === String)
                object.value = "";
            else {
                object.value = [];
                if (options.bytes !== Array)
                    object.value = $util.newBuffer(object.value);
            }
            object.contenttype = "";
            object.filename = "";
        }
        if (message.key != null && message.hasOwnProperty("key"))
            object.key = message.key;
        if (message.value != null && message.hasOwnProperty("value"))
            object.value = options.bytes === String ? $util.base64.encode(message.value, 0, message.value.length) : options.bytes === Array ? Array.prototype.slice.call(message.value) : message.value;
        if (message.contenttype != null && message.hasOwnProperty("contenttype"))
            object.contenttype = message.contenttype;
        if (message.filename != null && message.hasOwnProperty("filename"))
            object.filename = message.filename;
        return object;
    };

    /**
     * Converts this KeyValuePair to JSON.
     * @function toJSON
     * @memberof KeyValuePair
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    KeyValuePair.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return KeyValuePair;
})();

$root.OpenApiData = (function() {

    /**
     * Properties of an OpenApiData.
     * @exports IOpenApiData
     * @interface IOpenApiData
     * @property {Array.<IKeyValuePair>|null} [pairs] OpenApiData pairs
     */

    /**
     * Constructs a new OpenApiData.
     * @exports OpenApiData
     * @classdesc Represents an OpenApiData.
     * @implements IOpenApiData
     * @constructor
     * @param {IOpenApiData=} [properties] Properties to set
     */
    function OpenApiData(properties) {
        this.pairs = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * OpenApiData pairs.
     * @member {Array.<IKeyValuePair>} pairs
     * @memberof OpenApiData
     * @instance
     */
    OpenApiData.prototype.pairs = $util.emptyArray;

    /**
     * Creates a new OpenApiData instance using the specified properties.
     * @function create
     * @memberof OpenApiData
     * @static
     * @param {IOpenApiData=} [properties] Properties to set
     * @returns {OpenApiData} OpenApiData instance
     */
    OpenApiData.create = function create(properties) {
        return new OpenApiData(properties);
    };

    /**
     * Encodes the specified OpenApiData message. Does not implicitly {@link OpenApiData.verify|verify} messages.
     * @function encode
     * @memberof OpenApiData
     * @static
     * @param {IOpenApiData} message OpenApiData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    OpenApiData.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.pairs != null && message.pairs.length)
            for (var i = 0; i < message.pairs.length; ++i)
                $root.KeyValuePair.encode(message.pairs[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified OpenApiData message, length delimited. Does not implicitly {@link OpenApiData.verify|verify} messages.
     * @function encodeDelimited
     * @memberof OpenApiData
     * @static
     * @param {IOpenApiData} message OpenApiData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    OpenApiData.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an OpenApiData message from the specified reader or buffer.
     * @function decode
     * @memberof OpenApiData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {OpenApiData} OpenApiData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    OpenApiData.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OpenApiData();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.pairs && message.pairs.length))
                    message.pairs = [];
                message.pairs.push($root.KeyValuePair.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an OpenApiData message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof OpenApiData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {OpenApiData} OpenApiData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    OpenApiData.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an OpenApiData message.
     * @function verify
     * @memberof OpenApiData
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    OpenApiData.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.pairs != null && message.hasOwnProperty("pairs")) {
            if (!Array.isArray(message.pairs))
                return "pairs: array expected";
            for (var i = 0; i < message.pairs.length; ++i) {
                var error = $root.KeyValuePair.verify(message.pairs[i]);
                if (error)
                    return "pairs." + error;
            }
        }
        return null;
    };

    /**
     * Creates an OpenApiData message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof OpenApiData
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {OpenApiData} OpenApiData
     */
    OpenApiData.fromObject = function fromObject(object) {
        if (object instanceof $root.OpenApiData)
            return object;
        var message = new $root.OpenApiData();
        if (object.pairs) {
            if (!Array.isArray(object.pairs))
                throw TypeError(".OpenApiData.pairs: array expected");
            message.pairs = [];
            for (var i = 0; i < object.pairs.length; ++i) {
                if (typeof object.pairs[i] !== "object")
                    throw TypeError(".OpenApiData.pairs: object expected");
                message.pairs[i] = $root.KeyValuePair.fromObject(object.pairs[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from an OpenApiData message. Also converts values to other types if specified.
     * @function toObject
     * @memberof OpenApiData
     * @static
     * @param {OpenApiData} message OpenApiData
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    OpenApiData.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.pairs = [];
        if (message.pairs && message.pairs.length) {
            object.pairs = [];
            for (var j = 0; j < message.pairs.length; ++j)
                object.pairs[j] = $root.KeyValuePair.toObject(message.pairs[j], options);
        }
        return object;
    };

    /**
     * Converts this OpenApiData to JSON.
     * @function toJSON
     * @memberof OpenApiData
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    OpenApiData.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return OpenApiData;
})();

$root.TokenApiData = (function() {

    /**
     * Properties of a TokenApiData.
     * @exports ITokenApiData
     * @interface ITokenApiData
     * @property {string|null} [resourceAppid] TokenApiData resourceAppid
     * @property {string|null} [resourceEnv] TokenApiData resourceEnv
     */

    /**
     * Constructs a new TokenApiData.
     * @exports TokenApiData
     * @classdesc Represents a TokenApiData.
     * @implements ITokenApiData
     * @constructor
     * @param {ITokenApiData=} [properties] Properties to set
     */
    function TokenApiData(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * TokenApiData resourceAppid.
     * @member {string} resourceAppid
     * @memberof TokenApiData
     * @instance
     */
    TokenApiData.prototype.resourceAppid = "";

    /**
     * TokenApiData resourceEnv.
     * @member {string} resourceEnv
     * @memberof TokenApiData
     * @instance
     */
    TokenApiData.prototype.resourceEnv = "";

    /**
     * Creates a new TokenApiData instance using the specified properties.
     * @function create
     * @memberof TokenApiData
     * @static
     * @param {ITokenApiData=} [properties] Properties to set
     * @returns {TokenApiData} TokenApiData instance
     */
    TokenApiData.create = function create(properties) {
        return new TokenApiData(properties);
    };

    /**
     * Encodes the specified TokenApiData message. Does not implicitly {@link TokenApiData.verify|verify} messages.
     * @function encode
     * @memberof TokenApiData
     * @static
     * @param {ITokenApiData} message TokenApiData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    TokenApiData.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.resourceAppid != null && message.hasOwnProperty("resourceAppid"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.resourceAppid);
        if (message.resourceEnv != null && message.hasOwnProperty("resourceEnv"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.resourceEnv);
        return writer;
    };

    /**
     * Encodes the specified TokenApiData message, length delimited. Does not implicitly {@link TokenApiData.verify|verify} messages.
     * @function encodeDelimited
     * @memberof TokenApiData
     * @static
     * @param {ITokenApiData} message TokenApiData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    TokenApiData.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a TokenApiData message from the specified reader or buffer.
     * @function decode
     * @memberof TokenApiData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {TokenApiData} TokenApiData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    TokenApiData.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.TokenApiData();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.resourceAppid = reader.string();
                break;
            case 2:
                message.resourceEnv = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a TokenApiData message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof TokenApiData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {TokenApiData} TokenApiData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    TokenApiData.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a TokenApiData message.
     * @function verify
     * @memberof TokenApiData
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    TokenApiData.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.resourceAppid != null && message.hasOwnProperty("resourceAppid"))
            if (!$util.isString(message.resourceAppid))
                return "resourceAppid: string expected";
        if (message.resourceEnv != null && message.hasOwnProperty("resourceEnv"))
            if (!$util.isString(message.resourceEnv))
                return "resourceEnv: string expected";
        return null;
    };

    /**
     * Creates a TokenApiData message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof TokenApiData
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {TokenApiData} TokenApiData
     */
    TokenApiData.fromObject = function fromObject(object) {
        if (object instanceof $root.TokenApiData)
            return object;
        var message = new $root.TokenApiData();
        if (object.resourceAppid != null)
            message.resourceAppid = String(object.resourceAppid);
        if (object.resourceEnv != null)
            message.resourceEnv = String(object.resourceEnv);
        return message;
    };

    /**
     * Creates a plain object from a TokenApiData message. Also converts values to other types if specified.
     * @function toObject
     * @memberof TokenApiData
     * @static
     * @param {TokenApiData} message TokenApiData
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    TokenApiData.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.resourceAppid = "";
            object.resourceEnv = "";
        }
        if (message.resourceAppid != null && message.hasOwnProperty("resourceAppid"))
            object.resourceAppid = message.resourceAppid;
        if (message.resourceEnv != null && message.hasOwnProperty("resourceEnv"))
            object.resourceEnv = message.resourceEnv;
        return object;
    };

    /**
     * Converts this TokenApiData to JSON.
     * @function toJSON
     * @memberof TokenApiData
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    TokenApiData.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return TokenApiData;
})();

$root.CommApiData = (function() {

    /**
     * Properties of a CommApiData.
     * @exports ICommApiData
     * @interface ICommApiData
     * @property {CommApiData.ApiType|null} [apiType] CommApiData apiType
     * @property {IOpenApiData|null} [openapiData] CommApiData openapiData
     * @property {IInnerApiData|null} [innerData] CommApiData innerData
     * @property {ISvrkitApiData|null} [svrkitData] CommApiData svrkitData
     * @property {ITokenApiData|null} [tokenData] CommApiData tokenData
     * @property {string|null} [appid] CommApiData appid
     */

    /**
     * Constructs a new CommApiData.
     * @exports CommApiData
     * @classdesc Represents a CommApiData.
     * @implements ICommApiData
     * @constructor
     * @param {ICommApiData=} [properties] Properties to set
     */
    function CommApiData(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CommApiData apiType.
     * @member {CommApiData.ApiType} apiType
     * @memberof CommApiData
     * @instance
     */
    CommApiData.prototype.apiType = 0;

    /**
     * CommApiData openapiData.
     * @member {IOpenApiData|null|undefined} openapiData
     * @memberof CommApiData
     * @instance
     */
    CommApiData.prototype.openapiData = null;

    /**
     * CommApiData innerData.
     * @member {IInnerApiData|null|undefined} innerData
     * @memberof CommApiData
     * @instance
     */
    CommApiData.prototype.innerData = null;

    /**
     * CommApiData svrkitData.
     * @member {ISvrkitApiData|null|undefined} svrkitData
     * @memberof CommApiData
     * @instance
     */
    CommApiData.prototype.svrkitData = null;

    /**
     * CommApiData tokenData.
     * @member {ITokenApiData|null|undefined} tokenData
     * @memberof CommApiData
     * @instance
     */
    CommApiData.prototype.tokenData = null;

    /**
     * CommApiData appid.
     * @member {string} appid
     * @memberof CommApiData
     * @instance
     */
    CommApiData.prototype.appid = "";

    /**
     * Creates a new CommApiData instance using the specified properties.
     * @function create
     * @memberof CommApiData
     * @static
     * @param {ICommApiData=} [properties] Properties to set
     * @returns {CommApiData} CommApiData instance
     */
    CommApiData.create = function create(properties) {
        return new CommApiData(properties);
    };

    /**
     * Encodes the specified CommApiData message. Does not implicitly {@link CommApiData.verify|verify} messages.
     * @function encode
     * @memberof CommApiData
     * @static
     * @param {ICommApiData} message CommApiData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CommApiData.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.apiType != null && message.hasOwnProperty("apiType"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.apiType);
        if (message.openapiData != null && message.hasOwnProperty("openapiData"))
            $root.OpenApiData.encode(message.openapiData, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.innerData != null && message.hasOwnProperty("innerData"))
            $root.InnerApiData.encode(message.innerData, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        if (message.svrkitData != null && message.hasOwnProperty("svrkitData"))
            $root.SvrkitApiData.encode(message.svrkitData, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
        if (message.tokenData != null && message.hasOwnProperty("tokenData"))
            $root.TokenApiData.encode(message.tokenData, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
        if (message.appid != null && message.hasOwnProperty("appid"))
            writer.uint32(/* id 6, wireType 2 =*/50).string(message.appid);
        return writer;
    };

    /**
     * Encodes the specified CommApiData message, length delimited. Does not implicitly {@link CommApiData.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CommApiData
     * @static
     * @param {ICommApiData} message CommApiData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CommApiData.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CommApiData message from the specified reader or buffer.
     * @function decode
     * @memberof CommApiData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CommApiData} CommApiData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CommApiData.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.CommApiData();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.apiType = reader.int32();
                break;
            case 2:
                message.openapiData = $root.OpenApiData.decode(reader, reader.uint32());
                break;
            case 3:
                message.innerData = $root.InnerApiData.decode(reader, reader.uint32());
                break;
            case 4:
                message.svrkitData = $root.SvrkitApiData.decode(reader, reader.uint32());
                break;
            case 5:
                message.tokenData = $root.TokenApiData.decode(reader, reader.uint32());
                break;
            case 6:
                message.appid = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a CommApiData message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CommApiData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CommApiData} CommApiData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CommApiData.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CommApiData message.
     * @function verify
     * @memberof CommApiData
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CommApiData.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.apiType != null && message.hasOwnProperty("apiType"))
            switch (message.apiType) {
            default:
                return "apiType: enum value expected";
            case 0:
            case 1:
            case 2:
            case 3:
                break;
            }
        if (message.openapiData != null && message.hasOwnProperty("openapiData")) {
            var error = $root.OpenApiData.verify(message.openapiData);
            if (error)
                return "openapiData." + error;
        }
        if (message.innerData != null && message.hasOwnProperty("innerData")) {
            var error = $root.InnerApiData.verify(message.innerData);
            if (error)
                return "innerData." + error;
        }
        if (message.svrkitData != null && message.hasOwnProperty("svrkitData")) {
            var error = $root.SvrkitApiData.verify(message.svrkitData);
            if (error)
                return "svrkitData." + error;
        }
        if (message.tokenData != null && message.hasOwnProperty("tokenData")) {
            var error = $root.TokenApiData.verify(message.tokenData);
            if (error)
                return "tokenData." + error;
        }
        if (message.appid != null && message.hasOwnProperty("appid"))
            if (!$util.isString(message.appid))
                return "appid: string expected";
        return null;
    };

    /**
     * Creates a CommApiData message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CommApiData
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CommApiData} CommApiData
     */
    CommApiData.fromObject = function fromObject(object) {
        if (object instanceof $root.CommApiData)
            return object;
        var message = new $root.CommApiData();
        switch (object.apiType) {
        case "OPEN_API":
        case 0:
            message.apiType = 0;
            break;
        case "INNER_API":
        case 1:
            message.apiType = 1;
            break;
        case "SVRKIT_API":
        case 2:
            message.apiType = 2;
            break;
        case "TOKEN_API":
        case 3:
            message.apiType = 3;
            break;
        }
        if (object.openapiData != null) {
            if (typeof object.openapiData !== "object")
                throw TypeError(".CommApiData.openapiData: object expected");
            message.openapiData = $root.OpenApiData.fromObject(object.openapiData);
        }
        if (object.innerData != null) {
            if (typeof object.innerData !== "object")
                throw TypeError(".CommApiData.innerData: object expected");
            message.innerData = $root.InnerApiData.fromObject(object.innerData);
        }
        if (object.svrkitData != null) {
            if (typeof object.svrkitData !== "object")
                throw TypeError(".CommApiData.svrkitData: object expected");
            message.svrkitData = $root.SvrkitApiData.fromObject(object.svrkitData);
        }
        if (object.tokenData != null) {
            if (typeof object.tokenData !== "object")
                throw TypeError(".CommApiData.tokenData: object expected");
            message.tokenData = $root.TokenApiData.fromObject(object.tokenData);
        }
        if (object.appid != null)
            message.appid = String(object.appid);
        return message;
    };

    /**
     * Creates a plain object from a CommApiData message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CommApiData
     * @static
     * @param {CommApiData} message CommApiData
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CommApiData.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.apiType = options.enums === String ? "OPEN_API" : 0;
            object.openapiData = null;
            object.innerData = null;
            object.svrkitData = null;
            object.tokenData = null;
            object.appid = "";
        }
        if (message.apiType != null && message.hasOwnProperty("apiType"))
            object.apiType = options.enums === String ? $root.CommApiData.ApiType[message.apiType] : message.apiType;
        if (message.openapiData != null && message.hasOwnProperty("openapiData"))
            object.openapiData = $root.OpenApiData.toObject(message.openapiData, options);
        if (message.innerData != null && message.hasOwnProperty("innerData"))
            object.innerData = $root.InnerApiData.toObject(message.innerData, options);
        if (message.svrkitData != null && message.hasOwnProperty("svrkitData"))
            object.svrkitData = $root.SvrkitApiData.toObject(message.svrkitData, options);
        if (message.tokenData != null && message.hasOwnProperty("tokenData"))
            object.tokenData = $root.TokenApiData.toObject(message.tokenData, options);
        if (message.appid != null && message.hasOwnProperty("appid"))
            object.appid = message.appid;
        return object;
    };

    /**
     * Converts this CommApiData to JSON.
     * @function toJSON
     * @memberof CommApiData
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CommApiData.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * ApiType enum.
     * @name CommApiData.ApiType
     * @enum {string}
     * @property {number} OPEN_API=0 OPEN_API value
     * @property {number} INNER_API=1 INNER_API value
     * @property {number} SVRKIT_API=2 SVRKIT_API value
     * @property {number} TOKEN_API=3 TOKEN_API value
     */
    CommApiData.ApiType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "OPEN_API"] = 0;
        values[valuesById[1] = "INNER_API"] = 1;
        values[valuesById[2] = "SVRKIT_API"] = 2;
        values[valuesById[3] = "TOKEN_API"] = 3;
        return values;
    })();

    return CommApiData;
})();

$root.CommOpenApiResp = (function() {

    /**
     * Properties of a CommOpenApiResp.
     * @exports ICommOpenApiResp
     * @interface ICommOpenApiResp
     * @property {Uint8Array|null} [respData] CommOpenApiResp respData
     * @property {string|null} [contentType] CommOpenApiResp contentType
     * @property {number|null} [errorCode] CommOpenApiResp errorCode
     * @property {number|null} [httpCode] CommOpenApiResp httpCode
     * @property {Array.<IHttpHeader>|null} [headers] CommOpenApiResp headers
     * @property {number|null} [svrkitErrorCode] CommOpenApiResp svrkitErrorCode
     */

    /**
     * Constructs a new CommOpenApiResp.
     * @exports CommOpenApiResp
     * @classdesc Represents a CommOpenApiResp.
     * @implements ICommOpenApiResp
     * @constructor
     * @param {ICommOpenApiResp=} [properties] Properties to set
     */
    function CommOpenApiResp(properties) {
        this.headers = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CommOpenApiResp respData.
     * @member {Uint8Array} respData
     * @memberof CommOpenApiResp
     * @instance
     */
    CommOpenApiResp.prototype.respData = $util.newBuffer([]);

    /**
     * CommOpenApiResp contentType.
     * @member {string} contentType
     * @memberof CommOpenApiResp
     * @instance
     */
    CommOpenApiResp.prototype.contentType = "";

    /**
     * CommOpenApiResp errorCode.
     * @member {number} errorCode
     * @memberof CommOpenApiResp
     * @instance
     */
    CommOpenApiResp.prototype.errorCode = 0;

    /**
     * CommOpenApiResp httpCode.
     * @member {number} httpCode
     * @memberof CommOpenApiResp
     * @instance
     */
    CommOpenApiResp.prototype.httpCode = 0;

    /**
     * CommOpenApiResp headers.
     * @member {Array.<IHttpHeader>} headers
     * @memberof CommOpenApiResp
     * @instance
     */
    CommOpenApiResp.prototype.headers = $util.emptyArray;

    /**
     * CommOpenApiResp svrkitErrorCode.
     * @member {number} svrkitErrorCode
     * @memberof CommOpenApiResp
     * @instance
     */
    CommOpenApiResp.prototype.svrkitErrorCode = 0;

    /**
     * Creates a new CommOpenApiResp instance using the specified properties.
     * @function create
     * @memberof CommOpenApiResp
     * @static
     * @param {ICommOpenApiResp=} [properties] Properties to set
     * @returns {CommOpenApiResp} CommOpenApiResp instance
     */
    CommOpenApiResp.create = function create(properties) {
        return new CommOpenApiResp(properties);
    };

    /**
     * Encodes the specified CommOpenApiResp message. Does not implicitly {@link CommOpenApiResp.verify|verify} messages.
     * @function encode
     * @memberof CommOpenApiResp
     * @static
     * @param {ICommOpenApiResp} message CommOpenApiResp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CommOpenApiResp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.respData != null && message.hasOwnProperty("respData"))
            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.respData);
        if (message.contentType != null && message.hasOwnProperty("contentType"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.contentType);
        if (message.errorCode != null && message.hasOwnProperty("errorCode"))
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.errorCode);
        if (message.httpCode != null && message.hasOwnProperty("httpCode"))
            writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.httpCode);
        if (message.headers != null && message.headers.length)
            for (var i = 0; i < message.headers.length; ++i)
                $root.HttpHeader.encode(message.headers[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
        if (message.svrkitErrorCode != null && message.hasOwnProperty("svrkitErrorCode"))
            writer.uint32(/* id 6, wireType 0 =*/48).int32(message.svrkitErrorCode);
        return writer;
    };

    /**
     * Encodes the specified CommOpenApiResp message, length delimited. Does not implicitly {@link CommOpenApiResp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CommOpenApiResp
     * @static
     * @param {ICommOpenApiResp} message CommOpenApiResp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CommOpenApiResp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CommOpenApiResp message from the specified reader or buffer.
     * @function decode
     * @memberof CommOpenApiResp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CommOpenApiResp} CommOpenApiResp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CommOpenApiResp.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.CommOpenApiResp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.respData = reader.bytes();
                break;
            case 2:
                message.contentType = reader.string();
                break;
            case 3:
                message.errorCode = reader.int32();
                break;
            case 4:
                message.httpCode = reader.uint32();
                break;
            case 5:
                if (!(message.headers && message.headers.length))
                    message.headers = [];
                message.headers.push($root.HttpHeader.decode(reader, reader.uint32()));
                break;
            case 6:
                message.svrkitErrorCode = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a CommOpenApiResp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CommOpenApiResp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CommOpenApiResp} CommOpenApiResp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CommOpenApiResp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CommOpenApiResp message.
     * @function verify
     * @memberof CommOpenApiResp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CommOpenApiResp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.respData != null && message.hasOwnProperty("respData"))
            if (!(message.respData && typeof message.respData.length === "number" || $util.isString(message.respData)))
                return "respData: buffer expected";
        if (message.contentType != null && message.hasOwnProperty("contentType"))
            if (!$util.isString(message.contentType))
                return "contentType: string expected";
        if (message.errorCode != null && message.hasOwnProperty("errorCode"))
            if (!$util.isInteger(message.errorCode))
                return "errorCode: integer expected";
        if (message.httpCode != null && message.hasOwnProperty("httpCode"))
            if (!$util.isInteger(message.httpCode))
                return "httpCode: integer expected";
        if (message.headers != null && message.hasOwnProperty("headers")) {
            if (!Array.isArray(message.headers))
                return "headers: array expected";
            for (var i = 0; i < message.headers.length; ++i) {
                var error = $root.HttpHeader.verify(message.headers[i]);
                if (error)
                    return "headers." + error;
            }
        }
        if (message.svrkitErrorCode != null && message.hasOwnProperty("svrkitErrorCode"))
            if (!$util.isInteger(message.svrkitErrorCode))
                return "svrkitErrorCode: integer expected";
        return null;
    };

    /**
     * Creates a CommOpenApiResp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CommOpenApiResp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CommOpenApiResp} CommOpenApiResp
     */
    CommOpenApiResp.fromObject = function fromObject(object) {
        if (object instanceof $root.CommOpenApiResp)
            return object;
        var message = new $root.CommOpenApiResp();
        if (object.respData != null)
            if (typeof object.respData === "string")
                $util.base64.decode(object.respData, message.respData = $util.newBuffer($util.base64.length(object.respData)), 0);
            else if (object.respData.length)
                message.respData = object.respData;
        if (object.contentType != null)
            message.contentType = String(object.contentType);
        if (object.errorCode != null)
            message.errorCode = object.errorCode | 0;
        if (object.httpCode != null)
            message.httpCode = object.httpCode >>> 0;
        if (object.headers) {
            if (!Array.isArray(object.headers))
                throw TypeError(".CommOpenApiResp.headers: array expected");
            message.headers = [];
            for (var i = 0; i < object.headers.length; ++i) {
                if (typeof object.headers[i] !== "object")
                    throw TypeError(".CommOpenApiResp.headers: object expected");
                message.headers[i] = $root.HttpHeader.fromObject(object.headers[i]);
            }
        }
        if (object.svrkitErrorCode != null)
            message.svrkitErrorCode = object.svrkitErrorCode | 0;
        return message;
    };

    /**
     * Creates a plain object from a CommOpenApiResp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CommOpenApiResp
     * @static
     * @param {CommOpenApiResp} message CommOpenApiResp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CommOpenApiResp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.headers = [];
        if (options.defaults) {
            if (options.bytes === String)
                object.respData = "";
            else {
                object.respData = [];
                if (options.bytes !== Array)
                    object.respData = $util.newBuffer(object.respData);
            }
            object.contentType = "";
            object.errorCode = 0;
            object.httpCode = 0;
            object.svrkitErrorCode = 0;
        }
        if (message.respData != null && message.hasOwnProperty("respData"))
            object.respData = options.bytes === String ? $util.base64.encode(message.respData, 0, message.respData.length) : options.bytes === Array ? Array.prototype.slice.call(message.respData) : message.respData;
        if (message.contentType != null && message.hasOwnProperty("contentType"))
            object.contentType = message.contentType;
        if (message.errorCode != null && message.hasOwnProperty("errorCode"))
            object.errorCode = message.errorCode;
        if (message.httpCode != null && message.hasOwnProperty("httpCode"))
            object.httpCode = message.httpCode;
        if (message.headers && message.headers.length) {
            object.headers = [];
            for (var j = 0; j < message.headers.length; ++j)
                object.headers[j] = $root.HttpHeader.toObject(message.headers[j], options);
        }
        if (message.svrkitErrorCode != null && message.hasOwnProperty("svrkitErrorCode"))
            object.svrkitErrorCode = message.svrkitErrorCode;
        return object;
    };

    /**
     * Converts this CommOpenApiResp to JSON.
     * @function toJSON
     * @memberof CommOpenApiResp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CommOpenApiResp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return CommOpenApiResp;
})();

$root.InnerApiData = (function() {

    /**
     * Properties of an InnerApiData.
     * @exports IInnerApiData
     * @interface IInnerApiData
     * @property {number|null} [modid] InnerApiData modid
     * @property {number|null} [cmdid] InnerApiData cmdid
     * @property {string|null} [url] InnerApiData url
     * @property {boolean|null} [useHttps] InnerApiData useHttps
     * @property {HTTP_METHODS|null} [method] InnerApiData method
     * @property {Array.<string>|null} [headers] InnerApiData headers
     * @property {Uint8Array|null} [body] InnerApiData body
     */

    /**
     * Constructs a new InnerApiData.
     * @exports InnerApiData
     * @classdesc Represents an InnerApiData.
     * @implements IInnerApiData
     * @constructor
     * @param {IInnerApiData=} [properties] Properties to set
     */
    function InnerApiData(properties) {
        this.headers = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * InnerApiData modid.
     * @member {number} modid
     * @memberof InnerApiData
     * @instance
     */
    InnerApiData.prototype.modid = 0;

    /**
     * InnerApiData cmdid.
     * @member {number} cmdid
     * @memberof InnerApiData
     * @instance
     */
    InnerApiData.prototype.cmdid = 0;

    /**
     * InnerApiData url.
     * @member {string} url
     * @memberof InnerApiData
     * @instance
     */
    InnerApiData.prototype.url = "";

    /**
     * InnerApiData useHttps.
     * @member {boolean} useHttps
     * @memberof InnerApiData
     * @instance
     */
    InnerApiData.prototype.useHttps = false;

    /**
     * InnerApiData method.
     * @member {HTTP_METHODS} method
     * @memberof InnerApiData
     * @instance
     */
    InnerApiData.prototype.method = 1;

    /**
     * InnerApiData headers.
     * @member {Array.<string>} headers
     * @memberof InnerApiData
     * @instance
     */
    InnerApiData.prototype.headers = $util.emptyArray;

    /**
     * InnerApiData body.
     * @member {Uint8Array} body
     * @memberof InnerApiData
     * @instance
     */
    InnerApiData.prototype.body = $util.newBuffer([]);

    /**
     * Creates a new InnerApiData instance using the specified properties.
     * @function create
     * @memberof InnerApiData
     * @static
     * @param {IInnerApiData=} [properties] Properties to set
     * @returns {InnerApiData} InnerApiData instance
     */
    InnerApiData.create = function create(properties) {
        return new InnerApiData(properties);
    };

    /**
     * Encodes the specified InnerApiData message. Does not implicitly {@link InnerApiData.verify|verify} messages.
     * @function encode
     * @memberof InnerApiData
     * @static
     * @param {IInnerApiData} message InnerApiData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    InnerApiData.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.modid != null && message.hasOwnProperty("modid"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.modid);
        if (message.cmdid != null && message.hasOwnProperty("cmdid"))
            writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.cmdid);
        if (message.url != null && message.hasOwnProperty("url"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.url);
        if (message.useHttps != null && message.hasOwnProperty("useHttps"))
            writer.uint32(/* id 4, wireType 0 =*/32).bool(message.useHttps);
        if (message.method != null && message.hasOwnProperty("method"))
            writer.uint32(/* id 5, wireType 0 =*/40).int32(message.method);
        if (message.headers != null && message.headers.length)
            for (var i = 0; i < message.headers.length; ++i)
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.headers[i]);
        if (message.body != null && message.hasOwnProperty("body"))
            writer.uint32(/* id 7, wireType 2 =*/58).bytes(message.body);
        return writer;
    };

    /**
     * Encodes the specified InnerApiData message, length delimited. Does not implicitly {@link InnerApiData.verify|verify} messages.
     * @function encodeDelimited
     * @memberof InnerApiData
     * @static
     * @param {IInnerApiData} message InnerApiData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    InnerApiData.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an InnerApiData message from the specified reader or buffer.
     * @function decode
     * @memberof InnerApiData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {InnerApiData} InnerApiData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    InnerApiData.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.InnerApiData();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.modid = reader.uint32();
                break;
            case 2:
                message.cmdid = reader.uint32();
                break;
            case 3:
                message.url = reader.string();
                break;
            case 4:
                message.useHttps = reader.bool();
                break;
            case 5:
                message.method = reader.int32();
                break;
            case 6:
                if (!(message.headers && message.headers.length))
                    message.headers = [];
                message.headers.push(reader.string());
                break;
            case 7:
                message.body = reader.bytes();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an InnerApiData message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof InnerApiData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {InnerApiData} InnerApiData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    InnerApiData.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an InnerApiData message.
     * @function verify
     * @memberof InnerApiData
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    InnerApiData.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.modid != null && message.hasOwnProperty("modid"))
            if (!$util.isInteger(message.modid))
                return "modid: integer expected";
        if (message.cmdid != null && message.hasOwnProperty("cmdid"))
            if (!$util.isInteger(message.cmdid))
                return "cmdid: integer expected";
        if (message.url != null && message.hasOwnProperty("url"))
            if (!$util.isString(message.url))
                return "url: string expected";
        if (message.useHttps != null && message.hasOwnProperty("useHttps"))
            if (typeof message.useHttps !== "boolean")
                return "useHttps: boolean expected";
        if (message.method != null && message.hasOwnProperty("method"))
            switch (message.method) {
            default:
                return "method: enum value expected";
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
                break;
            }
        if (message.headers != null && message.hasOwnProperty("headers")) {
            if (!Array.isArray(message.headers))
                return "headers: array expected";
            for (var i = 0; i < message.headers.length; ++i)
                if (!$util.isString(message.headers[i]))
                    return "headers: string[] expected";
        }
        if (message.body != null && message.hasOwnProperty("body"))
            if (!(message.body && typeof message.body.length === "number" || $util.isString(message.body)))
                return "body: buffer expected";
        return null;
    };

    /**
     * Creates an InnerApiData message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof InnerApiData
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {InnerApiData} InnerApiData
     */
    InnerApiData.fromObject = function fromObject(object) {
        if (object instanceof $root.InnerApiData)
            return object;
        var message = new $root.InnerApiData();
        if (object.modid != null)
            message.modid = object.modid >>> 0;
        if (object.cmdid != null)
            message.cmdid = object.cmdid >>> 0;
        if (object.url != null)
            message.url = String(object.url);
        if (object.useHttps != null)
            message.useHttps = Boolean(object.useHttps);
        switch (object.method) {
        case "HTTP_GET":
        case 1:
            message.method = 1;
            break;
        case "HTTP_POST":
        case 2:
            message.method = 2;
            break;
        case "HTTP_PUT":
        case 3:
            message.method = 3;
            break;
        case "HTTP_DELETE":
        case 4:
            message.method = 4;
            break;
        case "HTTP_HEAD":
        case 5:
            message.method = 5;
            break;
        case "HTTP_PATCH":
        case 6:
            message.method = 6;
            break;
        }
        if (object.headers) {
            if (!Array.isArray(object.headers))
                throw TypeError(".InnerApiData.headers: array expected");
            message.headers = [];
            for (var i = 0; i < object.headers.length; ++i)
                message.headers[i] = String(object.headers[i]);
        }
        if (object.body != null)
            if (typeof object.body === "string")
                $util.base64.decode(object.body, message.body = $util.newBuffer($util.base64.length(object.body)), 0);
            else if (object.body.length)
                message.body = object.body;
        return message;
    };

    /**
     * Creates a plain object from an InnerApiData message. Also converts values to other types if specified.
     * @function toObject
     * @memberof InnerApiData
     * @static
     * @param {InnerApiData} message InnerApiData
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    InnerApiData.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.headers = [];
        if (options.defaults) {
            object.modid = 0;
            object.cmdid = 0;
            object.url = "";
            object.useHttps = false;
            object.method = options.enums === String ? "HTTP_GET" : 1;
            if (options.bytes === String)
                object.body = "";
            else {
                object.body = [];
                if (options.bytes !== Array)
                    object.body = $util.newBuffer(object.body);
            }
        }
        if (message.modid != null && message.hasOwnProperty("modid"))
            object.modid = message.modid;
        if (message.cmdid != null && message.hasOwnProperty("cmdid"))
            object.cmdid = message.cmdid;
        if (message.url != null && message.hasOwnProperty("url"))
            object.url = message.url;
        if (message.useHttps != null && message.hasOwnProperty("useHttps"))
            object.useHttps = message.useHttps;
        if (message.method != null && message.hasOwnProperty("method"))
            object.method = options.enums === String ? $root.HTTP_METHODS[message.method] : message.method;
        if (message.headers && message.headers.length) {
            object.headers = [];
            for (var j = 0; j < message.headers.length; ++j)
                object.headers[j] = message.headers[j];
        }
        if (message.body != null && message.hasOwnProperty("body"))
            object.body = options.bytes === String ? $util.base64.encode(message.body, 0, message.body.length) : options.bytes === Array ? Array.prototype.slice.call(message.body) : message.body;
        return object;
    };

    /**
     * Converts this InnerApiData to JSON.
     * @function toJSON
     * @memberof InnerApiData
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    InnerApiData.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return InnerApiData;
})();

$root.SvrkitApiData = (function() {

    /**
     * Properties of a SvrkitApiData.
     * @exports ISvrkitApiData
     * @interface ISvrkitApiData
     * @property {string|null} [apiName] SvrkitApiData apiName
     * @property {Uint8Array|null} [reqData] SvrkitApiData reqData
     */

    /**
     * Constructs a new SvrkitApiData.
     * @exports SvrkitApiData
     * @classdesc Represents a SvrkitApiData.
     * @implements ISvrkitApiData
     * @constructor
     * @param {ISvrkitApiData=} [properties] Properties to set
     */
    function SvrkitApiData(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * SvrkitApiData apiName.
     * @member {string} apiName
     * @memberof SvrkitApiData
     * @instance
     */
    SvrkitApiData.prototype.apiName = "";

    /**
     * SvrkitApiData reqData.
     * @member {Uint8Array} reqData
     * @memberof SvrkitApiData
     * @instance
     */
    SvrkitApiData.prototype.reqData = $util.newBuffer([]);

    /**
     * Creates a new SvrkitApiData instance using the specified properties.
     * @function create
     * @memberof SvrkitApiData
     * @static
     * @param {ISvrkitApiData=} [properties] Properties to set
     * @returns {SvrkitApiData} SvrkitApiData instance
     */
    SvrkitApiData.create = function create(properties) {
        return new SvrkitApiData(properties);
    };

    /**
     * Encodes the specified SvrkitApiData message. Does not implicitly {@link SvrkitApiData.verify|verify} messages.
     * @function encode
     * @memberof SvrkitApiData
     * @static
     * @param {ISvrkitApiData} message SvrkitApiData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SvrkitApiData.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.apiName != null && message.hasOwnProperty("apiName"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.apiName);
        if (message.reqData != null && message.hasOwnProperty("reqData"))
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.reqData);
        return writer;
    };

    /**
     * Encodes the specified SvrkitApiData message, length delimited. Does not implicitly {@link SvrkitApiData.verify|verify} messages.
     * @function encodeDelimited
     * @memberof SvrkitApiData
     * @static
     * @param {ISvrkitApiData} message SvrkitApiData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SvrkitApiData.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a SvrkitApiData message from the specified reader or buffer.
     * @function decode
     * @memberof SvrkitApiData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {SvrkitApiData} SvrkitApiData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SvrkitApiData.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SvrkitApiData();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.apiName = reader.string();
                break;
            case 2:
                message.reqData = reader.bytes();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a SvrkitApiData message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof SvrkitApiData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {SvrkitApiData} SvrkitApiData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SvrkitApiData.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a SvrkitApiData message.
     * @function verify
     * @memberof SvrkitApiData
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    SvrkitApiData.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.apiName != null && message.hasOwnProperty("apiName"))
            if (!$util.isString(message.apiName))
                return "apiName: string expected";
        if (message.reqData != null && message.hasOwnProperty("reqData"))
            if (!(message.reqData && typeof message.reqData.length === "number" || $util.isString(message.reqData)))
                return "reqData: buffer expected";
        return null;
    };

    /**
     * Creates a SvrkitApiData message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof SvrkitApiData
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {SvrkitApiData} SvrkitApiData
     */
    SvrkitApiData.fromObject = function fromObject(object) {
        if (object instanceof $root.SvrkitApiData)
            return object;
        var message = new $root.SvrkitApiData();
        if (object.apiName != null)
            message.apiName = String(object.apiName);
        if (object.reqData != null)
            if (typeof object.reqData === "string")
                $util.base64.decode(object.reqData, message.reqData = $util.newBuffer($util.base64.length(object.reqData)), 0);
            else if (object.reqData.length)
                message.reqData = object.reqData;
        return message;
    };

    /**
     * Creates a plain object from a SvrkitApiData message. Also converts values to other types if specified.
     * @function toObject
     * @memberof SvrkitApiData
     * @static
     * @param {SvrkitApiData} message SvrkitApiData
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    SvrkitApiData.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.apiName = "";
            if (options.bytes === String)
                object.reqData = "";
            else {
                object.reqData = [];
                if (options.bytes !== Array)
                    object.reqData = $util.newBuffer(object.reqData);
            }
        }
        if (message.apiName != null && message.hasOwnProperty("apiName"))
            object.apiName = message.apiName;
        if (message.reqData != null && message.hasOwnProperty("reqData"))
            object.reqData = options.bytes === String ? $util.base64.encode(message.reqData, 0, message.reqData.length) : options.bytes === Array ? Array.prototype.slice.call(message.reqData) : message.reqData;
        return object;
    };

    /**
     * Converts this SvrkitApiData to JSON.
     * @function toJSON
     * @memberof SvrkitApiData
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    SvrkitApiData.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return SvrkitApiData;
})();

/**
 * HTTP_METHODS enum.
 * @exports HTTP_METHODS
 * @enum {string}
 * @property {number} HTTP_GET=1 HTTP_GET value
 * @property {number} HTTP_POST=2 HTTP_POST value
 * @property {number} HTTP_PUT=3 HTTP_PUT value
 * @property {number} HTTP_DELETE=4 HTTP_DELETE value
 * @property {number} HTTP_HEAD=5 HTTP_HEAD value
 * @property {number} HTTP_PATCH=6 HTTP_PATCH value
 */
$root.HTTP_METHODS = (function() {
    var valuesById = {}, values = Object.create(valuesById);
    values[valuesById[1] = "HTTP_GET"] = 1;
    values[valuesById[2] = "HTTP_POST"] = 2;
    values[valuesById[3] = "HTTP_PUT"] = 3;
    values[valuesById[4] = "HTTP_DELETE"] = 4;
    values[valuesById[5] = "HTTP_HEAD"] = 5;
    values[valuesById[6] = "HTTP_PATCH"] = 6;
    return values;
})();

$root.HttpHeader = (function() {

    /**
     * Properties of a HttpHeader.
     * @exports IHttpHeader
     * @interface IHttpHeader
     * @property {string|null} [key] HttpHeader key
     * @property {string|null} [value] HttpHeader value
     */

    /**
     * Constructs a new HttpHeader.
     * @exports HttpHeader
     * @classdesc Represents a HttpHeader.
     * @implements IHttpHeader
     * @constructor
     * @param {IHttpHeader=} [properties] Properties to set
     */
    function HttpHeader(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * HttpHeader key.
     * @member {string} key
     * @memberof HttpHeader
     * @instance
     */
    HttpHeader.prototype.key = "";

    /**
     * HttpHeader value.
     * @member {string} value
     * @memberof HttpHeader
     * @instance
     */
    HttpHeader.prototype.value = "";

    /**
     * Creates a new HttpHeader instance using the specified properties.
     * @function create
     * @memberof HttpHeader
     * @static
     * @param {IHttpHeader=} [properties] Properties to set
     * @returns {HttpHeader} HttpHeader instance
     */
    HttpHeader.create = function create(properties) {
        return new HttpHeader(properties);
    };

    /**
     * Encodes the specified HttpHeader message. Does not implicitly {@link HttpHeader.verify|verify} messages.
     * @function encode
     * @memberof HttpHeader
     * @static
     * @param {IHttpHeader} message HttpHeader message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    HttpHeader.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.key != null && message.hasOwnProperty("key"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.key);
        if (message.value != null && message.hasOwnProperty("value"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.value);
        return writer;
    };

    /**
     * Encodes the specified HttpHeader message, length delimited. Does not implicitly {@link HttpHeader.verify|verify} messages.
     * @function encodeDelimited
     * @memberof HttpHeader
     * @static
     * @param {IHttpHeader} message HttpHeader message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    HttpHeader.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a HttpHeader message from the specified reader or buffer.
     * @function decode
     * @memberof HttpHeader
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {HttpHeader} HttpHeader
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    HttpHeader.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.HttpHeader();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.key = reader.string();
                break;
            case 2:
                message.value = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a HttpHeader message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof HttpHeader
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {HttpHeader} HttpHeader
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    HttpHeader.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a HttpHeader message.
     * @function verify
     * @memberof HttpHeader
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    HttpHeader.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.key != null && message.hasOwnProperty("key"))
            if (!$util.isString(message.key))
                return "key: string expected";
        if (message.value != null && message.hasOwnProperty("value"))
            if (!$util.isString(message.value))
                return "value: string expected";
        return null;
    };

    /**
     * Creates a HttpHeader message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof HttpHeader
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {HttpHeader} HttpHeader
     */
    HttpHeader.fromObject = function fromObject(object) {
        if (object instanceof $root.HttpHeader)
            return object;
        var message = new $root.HttpHeader();
        if (object.key != null)
            message.key = String(object.key);
        if (object.value != null)
            message.value = String(object.value);
        return message;
    };

    /**
     * Creates a plain object from a HttpHeader message. Also converts values to other types if specified.
     * @function toObject
     * @memberof HttpHeader
     * @static
     * @param {HttpHeader} message HttpHeader
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    HttpHeader.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.key = "";
            object.value = "";
        }
        if (message.key != null && message.hasOwnProperty("key"))
            object.key = message.key;
        if (message.value != null && message.hasOwnProperty("value"))
            object.value = message.value;
        return object;
    };

    /**
     * Converts this HttpHeader to JSON.
     * @function toJSON
     * @memberof HttpHeader
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    HttpHeader.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return HttpHeader;
})();

$root.ApiGetOpenDataByCloudIdReq = (function() {

    /**
     * Properties of an ApiGetOpenDataByCloudIdReq.
     * @exports IApiGetOpenDataByCloudIdReq
     * @interface IApiGetOpenDataByCloudIdReq
     * @property {Array.<string>|null} [cloudidList] ApiGetOpenDataByCloudIdReq cloudidList
     */

    /**
     * Constructs a new ApiGetOpenDataByCloudIdReq.
     * @exports ApiGetOpenDataByCloudIdReq
     * @classdesc Represents an ApiGetOpenDataByCloudIdReq.
     * @implements IApiGetOpenDataByCloudIdReq
     * @constructor
     * @param {IApiGetOpenDataByCloudIdReq=} [properties] Properties to set
     */
    function ApiGetOpenDataByCloudIdReq(properties) {
        this.cloudidList = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ApiGetOpenDataByCloudIdReq cloudidList.
     * @member {Array.<string>} cloudidList
     * @memberof ApiGetOpenDataByCloudIdReq
     * @instance
     */
    ApiGetOpenDataByCloudIdReq.prototype.cloudidList = $util.emptyArray;

    /**
     * Creates a new ApiGetOpenDataByCloudIdReq instance using the specified properties.
     * @function create
     * @memberof ApiGetOpenDataByCloudIdReq
     * @static
     * @param {IApiGetOpenDataByCloudIdReq=} [properties] Properties to set
     * @returns {ApiGetOpenDataByCloudIdReq} ApiGetOpenDataByCloudIdReq instance
     */
    ApiGetOpenDataByCloudIdReq.create = function create(properties) {
        return new ApiGetOpenDataByCloudIdReq(properties);
    };

    /**
     * Encodes the specified ApiGetOpenDataByCloudIdReq message. Does not implicitly {@link ApiGetOpenDataByCloudIdReq.verify|verify} messages.
     * @function encode
     * @memberof ApiGetOpenDataByCloudIdReq
     * @static
     * @param {IApiGetOpenDataByCloudIdReq} message ApiGetOpenDataByCloudIdReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ApiGetOpenDataByCloudIdReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.cloudidList != null && message.cloudidList.length)
            for (var i = 0; i < message.cloudidList.length; ++i)
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.cloudidList[i]);
        return writer;
    };

    /**
     * Encodes the specified ApiGetOpenDataByCloudIdReq message, length delimited. Does not implicitly {@link ApiGetOpenDataByCloudIdReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ApiGetOpenDataByCloudIdReq
     * @static
     * @param {IApiGetOpenDataByCloudIdReq} message ApiGetOpenDataByCloudIdReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ApiGetOpenDataByCloudIdReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an ApiGetOpenDataByCloudIdReq message from the specified reader or buffer.
     * @function decode
     * @memberof ApiGetOpenDataByCloudIdReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ApiGetOpenDataByCloudIdReq} ApiGetOpenDataByCloudIdReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ApiGetOpenDataByCloudIdReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ApiGetOpenDataByCloudIdReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 2:
                if (!(message.cloudidList && message.cloudidList.length))
                    message.cloudidList = [];
                message.cloudidList.push(reader.string());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an ApiGetOpenDataByCloudIdReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ApiGetOpenDataByCloudIdReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ApiGetOpenDataByCloudIdReq} ApiGetOpenDataByCloudIdReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ApiGetOpenDataByCloudIdReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an ApiGetOpenDataByCloudIdReq message.
     * @function verify
     * @memberof ApiGetOpenDataByCloudIdReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ApiGetOpenDataByCloudIdReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.cloudidList != null && message.hasOwnProperty("cloudidList")) {
            if (!Array.isArray(message.cloudidList))
                return "cloudidList: array expected";
            for (var i = 0; i < message.cloudidList.length; ++i)
                if (!$util.isString(message.cloudidList[i]))
                    return "cloudidList: string[] expected";
        }
        return null;
    };

    /**
     * Creates an ApiGetOpenDataByCloudIdReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ApiGetOpenDataByCloudIdReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ApiGetOpenDataByCloudIdReq} ApiGetOpenDataByCloudIdReq
     */
    ApiGetOpenDataByCloudIdReq.fromObject = function fromObject(object) {
        if (object instanceof $root.ApiGetOpenDataByCloudIdReq)
            return object;
        var message = new $root.ApiGetOpenDataByCloudIdReq();
        if (object.cloudidList) {
            if (!Array.isArray(object.cloudidList))
                throw TypeError(".ApiGetOpenDataByCloudIdReq.cloudidList: array expected");
            message.cloudidList = [];
            for (var i = 0; i < object.cloudidList.length; ++i)
                message.cloudidList[i] = String(object.cloudidList[i]);
        }
        return message;
    };

    /**
     * Creates a plain object from an ApiGetOpenDataByCloudIdReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ApiGetOpenDataByCloudIdReq
     * @static
     * @param {ApiGetOpenDataByCloudIdReq} message ApiGetOpenDataByCloudIdReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ApiGetOpenDataByCloudIdReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.cloudidList = [];
        if (message.cloudidList && message.cloudidList.length) {
            object.cloudidList = [];
            for (var j = 0; j < message.cloudidList.length; ++j)
                object.cloudidList[j] = message.cloudidList[j];
        }
        return object;
    };

    /**
     * Converts this ApiGetOpenDataByCloudIdReq to JSON.
     * @function toJSON
     * @memberof ApiGetOpenDataByCloudIdReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ApiGetOpenDataByCloudIdReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ApiGetOpenDataByCloudIdReq;
})();

$root.ApiGetOpenDataByCloudIdResp = (function() {

    /**
     * Properties of an ApiGetOpenDataByCloudIdResp.
     * @exports IApiGetOpenDataByCloudIdResp
     * @interface IApiGetOpenDataByCloudIdResp
     * @property {Array.<ApiGetOpenDataByCloudIdResp.IOpDataItem>|null} [dataList] ApiGetOpenDataByCloudIdResp dataList
     */

    /**
     * Constructs a new ApiGetOpenDataByCloudIdResp.
     * @exports ApiGetOpenDataByCloudIdResp
     * @classdesc Represents an ApiGetOpenDataByCloudIdResp.
     * @implements IApiGetOpenDataByCloudIdResp
     * @constructor
     * @param {IApiGetOpenDataByCloudIdResp=} [properties] Properties to set
     */
    function ApiGetOpenDataByCloudIdResp(properties) {
        this.dataList = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ApiGetOpenDataByCloudIdResp dataList.
     * @member {Array.<ApiGetOpenDataByCloudIdResp.IOpDataItem>} dataList
     * @memberof ApiGetOpenDataByCloudIdResp
     * @instance
     */
    ApiGetOpenDataByCloudIdResp.prototype.dataList = $util.emptyArray;

    /**
     * Creates a new ApiGetOpenDataByCloudIdResp instance using the specified properties.
     * @function create
     * @memberof ApiGetOpenDataByCloudIdResp
     * @static
     * @param {IApiGetOpenDataByCloudIdResp=} [properties] Properties to set
     * @returns {ApiGetOpenDataByCloudIdResp} ApiGetOpenDataByCloudIdResp instance
     */
    ApiGetOpenDataByCloudIdResp.create = function create(properties) {
        return new ApiGetOpenDataByCloudIdResp(properties);
    };

    /**
     * Encodes the specified ApiGetOpenDataByCloudIdResp message. Does not implicitly {@link ApiGetOpenDataByCloudIdResp.verify|verify} messages.
     * @function encode
     * @memberof ApiGetOpenDataByCloudIdResp
     * @static
     * @param {IApiGetOpenDataByCloudIdResp} message ApiGetOpenDataByCloudIdResp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ApiGetOpenDataByCloudIdResp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.dataList != null && message.dataList.length)
            for (var i = 0; i < message.dataList.length; ++i)
                $root.ApiGetOpenDataByCloudIdResp.OpDataItem.encode(message.dataList[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified ApiGetOpenDataByCloudIdResp message, length delimited. Does not implicitly {@link ApiGetOpenDataByCloudIdResp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ApiGetOpenDataByCloudIdResp
     * @static
     * @param {IApiGetOpenDataByCloudIdResp} message ApiGetOpenDataByCloudIdResp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ApiGetOpenDataByCloudIdResp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an ApiGetOpenDataByCloudIdResp message from the specified reader or buffer.
     * @function decode
     * @memberof ApiGetOpenDataByCloudIdResp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ApiGetOpenDataByCloudIdResp} ApiGetOpenDataByCloudIdResp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ApiGetOpenDataByCloudIdResp.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ApiGetOpenDataByCloudIdResp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.dataList && message.dataList.length))
                    message.dataList = [];
                message.dataList.push($root.ApiGetOpenDataByCloudIdResp.OpDataItem.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an ApiGetOpenDataByCloudIdResp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ApiGetOpenDataByCloudIdResp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ApiGetOpenDataByCloudIdResp} ApiGetOpenDataByCloudIdResp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ApiGetOpenDataByCloudIdResp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an ApiGetOpenDataByCloudIdResp message.
     * @function verify
     * @memberof ApiGetOpenDataByCloudIdResp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ApiGetOpenDataByCloudIdResp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.dataList != null && message.hasOwnProperty("dataList")) {
            if (!Array.isArray(message.dataList))
                return "dataList: array expected";
            for (var i = 0; i < message.dataList.length; ++i) {
                var error = $root.ApiGetOpenDataByCloudIdResp.OpDataItem.verify(message.dataList[i]);
                if (error)
                    return "dataList." + error;
            }
        }
        return null;
    };

    /**
     * Creates an ApiGetOpenDataByCloudIdResp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ApiGetOpenDataByCloudIdResp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ApiGetOpenDataByCloudIdResp} ApiGetOpenDataByCloudIdResp
     */
    ApiGetOpenDataByCloudIdResp.fromObject = function fromObject(object) {
        if (object instanceof $root.ApiGetOpenDataByCloudIdResp)
            return object;
        var message = new $root.ApiGetOpenDataByCloudIdResp();
        if (object.dataList) {
            if (!Array.isArray(object.dataList))
                throw TypeError(".ApiGetOpenDataByCloudIdResp.dataList: array expected");
            message.dataList = [];
            for (var i = 0; i < object.dataList.length; ++i) {
                if (typeof object.dataList[i] !== "object")
                    throw TypeError(".ApiGetOpenDataByCloudIdResp.dataList: object expected");
                message.dataList[i] = $root.ApiGetOpenDataByCloudIdResp.OpDataItem.fromObject(object.dataList[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from an ApiGetOpenDataByCloudIdResp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ApiGetOpenDataByCloudIdResp
     * @static
     * @param {ApiGetOpenDataByCloudIdResp} message ApiGetOpenDataByCloudIdResp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ApiGetOpenDataByCloudIdResp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.dataList = [];
        if (message.dataList && message.dataList.length) {
            object.dataList = [];
            for (var j = 0; j < message.dataList.length; ++j)
                object.dataList[j] = $root.ApiGetOpenDataByCloudIdResp.OpDataItem.toObject(message.dataList[j], options);
        }
        return object;
    };

    /**
     * Converts this ApiGetOpenDataByCloudIdResp to JSON.
     * @function toJSON
     * @memberof ApiGetOpenDataByCloudIdResp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ApiGetOpenDataByCloudIdResp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    ApiGetOpenDataByCloudIdResp.OpDataItem = (function() {

        /**
         * Properties of an OpDataItem.
         * @memberof ApiGetOpenDataByCloudIdResp
         * @interface IOpDataItem
         * @property {string|null} [cloudId] OpDataItem cloudId
         * @property {string|null} [json] OpDataItem json
         */

        /**
         * Constructs a new OpDataItem.
         * @memberof ApiGetOpenDataByCloudIdResp
         * @classdesc Represents an OpDataItem.
         * @implements IOpDataItem
         * @constructor
         * @param {ApiGetOpenDataByCloudIdResp.IOpDataItem=} [properties] Properties to set
         */
        function OpDataItem(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * OpDataItem cloudId.
         * @member {string} cloudId
         * @memberof ApiGetOpenDataByCloudIdResp.OpDataItem
         * @instance
         */
        OpDataItem.prototype.cloudId = "";

        /**
         * OpDataItem json.
         * @member {string} json
         * @memberof ApiGetOpenDataByCloudIdResp.OpDataItem
         * @instance
         */
        OpDataItem.prototype.json = "";

        /**
         * Creates a new OpDataItem instance using the specified properties.
         * @function create
         * @memberof ApiGetOpenDataByCloudIdResp.OpDataItem
         * @static
         * @param {ApiGetOpenDataByCloudIdResp.IOpDataItem=} [properties] Properties to set
         * @returns {ApiGetOpenDataByCloudIdResp.OpDataItem} OpDataItem instance
         */
        OpDataItem.create = function create(properties) {
            return new OpDataItem(properties);
        };

        /**
         * Encodes the specified OpDataItem message. Does not implicitly {@link ApiGetOpenDataByCloudIdResp.OpDataItem.verify|verify} messages.
         * @function encode
         * @memberof ApiGetOpenDataByCloudIdResp.OpDataItem
         * @static
         * @param {ApiGetOpenDataByCloudIdResp.IOpDataItem} message OpDataItem message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        OpDataItem.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.cloudId != null && message.hasOwnProperty("cloudId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.cloudId);
            if (message.json != null && message.hasOwnProperty("json"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.json);
            return writer;
        };

        /**
         * Encodes the specified OpDataItem message, length delimited. Does not implicitly {@link ApiGetOpenDataByCloudIdResp.OpDataItem.verify|verify} messages.
         * @function encodeDelimited
         * @memberof ApiGetOpenDataByCloudIdResp.OpDataItem
         * @static
         * @param {ApiGetOpenDataByCloudIdResp.IOpDataItem} message OpDataItem message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        OpDataItem.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an OpDataItem message from the specified reader or buffer.
         * @function decode
         * @memberof ApiGetOpenDataByCloudIdResp.OpDataItem
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {ApiGetOpenDataByCloudIdResp.OpDataItem} OpDataItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OpDataItem.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ApiGetOpenDataByCloudIdResp.OpDataItem();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.cloudId = reader.string();
                    break;
                case 2:
                    message.json = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an OpDataItem message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof ApiGetOpenDataByCloudIdResp.OpDataItem
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {ApiGetOpenDataByCloudIdResp.OpDataItem} OpDataItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OpDataItem.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an OpDataItem message.
         * @function verify
         * @memberof ApiGetOpenDataByCloudIdResp.OpDataItem
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        OpDataItem.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.cloudId != null && message.hasOwnProperty("cloudId"))
                if (!$util.isString(message.cloudId))
                    return "cloudId: string expected";
            if (message.json != null && message.hasOwnProperty("json"))
                if (!$util.isString(message.json))
                    return "json: string expected";
            return null;
        };

        /**
         * Creates an OpDataItem message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof ApiGetOpenDataByCloudIdResp.OpDataItem
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {ApiGetOpenDataByCloudIdResp.OpDataItem} OpDataItem
         */
        OpDataItem.fromObject = function fromObject(object) {
            if (object instanceof $root.ApiGetOpenDataByCloudIdResp.OpDataItem)
                return object;
            var message = new $root.ApiGetOpenDataByCloudIdResp.OpDataItem();
            if (object.cloudId != null)
                message.cloudId = String(object.cloudId);
            if (object.json != null)
                message.json = String(object.json);
            return message;
        };

        /**
         * Creates a plain object from an OpDataItem message. Also converts values to other types if specified.
         * @function toObject
         * @memberof ApiGetOpenDataByCloudIdResp.OpDataItem
         * @static
         * @param {ApiGetOpenDataByCloudIdResp.OpDataItem} message OpDataItem
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        OpDataItem.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.cloudId = "";
                object.json = "";
            }
            if (message.cloudId != null && message.hasOwnProperty("cloudId"))
                object.cloudId = message.cloudId;
            if (message.json != null && message.hasOwnProperty("json"))
                object.json = message.json;
            return object;
        };

        /**
         * Converts this OpDataItem to JSON.
         * @function toJSON
         * @memberof ApiGetOpenDataByCloudIdResp.OpDataItem
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        OpDataItem.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return OpDataItem;
    })();

    return ApiGetOpenDataByCloudIdResp;
})();

$root.ApiVoipSignReq = (function() {

    /**
     * Properties of an ApiVoipSignReq.
     * @exports IApiVoipSignReq
     * @interface IApiVoipSignReq
     * @property {string|null} [groupId] ApiVoipSignReq groupId
     * @property {number|null} [timestamp] ApiVoipSignReq timestamp
     * @property {string|null} [nonce] ApiVoipSignReq nonce
     */

    /**
     * Constructs a new ApiVoipSignReq.
     * @exports ApiVoipSignReq
     * @classdesc Represents an ApiVoipSignReq.
     * @implements IApiVoipSignReq
     * @constructor
     * @param {IApiVoipSignReq=} [properties] Properties to set
     */
    function ApiVoipSignReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ApiVoipSignReq groupId.
     * @member {string} groupId
     * @memberof ApiVoipSignReq
     * @instance
     */
    ApiVoipSignReq.prototype.groupId = "";

    /**
     * ApiVoipSignReq timestamp.
     * @member {number} timestamp
     * @memberof ApiVoipSignReq
     * @instance
     */
    ApiVoipSignReq.prototype.timestamp = 0;

    /**
     * ApiVoipSignReq nonce.
     * @member {string} nonce
     * @memberof ApiVoipSignReq
     * @instance
     */
    ApiVoipSignReq.prototype.nonce = "";

    /**
     * Creates a new ApiVoipSignReq instance using the specified properties.
     * @function create
     * @memberof ApiVoipSignReq
     * @static
     * @param {IApiVoipSignReq=} [properties] Properties to set
     * @returns {ApiVoipSignReq} ApiVoipSignReq instance
     */
    ApiVoipSignReq.create = function create(properties) {
        return new ApiVoipSignReq(properties);
    };

    /**
     * Encodes the specified ApiVoipSignReq message. Does not implicitly {@link ApiVoipSignReq.verify|verify} messages.
     * @function encode
     * @memberof ApiVoipSignReq
     * @static
     * @param {IApiVoipSignReq} message ApiVoipSignReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ApiVoipSignReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.groupId != null && message.hasOwnProperty("groupId"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.groupId);
        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.timestamp);
        if (message.nonce != null && message.hasOwnProperty("nonce"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.nonce);
        return writer;
    };

    /**
     * Encodes the specified ApiVoipSignReq message, length delimited. Does not implicitly {@link ApiVoipSignReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ApiVoipSignReq
     * @static
     * @param {IApiVoipSignReq} message ApiVoipSignReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ApiVoipSignReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an ApiVoipSignReq message from the specified reader or buffer.
     * @function decode
     * @memberof ApiVoipSignReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ApiVoipSignReq} ApiVoipSignReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ApiVoipSignReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ApiVoipSignReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 2:
                message.groupId = reader.string();
                break;
            case 3:
                message.timestamp = reader.uint32();
                break;
            case 4:
                message.nonce = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an ApiVoipSignReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ApiVoipSignReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ApiVoipSignReq} ApiVoipSignReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ApiVoipSignReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an ApiVoipSignReq message.
     * @function verify
     * @memberof ApiVoipSignReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ApiVoipSignReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.groupId != null && message.hasOwnProperty("groupId"))
            if (!$util.isString(message.groupId))
                return "groupId: string expected";
        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            if (!$util.isInteger(message.timestamp))
                return "timestamp: integer expected";
        if (message.nonce != null && message.hasOwnProperty("nonce"))
            if (!$util.isString(message.nonce))
                return "nonce: string expected";
        return null;
    };

    /**
     * Creates an ApiVoipSignReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ApiVoipSignReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ApiVoipSignReq} ApiVoipSignReq
     */
    ApiVoipSignReq.fromObject = function fromObject(object) {
        if (object instanceof $root.ApiVoipSignReq)
            return object;
        var message = new $root.ApiVoipSignReq();
        if (object.groupId != null)
            message.groupId = String(object.groupId);
        if (object.timestamp != null)
            message.timestamp = object.timestamp >>> 0;
        if (object.nonce != null)
            message.nonce = String(object.nonce);
        return message;
    };

    /**
     * Creates a plain object from an ApiVoipSignReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ApiVoipSignReq
     * @static
     * @param {ApiVoipSignReq} message ApiVoipSignReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ApiVoipSignReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.groupId = "";
            object.timestamp = 0;
            object.nonce = "";
        }
        if (message.groupId != null && message.hasOwnProperty("groupId"))
            object.groupId = message.groupId;
        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            object.timestamp = message.timestamp;
        if (message.nonce != null && message.hasOwnProperty("nonce"))
            object.nonce = message.nonce;
        return object;
    };

    /**
     * Converts this ApiVoipSignReq to JSON.
     * @function toJSON
     * @memberof ApiVoipSignReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ApiVoipSignReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ApiVoipSignReq;
})();

$root.ApiVoipSignResp = (function() {

    /**
     * Properties of an ApiVoipSignResp.
     * @exports IApiVoipSignResp
     * @interface IApiVoipSignResp
     * @property {string|null} [signature] ApiVoipSignResp signature
     */

    /**
     * Constructs a new ApiVoipSignResp.
     * @exports ApiVoipSignResp
     * @classdesc Represents an ApiVoipSignResp.
     * @implements IApiVoipSignResp
     * @constructor
     * @param {IApiVoipSignResp=} [properties] Properties to set
     */
    function ApiVoipSignResp(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ApiVoipSignResp signature.
     * @member {string} signature
     * @memberof ApiVoipSignResp
     * @instance
     */
    ApiVoipSignResp.prototype.signature = "";

    /**
     * Creates a new ApiVoipSignResp instance using the specified properties.
     * @function create
     * @memberof ApiVoipSignResp
     * @static
     * @param {IApiVoipSignResp=} [properties] Properties to set
     * @returns {ApiVoipSignResp} ApiVoipSignResp instance
     */
    ApiVoipSignResp.create = function create(properties) {
        return new ApiVoipSignResp(properties);
    };

    /**
     * Encodes the specified ApiVoipSignResp message. Does not implicitly {@link ApiVoipSignResp.verify|verify} messages.
     * @function encode
     * @memberof ApiVoipSignResp
     * @static
     * @param {IApiVoipSignResp} message ApiVoipSignResp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ApiVoipSignResp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.signature != null && message.hasOwnProperty("signature"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.signature);
        return writer;
    };

    /**
     * Encodes the specified ApiVoipSignResp message, length delimited. Does not implicitly {@link ApiVoipSignResp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ApiVoipSignResp
     * @static
     * @param {IApiVoipSignResp} message ApiVoipSignResp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ApiVoipSignResp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an ApiVoipSignResp message from the specified reader or buffer.
     * @function decode
     * @memberof ApiVoipSignResp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ApiVoipSignResp} ApiVoipSignResp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ApiVoipSignResp.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ApiVoipSignResp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.signature = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an ApiVoipSignResp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ApiVoipSignResp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ApiVoipSignResp} ApiVoipSignResp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ApiVoipSignResp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an ApiVoipSignResp message.
     * @function verify
     * @memberof ApiVoipSignResp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ApiVoipSignResp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.signature != null && message.hasOwnProperty("signature"))
            if (!$util.isString(message.signature))
                return "signature: string expected";
        return null;
    };

    /**
     * Creates an ApiVoipSignResp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ApiVoipSignResp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ApiVoipSignResp} ApiVoipSignResp
     */
    ApiVoipSignResp.fromObject = function fromObject(object) {
        if (object instanceof $root.ApiVoipSignResp)
            return object;
        var message = new $root.ApiVoipSignResp();
        if (object.signature != null)
            message.signature = String(object.signature);
        return message;
    };

    /**
     * Creates a plain object from an ApiVoipSignResp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ApiVoipSignResp
     * @static
     * @param {ApiVoipSignResp} message ApiVoipSignResp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ApiVoipSignResp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.signature = "";
        if (message.signature != null && message.hasOwnProperty("signature"))
            object.signature = message.signature;
        return object;
    };

    /**
     * Converts this ApiVoipSignResp to JSON.
     * @function toJSON
     * @memberof ApiVoipSignResp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ApiVoipSignResp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ApiVoipSignResp;
})();

$root.GetCloudCallSignReq = (function() {

    /**
     * Properties of a GetCloudCallSignReq.
     * @exports IGetCloudCallSignReq
     * @interface IGetCloudCallSignReq
     * @property {Array.<string>|null} [parameterList] GetCloudCallSignReq parameterList
     */

    /**
     * Constructs a new GetCloudCallSignReq.
     * @exports GetCloudCallSignReq
     * @classdesc Represents a GetCloudCallSignReq.
     * @implements IGetCloudCallSignReq
     * @constructor
     * @param {IGetCloudCallSignReq=} [properties] Properties to set
     */
    function GetCloudCallSignReq(properties) {
        this.parameterList = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GetCloudCallSignReq parameterList.
     * @member {Array.<string>} parameterList
     * @memberof GetCloudCallSignReq
     * @instance
     */
    GetCloudCallSignReq.prototype.parameterList = $util.emptyArray;

    /**
     * Creates a new GetCloudCallSignReq instance using the specified properties.
     * @function create
     * @memberof GetCloudCallSignReq
     * @static
     * @param {IGetCloudCallSignReq=} [properties] Properties to set
     * @returns {GetCloudCallSignReq} GetCloudCallSignReq instance
     */
    GetCloudCallSignReq.create = function create(properties) {
        return new GetCloudCallSignReq(properties);
    };

    /**
     * Encodes the specified GetCloudCallSignReq message. Does not implicitly {@link GetCloudCallSignReq.verify|verify} messages.
     * @function encode
     * @memberof GetCloudCallSignReq
     * @static
     * @param {IGetCloudCallSignReq} message GetCloudCallSignReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetCloudCallSignReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.parameterList != null && message.parameterList.length)
            for (var i = 0; i < message.parameterList.length; ++i)
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.parameterList[i]);
        return writer;
    };

    /**
     * Encodes the specified GetCloudCallSignReq message, length delimited. Does not implicitly {@link GetCloudCallSignReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GetCloudCallSignReq
     * @static
     * @param {IGetCloudCallSignReq} message GetCloudCallSignReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetCloudCallSignReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GetCloudCallSignReq message from the specified reader or buffer.
     * @function decode
     * @memberof GetCloudCallSignReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GetCloudCallSignReq} GetCloudCallSignReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetCloudCallSignReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GetCloudCallSignReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 2:
                if (!(message.parameterList && message.parameterList.length))
                    message.parameterList = [];
                message.parameterList.push(reader.string());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GetCloudCallSignReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GetCloudCallSignReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GetCloudCallSignReq} GetCloudCallSignReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetCloudCallSignReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GetCloudCallSignReq message.
     * @function verify
     * @memberof GetCloudCallSignReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GetCloudCallSignReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.parameterList != null && message.hasOwnProperty("parameterList")) {
            if (!Array.isArray(message.parameterList))
                return "parameterList: array expected";
            for (var i = 0; i < message.parameterList.length; ++i)
                if (!$util.isString(message.parameterList[i]))
                    return "parameterList: string[] expected";
        }
        return null;
    };

    /**
     * Creates a GetCloudCallSignReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GetCloudCallSignReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GetCloudCallSignReq} GetCloudCallSignReq
     */
    GetCloudCallSignReq.fromObject = function fromObject(object) {
        if (object instanceof $root.GetCloudCallSignReq)
            return object;
        var message = new $root.GetCloudCallSignReq();
        if (object.parameterList) {
            if (!Array.isArray(object.parameterList))
                throw TypeError(".GetCloudCallSignReq.parameterList: array expected");
            message.parameterList = [];
            for (var i = 0; i < object.parameterList.length; ++i)
                message.parameterList[i] = String(object.parameterList[i]);
        }
        return message;
    };

    /**
     * Creates a plain object from a GetCloudCallSignReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GetCloudCallSignReq
     * @static
     * @param {GetCloudCallSignReq} message GetCloudCallSignReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GetCloudCallSignReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.parameterList = [];
        if (message.parameterList && message.parameterList.length) {
            object.parameterList = [];
            for (var j = 0; j < message.parameterList.length; ++j)
                object.parameterList[j] = message.parameterList[j];
        }
        return object;
    };

    /**
     * Converts this GetCloudCallSignReq to JSON.
     * @function toJSON
     * @memberof GetCloudCallSignReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GetCloudCallSignReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GetCloudCallSignReq;
})();

$root.GetCloudCallSignResp = (function() {

    /**
     * Properties of a GetCloudCallSignResp.
     * @exports IGetCloudCallSignResp
     * @interface IGetCloudCallSignResp
     * @property {string|null} [signature] GetCloudCallSignResp signature
     */

    /**
     * Constructs a new GetCloudCallSignResp.
     * @exports GetCloudCallSignResp
     * @classdesc Represents a GetCloudCallSignResp.
     * @implements IGetCloudCallSignResp
     * @constructor
     * @param {IGetCloudCallSignResp=} [properties] Properties to set
     */
    function GetCloudCallSignResp(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GetCloudCallSignResp signature.
     * @member {string} signature
     * @memberof GetCloudCallSignResp
     * @instance
     */
    GetCloudCallSignResp.prototype.signature = "";

    /**
     * Creates a new GetCloudCallSignResp instance using the specified properties.
     * @function create
     * @memberof GetCloudCallSignResp
     * @static
     * @param {IGetCloudCallSignResp=} [properties] Properties to set
     * @returns {GetCloudCallSignResp} GetCloudCallSignResp instance
     */
    GetCloudCallSignResp.create = function create(properties) {
        return new GetCloudCallSignResp(properties);
    };

    /**
     * Encodes the specified GetCloudCallSignResp message. Does not implicitly {@link GetCloudCallSignResp.verify|verify} messages.
     * @function encode
     * @memberof GetCloudCallSignResp
     * @static
     * @param {IGetCloudCallSignResp} message GetCloudCallSignResp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetCloudCallSignResp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.signature != null && message.hasOwnProperty("signature"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.signature);
        return writer;
    };

    /**
     * Encodes the specified GetCloudCallSignResp message, length delimited. Does not implicitly {@link GetCloudCallSignResp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GetCloudCallSignResp
     * @static
     * @param {IGetCloudCallSignResp} message GetCloudCallSignResp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetCloudCallSignResp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GetCloudCallSignResp message from the specified reader or buffer.
     * @function decode
     * @memberof GetCloudCallSignResp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GetCloudCallSignResp} GetCloudCallSignResp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetCloudCallSignResp.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GetCloudCallSignResp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.signature = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GetCloudCallSignResp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GetCloudCallSignResp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GetCloudCallSignResp} GetCloudCallSignResp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetCloudCallSignResp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GetCloudCallSignResp message.
     * @function verify
     * @memberof GetCloudCallSignResp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GetCloudCallSignResp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.signature != null && message.hasOwnProperty("signature"))
            if (!$util.isString(message.signature))
                return "signature: string expected";
        return null;
    };

    /**
     * Creates a GetCloudCallSignResp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GetCloudCallSignResp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GetCloudCallSignResp} GetCloudCallSignResp
     */
    GetCloudCallSignResp.fromObject = function fromObject(object) {
        if (object instanceof $root.GetCloudCallSignResp)
            return object;
        var message = new $root.GetCloudCallSignResp();
        if (object.signature != null)
            message.signature = String(object.signature);
        return message;
    };

    /**
     * Creates a plain object from a GetCloudCallSignResp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GetCloudCallSignResp
     * @static
     * @param {GetCloudCallSignResp} message GetCloudCallSignResp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GetCloudCallSignResp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.signature = "";
        if (message.signature != null && message.hasOwnProperty("signature"))
            object.signature = message.signature;
        return object;
    };

    /**
     * Converts this GetCloudCallSignResp to JSON.
     * @function toJSON
     * @memberof GetCloudCallSignResp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GetCloudCallSignResp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GetCloudCallSignResp;
})();

$root.AuthorizationInfo = (function() {

    /**
     * Properties of an AuthorizationInfo.
     * @exports IAuthorizationInfo
     * @interface IAuthorizationInfo
     * @property {AuthorizationInfo.ITcbCredentials|null} [tcbCredentials] AuthorizationInfo tcbCredentials
     * @property {Uint8Array|null} [wxParam] AuthorizationInfo wxParam
     */

    /**
     * Constructs a new AuthorizationInfo.
     * @exports AuthorizationInfo
     * @classdesc Represents an AuthorizationInfo.
     * @implements IAuthorizationInfo
     * @constructor
     * @param {IAuthorizationInfo=} [properties] Properties to set
     */
    function AuthorizationInfo(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * AuthorizationInfo tcbCredentials.
     * @member {AuthorizationInfo.ITcbCredentials|null|undefined} tcbCredentials
     * @memberof AuthorizationInfo
     * @instance
     */
    AuthorizationInfo.prototype.tcbCredentials = null;

    /**
     * AuthorizationInfo wxParam.
     * @member {Uint8Array} wxParam
     * @memberof AuthorizationInfo
     * @instance
     */
    AuthorizationInfo.prototype.wxParam = $util.newBuffer([]);

    /**
     * Creates a new AuthorizationInfo instance using the specified properties.
     * @function create
     * @memberof AuthorizationInfo
     * @static
     * @param {IAuthorizationInfo=} [properties] Properties to set
     * @returns {AuthorizationInfo} AuthorizationInfo instance
     */
    AuthorizationInfo.create = function create(properties) {
        return new AuthorizationInfo(properties);
    };

    /**
     * Encodes the specified AuthorizationInfo message. Does not implicitly {@link AuthorizationInfo.verify|verify} messages.
     * @function encode
     * @memberof AuthorizationInfo
     * @static
     * @param {IAuthorizationInfo} message AuthorizationInfo message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AuthorizationInfo.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.tcbCredentials != null && message.hasOwnProperty("tcbCredentials"))
            $root.AuthorizationInfo.TcbCredentials.encode(message.tcbCredentials, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.wxParam != null && message.hasOwnProperty("wxParam"))
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.wxParam);
        return writer;
    };

    /**
     * Encodes the specified AuthorizationInfo message, length delimited. Does not implicitly {@link AuthorizationInfo.verify|verify} messages.
     * @function encodeDelimited
     * @memberof AuthorizationInfo
     * @static
     * @param {IAuthorizationInfo} message AuthorizationInfo message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AuthorizationInfo.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an AuthorizationInfo message from the specified reader or buffer.
     * @function decode
     * @memberof AuthorizationInfo
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {AuthorizationInfo} AuthorizationInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AuthorizationInfo.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.AuthorizationInfo();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.tcbCredentials = $root.AuthorizationInfo.TcbCredentials.decode(reader, reader.uint32());
                break;
            case 2:
                message.wxParam = reader.bytes();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an AuthorizationInfo message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof AuthorizationInfo
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {AuthorizationInfo} AuthorizationInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AuthorizationInfo.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an AuthorizationInfo message.
     * @function verify
     * @memberof AuthorizationInfo
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    AuthorizationInfo.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.tcbCredentials != null && message.hasOwnProperty("tcbCredentials")) {
            var error = $root.AuthorizationInfo.TcbCredentials.verify(message.tcbCredentials);
            if (error)
                return "tcbCredentials." + error;
        }
        if (message.wxParam != null && message.hasOwnProperty("wxParam"))
            if (!(message.wxParam && typeof message.wxParam.length === "number" || $util.isString(message.wxParam)))
                return "wxParam: buffer expected";
        return null;
    };

    /**
     * Creates an AuthorizationInfo message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof AuthorizationInfo
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {AuthorizationInfo} AuthorizationInfo
     */
    AuthorizationInfo.fromObject = function fromObject(object) {
        if (object instanceof $root.AuthorizationInfo)
            return object;
        var message = new $root.AuthorizationInfo();
        if (object.tcbCredentials != null) {
            if (typeof object.tcbCredentials !== "object")
                throw TypeError(".AuthorizationInfo.tcbCredentials: object expected");
            message.tcbCredentials = $root.AuthorizationInfo.TcbCredentials.fromObject(object.tcbCredentials);
        }
        if (object.wxParam != null)
            if (typeof object.wxParam === "string")
                $util.base64.decode(object.wxParam, message.wxParam = $util.newBuffer($util.base64.length(object.wxParam)), 0);
            else if (object.wxParam.length)
                message.wxParam = object.wxParam;
        return message;
    };

    /**
     * Creates a plain object from an AuthorizationInfo message. Also converts values to other types if specified.
     * @function toObject
     * @memberof AuthorizationInfo
     * @static
     * @param {AuthorizationInfo} message AuthorizationInfo
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    AuthorizationInfo.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.tcbCredentials = null;
            if (options.bytes === String)
                object.wxParam = "";
            else {
                object.wxParam = [];
                if (options.bytes !== Array)
                    object.wxParam = $util.newBuffer(object.wxParam);
            }
        }
        if (message.tcbCredentials != null && message.hasOwnProperty("tcbCredentials"))
            object.tcbCredentials = $root.AuthorizationInfo.TcbCredentials.toObject(message.tcbCredentials, options);
        if (message.wxParam != null && message.hasOwnProperty("wxParam"))
            object.wxParam = options.bytes === String ? $util.base64.encode(message.wxParam, 0, message.wxParam.length) : options.bytes === Array ? Array.prototype.slice.call(message.wxParam) : message.wxParam;
        return object;
    };

    /**
     * Converts this AuthorizationInfo to JSON.
     * @function toJSON
     * @memberof AuthorizationInfo
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    AuthorizationInfo.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    AuthorizationInfo.TcbCredentials = (function() {

        /**
         * Properties of a TcbCredentials.
         * @memberof AuthorizationInfo
         * @interface ITcbCredentials
         * @property {string|null} [secretId] TcbCredentials secretId
         * @property {string|null} [secretKey] TcbCredentials secretKey
         * @property {string|null} [token] TcbCredentials token
         */

        /**
         * Constructs a new TcbCredentials.
         * @memberof AuthorizationInfo
         * @classdesc Represents a TcbCredentials.
         * @implements ITcbCredentials
         * @constructor
         * @param {AuthorizationInfo.ITcbCredentials=} [properties] Properties to set
         */
        function TcbCredentials(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TcbCredentials secretId.
         * @member {string} secretId
         * @memberof AuthorizationInfo.TcbCredentials
         * @instance
         */
        TcbCredentials.prototype.secretId = "";

        /**
         * TcbCredentials secretKey.
         * @member {string} secretKey
         * @memberof AuthorizationInfo.TcbCredentials
         * @instance
         */
        TcbCredentials.prototype.secretKey = "";

        /**
         * TcbCredentials token.
         * @member {string} token
         * @memberof AuthorizationInfo.TcbCredentials
         * @instance
         */
        TcbCredentials.prototype.token = "";

        /**
         * Creates a new TcbCredentials instance using the specified properties.
         * @function create
         * @memberof AuthorizationInfo.TcbCredentials
         * @static
         * @param {AuthorizationInfo.ITcbCredentials=} [properties] Properties to set
         * @returns {AuthorizationInfo.TcbCredentials} TcbCredentials instance
         */
        TcbCredentials.create = function create(properties) {
            return new TcbCredentials(properties);
        };

        /**
         * Encodes the specified TcbCredentials message. Does not implicitly {@link AuthorizationInfo.TcbCredentials.verify|verify} messages.
         * @function encode
         * @memberof AuthorizationInfo.TcbCredentials
         * @static
         * @param {AuthorizationInfo.ITcbCredentials} message TcbCredentials message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TcbCredentials.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.secretId != null && message.hasOwnProperty("secretId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.secretId);
            if (message.secretKey != null && message.hasOwnProperty("secretKey"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.secretKey);
            if (message.token != null && message.hasOwnProperty("token"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.token);
            return writer;
        };

        /**
         * Encodes the specified TcbCredentials message, length delimited. Does not implicitly {@link AuthorizationInfo.TcbCredentials.verify|verify} messages.
         * @function encodeDelimited
         * @memberof AuthorizationInfo.TcbCredentials
         * @static
         * @param {AuthorizationInfo.ITcbCredentials} message TcbCredentials message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TcbCredentials.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TcbCredentials message from the specified reader or buffer.
         * @function decode
         * @memberof AuthorizationInfo.TcbCredentials
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {AuthorizationInfo.TcbCredentials} TcbCredentials
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TcbCredentials.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.AuthorizationInfo.TcbCredentials();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.secretId = reader.string();
                    break;
                case 2:
                    message.secretKey = reader.string();
                    break;
                case 3:
                    message.token = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TcbCredentials message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof AuthorizationInfo.TcbCredentials
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {AuthorizationInfo.TcbCredentials} TcbCredentials
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TcbCredentials.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TcbCredentials message.
         * @function verify
         * @memberof AuthorizationInfo.TcbCredentials
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TcbCredentials.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.secretId != null && message.hasOwnProperty("secretId"))
                if (!$util.isString(message.secretId))
                    return "secretId: string expected";
            if (message.secretKey != null && message.hasOwnProperty("secretKey"))
                if (!$util.isString(message.secretKey))
                    return "secretKey: string expected";
            if (message.token != null && message.hasOwnProperty("token"))
                if (!$util.isString(message.token))
                    return "token: string expected";
            return null;
        };

        /**
         * Creates a TcbCredentials message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof AuthorizationInfo.TcbCredentials
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {AuthorizationInfo.TcbCredentials} TcbCredentials
         */
        TcbCredentials.fromObject = function fromObject(object) {
            if (object instanceof $root.AuthorizationInfo.TcbCredentials)
                return object;
            var message = new $root.AuthorizationInfo.TcbCredentials();
            if (object.secretId != null)
                message.secretId = String(object.secretId);
            if (object.secretKey != null)
                message.secretKey = String(object.secretKey);
            if (object.token != null)
                message.token = String(object.token);
            return message;
        };

        /**
         * Creates a plain object from a TcbCredentials message. Also converts values to other types if specified.
         * @function toObject
         * @memberof AuthorizationInfo.TcbCredentials
         * @static
         * @param {AuthorizationInfo.TcbCredentials} message TcbCredentials
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TcbCredentials.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.secretId = "";
                object.secretKey = "";
                object.token = "";
            }
            if (message.secretId != null && message.hasOwnProperty("secretId"))
                object.secretId = message.secretId;
            if (message.secretKey != null && message.hasOwnProperty("secretKey"))
                object.secretKey = message.secretKey;
            if (message.token != null && message.hasOwnProperty("token"))
                object.token = message.token;
            return object;
        };

        /**
         * Converts this TcbCredentials to JSON.
         * @function toJSON
         * @memberof AuthorizationInfo.TcbCredentials
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TcbCredentials.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return TcbCredentials;
    })();

    AuthorizationInfo.WxParam = (function() {

        /**
         * Properties of a WxParam.
         * @memberof AuthorizationInfo
         * @interface IWxParam
         * @property {Uint8Array|null} [qbaseTicket] WxParam qbaseTicket
         * @property {string|null} [authUin] WxParam authUin
         * @property {string|null} [extJson] WxParam extJson
         */

        /**
         * Constructs a new WxParam.
         * @memberof AuthorizationInfo
         * @classdesc Represents a WxParam.
         * @implements IWxParam
         * @constructor
         * @param {AuthorizationInfo.IWxParam=} [properties] Properties to set
         */
        function WxParam(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * WxParam qbaseTicket.
         * @member {Uint8Array} qbaseTicket
         * @memberof AuthorizationInfo.WxParam
         * @instance
         */
        WxParam.prototype.qbaseTicket = $util.newBuffer([]);

        /**
         * WxParam authUin.
         * @member {string} authUin
         * @memberof AuthorizationInfo.WxParam
         * @instance
         */
        WxParam.prototype.authUin = "";

        /**
         * WxParam extJson.
         * @member {string} extJson
         * @memberof AuthorizationInfo.WxParam
         * @instance
         */
        WxParam.prototype.extJson = "";

        /**
         * Creates a new WxParam instance using the specified properties.
         * @function create
         * @memberof AuthorizationInfo.WxParam
         * @static
         * @param {AuthorizationInfo.IWxParam=} [properties] Properties to set
         * @returns {AuthorizationInfo.WxParam} WxParam instance
         */
        WxParam.create = function create(properties) {
            return new WxParam(properties);
        };

        /**
         * Encodes the specified WxParam message. Does not implicitly {@link AuthorizationInfo.WxParam.verify|verify} messages.
         * @function encode
         * @memberof AuthorizationInfo.WxParam
         * @static
         * @param {AuthorizationInfo.IWxParam} message WxParam message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        WxParam.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.qbaseTicket != null && message.hasOwnProperty("qbaseTicket"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.qbaseTicket);
            if (message.authUin != null && message.hasOwnProperty("authUin"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.authUin);
            if (message.extJson != null && message.hasOwnProperty("extJson"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.extJson);
            return writer;
        };

        /**
         * Encodes the specified WxParam message, length delimited. Does not implicitly {@link AuthorizationInfo.WxParam.verify|verify} messages.
         * @function encodeDelimited
         * @memberof AuthorizationInfo.WxParam
         * @static
         * @param {AuthorizationInfo.IWxParam} message WxParam message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        WxParam.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a WxParam message from the specified reader or buffer.
         * @function decode
         * @memberof AuthorizationInfo.WxParam
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {AuthorizationInfo.WxParam} WxParam
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        WxParam.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.AuthorizationInfo.WxParam();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.qbaseTicket = reader.bytes();
                    break;
                case 2:
                    message.authUin = reader.string();
                    break;
                case 3:
                    message.extJson = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a WxParam message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof AuthorizationInfo.WxParam
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {AuthorizationInfo.WxParam} WxParam
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        WxParam.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a WxParam message.
         * @function verify
         * @memberof AuthorizationInfo.WxParam
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        WxParam.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.qbaseTicket != null && message.hasOwnProperty("qbaseTicket"))
                if (!(message.qbaseTicket && typeof message.qbaseTicket.length === "number" || $util.isString(message.qbaseTicket)))
                    return "qbaseTicket: buffer expected";
            if (message.authUin != null && message.hasOwnProperty("authUin"))
                if (!$util.isString(message.authUin))
                    return "authUin: string expected";
            if (message.extJson != null && message.hasOwnProperty("extJson"))
                if (!$util.isString(message.extJson))
                    return "extJson: string expected";
            return null;
        };

        /**
         * Creates a WxParam message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof AuthorizationInfo.WxParam
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {AuthorizationInfo.WxParam} WxParam
         */
        WxParam.fromObject = function fromObject(object) {
            if (object instanceof $root.AuthorizationInfo.WxParam)
                return object;
            var message = new $root.AuthorizationInfo.WxParam();
            if (object.qbaseTicket != null)
                if (typeof object.qbaseTicket === "string")
                    $util.base64.decode(object.qbaseTicket, message.qbaseTicket = $util.newBuffer($util.base64.length(object.qbaseTicket)), 0);
                else if (object.qbaseTicket.length)
                    message.qbaseTicket = object.qbaseTicket;
            if (object.authUin != null)
                message.authUin = String(object.authUin);
            if (object.extJson != null)
                message.extJson = String(object.extJson);
            return message;
        };

        /**
         * Creates a plain object from a WxParam message. Also converts values to other types if specified.
         * @function toObject
         * @memberof AuthorizationInfo.WxParam
         * @static
         * @param {AuthorizationInfo.WxParam} message WxParam
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        WxParam.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if (options.bytes === String)
                    object.qbaseTicket = "";
                else {
                    object.qbaseTicket = [];
                    if (options.bytes !== Array)
                        object.qbaseTicket = $util.newBuffer(object.qbaseTicket);
                }
                object.authUin = "";
                object.extJson = "";
            }
            if (message.qbaseTicket != null && message.hasOwnProperty("qbaseTicket"))
                object.qbaseTicket = options.bytes === String ? $util.base64.encode(message.qbaseTicket, 0, message.qbaseTicket.length) : options.bytes === Array ? Array.prototype.slice.call(message.qbaseTicket) : message.qbaseTicket;
            if (message.authUin != null && message.hasOwnProperty("authUin"))
                object.authUin = message.authUin;
            if (message.extJson != null && message.hasOwnProperty("extJson"))
                object.extJson = message.extJson;
            return object;
        };

        /**
         * Converts this WxParam to JSON.
         * @function toJSON
         * @memberof AuthorizationInfo.WxParam
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        WxParam.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return WxParam;
    })();

    return AuthorizationInfo;
})();

$root.ApiOptions = (function() {

    /**
     * Properties of an ApiOptions.
     * @exports IApiOptions
     * @interface IApiOptions
     * @property {string|null} [appid] ApiOptions appid
     */

    /**
     * Constructs a new ApiOptions.
     * @exports ApiOptions
     * @classdesc Represents an ApiOptions.
     * @implements IApiOptions
     * @constructor
     * @param {IApiOptions=} [properties] Properties to set
     */
    function ApiOptions(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ApiOptions appid.
     * @member {string} appid
     * @memberof ApiOptions
     * @instance
     */
    ApiOptions.prototype.appid = "";

    /**
     * Creates a new ApiOptions instance using the specified properties.
     * @function create
     * @memberof ApiOptions
     * @static
     * @param {IApiOptions=} [properties] Properties to set
     * @returns {ApiOptions} ApiOptions instance
     */
    ApiOptions.create = function create(properties) {
        return new ApiOptions(properties);
    };

    /**
     * Encodes the specified ApiOptions message. Does not implicitly {@link ApiOptions.verify|verify} messages.
     * @function encode
     * @memberof ApiOptions
     * @static
     * @param {IApiOptions} message ApiOptions message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ApiOptions.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.appid != null && message.hasOwnProperty("appid"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.appid);
        return writer;
    };

    /**
     * Encodes the specified ApiOptions message, length delimited. Does not implicitly {@link ApiOptions.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ApiOptions
     * @static
     * @param {IApiOptions} message ApiOptions message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ApiOptions.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an ApiOptions message from the specified reader or buffer.
     * @function decode
     * @memberof ApiOptions
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ApiOptions} ApiOptions
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ApiOptions.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ApiOptions();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.appid = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an ApiOptions message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ApiOptions
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ApiOptions} ApiOptions
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ApiOptions.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an ApiOptions message.
     * @function verify
     * @memberof ApiOptions
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ApiOptions.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.appid != null && message.hasOwnProperty("appid"))
            if (!$util.isString(message.appid))
                return "appid: string expected";
        return null;
    };

    /**
     * Creates an ApiOptions message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ApiOptions
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ApiOptions} ApiOptions
     */
    ApiOptions.fromObject = function fromObject(object) {
        if (object instanceof $root.ApiOptions)
            return object;
        var message = new $root.ApiOptions();
        if (object.appid != null)
            message.appid = String(object.appid);
        return message;
    };

    /**
     * Creates a plain object from an ApiOptions message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ApiOptions
     * @static
     * @param {ApiOptions} message ApiOptions
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ApiOptions.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.appid = "";
        if (message.appid != null && message.hasOwnProperty("appid"))
            object.appid = message.appid;
        return object;
    };

    /**
     * Converts this ApiOptions to JSON.
     * @function toJSON
     * @memberof ApiOptions
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ApiOptions.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ApiOptions;
})();

module.exports = $root;


/***/ }),

/***/ "./src/utils/assert.ts":
/*!*****************************!*\
  !*** ./src/utils/assert.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.assertObjectNotEmpty = exports.assertRequiredParam = exports.assertObjectOptionalType = exports.assertType = exports.validObjectOptionalType = exports.validType = exports.sameType = void 0;
const type_1 = __webpack_require__(/*! ./type */ "./src/utils/type.ts");
const error_1 = __webpack_require__(/*! ./error */ "./src/utils/error.ts");
const error_config_1 = __webpack_require__(/*! config/error.config */ "./src/config/error.config.ts");
function sameType(input, ref, name) {
    function sameTypeImpl(input, ref, name) {
        const inputType = type_1.getType(input);
        const refType = type_1.getType(ref);
        if (inputType !== refType) {
            return `${name} should be ${refType} instead of ${inputType}; `;
        }
        let errors = '';
        switch (inputType) {
            case 'object': {
                for (const key in ref) {
                    errors += sameTypeImpl(input[key], ref[key], `${name}.${key}`);
                }
                break;
            }
            case 'array': {
                for (let i = 0; i < ref.length; i++) {
                    errors += sameTypeImpl(input[i], ref[i], `${name}[${i}]`);
                }
                break;
            }
            default: {
                break;
            }
        }
        return errors;
    }
    const error = sameTypeImpl(input, ref, name);
    return {
        passed: !error,
        reason: error,
    };
}
exports.sameType = sameType;
function validType(input, ref, name = 'parameter') {
    function validTypeImpl(input, ref, name) {
        const inputType = type_1.getType(input);
        const refType = type_1.getType(ref);
        if (refType === 'string') {
            if (inputType !== ref) {
                return `${name} should be ${ref} instead of ${inputType};`;
            }
            return '';
        }
        else {
            if (inputType !== refType) {
                return `${name} should be ${refType} instead of ${inputType}; `;
            }
            let errors = '';
            switch (inputType) {
                case 'object': {
                    for (const key in ref) {
                        errors += validTypeImpl(input[key], ref[key], `${name}.${key}`);
                    }
                    break;
                }
                case 'array': {
                    for (let i = 0; i < ref.length; i++) {
                        errors += validTypeImpl(input[i], ref[i], `${name}[${i}]`);
                    }
                    break;
                }
                default: {
                    break;
                }
            }
            return errors;
        }
    }
    const error = validTypeImpl(input, ref, name);
    return {
        passed: !error,
        reason: error,
    };
}
exports.validType = validType;
function validObjectOptionalType(input, ref, name = 'parameter') {
    function validImpl(input, ref, name) {
        const inputType = type_1.getType(input);
        const refType = type_1.getType(ref);
        if (refType !== 'object')
            return '';
        if (inputType === 'object') {
            for (const key in input) {
                const val = input[key];
                if (val === undefined || key === null) {
                    continue;
                }
                const assertResult = validType(val, ref[key], `${name}.${key}`);
                return assertResult.passed ? '' : assertResult.reason;
            }
        }
        else {
            return `${name} should be object instead of ${inputType}`;
        }
        return '';
    }
    const error = validImpl(input, ref, name);
    return {
        passed: !error,
        reason: error,
    };
}
exports.validObjectOptionalType = validObjectOptionalType;
function assertType(param, ref, name = 'parameter', ErrorClass = error_1.CloudSDKError) {
    // check param validity
    let paramCheckResult = validType(param, ref, name);
    if (!paramCheckResult.passed) {
        throw new ErrorClass({
            errMsg: paramCheckResult.reason,
        });
    }
}
exports.assertType = assertType;
function assertObjectOptionalType(param, ref, name = 'parameter', ErrorClass = error_1.CloudSDKError) {
    // check param validity
    let paramCheckResult = validObjectOptionalType(param, ref, name);
    if (!paramCheckResult.passed) {
        throw new ErrorClass({
            errMsg: paramCheckResult.reason,
        });
    }
}
exports.assertObjectOptionalType = assertObjectOptionalType;
function assertRequiredParam(param, name, funcName, ErrorClass = error_1.CloudSDKError) {
    if (param === undefined || param === null) {
        throw new ErrorClass({
            errMsg: `parameter ${name} of function ${funcName} must be provided`,
        });
    }
}
exports.assertRequiredParam = assertRequiredParam;
function assertObjectNotEmpty({ target, name, ErrorClass = error_1.CloudSDKError }) {
    if (Object.keys(target).length === 0) {
        throw new ErrorClass({
            errCode: error_config_1.ERR_CODE.SDK_API_PARAMETER_ERROR,
            errMsg: `${name} must not be empty`
        });
    }
}
exports.assertObjectNotEmpty = assertObjectNotEmpty;
/*
export function constructTypeRef(typeDef: any): any {

  const type = getType(typeDef)

  switch(type) {
    case 'string': {
      return ''
    }
    case 'number': {

    }
  }

}
*/ 


/***/ }),

/***/ "./src/utils/error.ts":
/*!****************************!*\
  !*** ./src/utils/error.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.toSDKError = exports.returnAsFinalCloudSDKError = exports.returnAsCloudSDKError = exports.isSDKError = exports.createError = exports.CloudSDKError = void 0;
const type_1 = __webpack_require__(/*! ./type */ "./src/utils/type.ts");
const error_config_1 = __webpack_require__(/*! config/error.config */ "./src/config/error.config.ts");
/**
 * @deprecated
 */
class CloudSDKError extends Error {
    constructor(options) {
        super(options.errMsg);
        this.errCode = -1;
        Object.defineProperties(this, {
            message: {
                get() {
                    return `errCode: ${this.errCode} ${error_config_1.ERR_CODE[this.errCode] || ''} | errMsg: ` + this.errMsg;
                },
                set(msg) {
                    this.errMsg = msg;
                }
            }
        });
        this.errCode = options.errCode || -1;
        this.errMsg = options.errMsg;
    }
    get message() {
        return `errCode: ${this.errCode} | errMsg: ` + this.errMsg;
    }
    set message(msg) {
        this.errMsg = msg;
    }
}
exports.CloudSDKError = CloudSDKError;
/**
 * @deprecated
 */
function createError({ errCode = 1, errMsg = '', errClass = CloudSDKError, } = {}) {
    return new errClass({
        errCode,
        errMsg,
    });
}
exports.createError = createError;
function isSDKError(error) {
    return error && (error instanceof Error) && type_1.isString(error.errMsg);
}
exports.isSDKError = isSDKError;
/**
 * @deprecated
 */
function returnAsCloudSDKError(err, appendMsg = '') {
    if (err) {
        if (isSDKError(err)) {
            if (appendMsg) {
                err.errMsg += '; ' + appendMsg;
            }
            return err;
        }
        const errCode = err ? err.errCode : undefined;
        const errMsg = (err && err.errMsg || err.toString() || 'unknown error') + '; ' + appendMsg;
        return new CloudSDKError({
            errCode,
            errMsg,
        });
    }
    return new CloudSDKError({
        errMsg: appendMsg
    });
}
exports.returnAsCloudSDKError = returnAsCloudSDKError;
/**
 * @deprecated
 */
function returnAsFinalCloudSDKError(err, apiName) {
    return toSDKError(err, apiName);
    // if (err && isSDKError(err)) {
    //   return err
    // }
    // const e = returnAsCloudSDKError(err, `at ${apiName} api; `)
    // e.errMsg = apiFailMsg(apiName, e.errMsg)
    // return e
}
exports.returnAsFinalCloudSDKError = returnAsFinalCloudSDKError;
function toSDKError(e, apiName) {
    if (e) {
        if (isSDKError(e)) {
            return e;
        }
        const prefix = `${apiName}:fail `;
        let err;
        if (e instanceof Error) {
            e.message = `${prefix}${e.message}`;
            e.stack = e.stack.slice(0, 7) + prefix + e.stack.slice(7);
            err = e;
            err.errCode = -1;
        }
        else if (typeof e === 'string') {
            err = new Error(`${prefix}${e}`);
            err.errCode = -1;
        }
        else {
            // errCode + errMsg
            const errMsg = e.errMsg || '';
            err = new Error(`${apiName}:fail ${e.errCode} ${error_config_1.ERR_CODE[e.errCode] || ''}. ${errMsg}`);
            err.errCode = e.errCode || -1;
        }
        err.errMsg = err.message + '';
        return err;
    }
    const err = new Error(`${apiName}:fail`);
    err.errCode = -1;
    err.errMsg = err.message + '';
    return err;
}
exports.toSDKError = toSDKError;


/***/ }),

/***/ "./src/utils/msg.ts":
/*!**************************!*\
  !*** ./src/utils/msg.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.apiFailMsg = exports.apiCancelMsg = exports.apiSuccessMsg = void 0;
function apiSuccessMsg(apiName) {
    return `${apiName}:ok`;
}
exports.apiSuccessMsg = apiSuccessMsg;
function apiCancelMsg(apiName, msg) {
    return `${apiName}:cancel ${msg}`;
}
exports.apiCancelMsg = apiCancelMsg;
function apiFailMsg(apiName, msg) {
    return `${apiName}:fail ${msg}`;
}
exports.apiFailMsg = apiFailMsg;


/***/ }),

/***/ "./src/utils/symbol.ts":
/*!*****************************!*\
  !*** ./src/utils/symbol.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalSymbol = void 0;
const _symbols = [];
const __internalMark__ = {};
class HiddenSymbol {
    constructor(target) {
        Object.defineProperties(this, {
            target: {
                enumerable: false,
                writable: false,
                configurable: false,
                value: target,
            },
        });
    }
}
class InternalSymbol extends HiddenSymbol {
    constructor(target, __mark__) {
        if (__mark__ !== __internalMark__) {
            throw new TypeError('InternalSymbol cannot be constructed with new operator');
        }
        super(target);
    }
    static for(target) {
        for (let i = 0, len = _symbols.length; i < len; i++) {
            if (_symbols[i].target === target) {
                return _symbols[i].instance;
            }
        }
        const symbol = new InternalSymbol(target, __internalMark__);
        _symbols.push({
            target,
            instance: symbol,
        });
        return symbol;
    }
}
exports.InternalSymbol = InternalSymbol;
exports.default = InternalSymbol;


/***/ }),

/***/ "./src/utils/type.ts":
/*!***************************!*\
  !*** ./src/utils/type.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isPlainObject = exports.isInternalObject = exports.isBuffer = exports.isDate = exports.isArray = exports.isFunction = exports.isPromise = exports.isNumber = exports.isString = exports.isObject = exports.getType = void 0;
const symbol_1 = __webpack_require__(/*! ./symbol */ "./src/utils/symbol.ts");
exports.getType = (x) => Object.prototype.toString.call(x).slice(8, -1).toLowerCase();
exports.isObject = (x) => exports.getType(x) === 'object';
exports.isString = (x) => exports.getType(x) === 'string';
exports.isNumber = (x) => exports.getType(x) === 'number';
exports.isPromise = (x) => exports.getType(x) === 'promise';
exports.isFunction = (x) => typeof x === 'function';
exports.isArray = (x) => Array.isArray(x);
exports.isDate = (x) => exports.getType(x) === 'date';
exports.isBuffer = (x) => Buffer.isBuffer(x);
exports.isInternalObject = (x) => x && (x._internalType instanceof symbol_1.InternalSymbol);
exports.isPlainObject = (obj) => {
    if (typeof obj !== 'object' || obj === null)
        return false;
    let proto = obj;
    while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(obj) === proto;
};


/***/ }),

/***/ "./src/utils/utils.ts":
/*!****************************!*\
  !*** ./src/utils/utils.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getMergedAPIConfig = exports.getServiceConfigFromDefaultConfig = exports.getEnvFromAPIConfig = exports.getEnvFromCloudConfig = exports.isSCFEnvReady = exports.convertCase = void 0;
const type_1 = __webpack_require__(/*! ./type */ "./src/utils/type.ts");
const signature_1 = __webpack_require__(/*! api/utils/api/signature */ "./src/api/utils/api/signature.ts");
const ignoreInConvert = (input) => input instanceof signature_1.MidasSignature;
exports.convertCase = (input, options) => {
    const { from, to, recursive } = options;
    if (type_1.isString(input)) {
        if (from === 'camelcase' && to === 'snakecase') {
            return input.replace(/[A-Z]/g, (match, ind) => `${ind ? '_' : ''}${match.toLowerCase()}`);
        }
        else if (from === 'snakecase' && to === 'camelcase') {
            return input.replace(/_[a-z]/g, (match, ind) => `${match[1].toUpperCase()}`);
        }
    }
    else if (type_1.isObject(input)) {
        return ignoreInConvert(input) ? input : convertObject(input);
    }
    else if (type_1.isArray(input)) {
        const array = [];
        for (const item of input) {
            if (type_1.isObject(item)) {
                array.push(convertObject(item));
            }
            else if (type_1.isArray(item)) {
                if (options.recursive) {
                    array.push(exports.convertCase(item, options));
                }
                else {
                    array.push(item);
                }
            }
            else {
                array.push(item);
            }
        }
        return array;
    }
    else
        return input;
    function convertObject(input) {
        const data = Object.assign({}, input);
        for (const key in data) {
            const val = recursive && (type_1.isObject(data[key]) || type_1.isArray(data[key])) ? exports.convertCase(data[key], options) : data[key];
            const convertedKey = exports.convertCase(key, options);
            data[convertedKey] = val;
            if (convertedKey !== key) {
                delete data[key];
            }
        }
        return data;
    }
};
exports.isSCFEnvReady = () => Boolean(process.env.TCB_ENV);
exports.getEnvFromCloudConfig = (config, serviceName = 'default') => {
    const env = config.env[serviceName] || config.env.default;
    return env;
};
exports.getEnvFromAPIConfig = (apiConfig, cloudConfig, serviceName = 'default') => {
    if (apiConfig && apiConfig.env) {
        return apiConfig.env;
    }
    return exports.getEnvFromCloudConfig(cloudConfig, serviceName);
};
exports.getServiceConfigFromDefaultConfig = (defaultConfig, serviceName = 'default') => {
    return Object.assign(Object.assign({}, defaultConfig), { env: exports.getEnvFromCloudConfig(defaultConfig, serviceName) });
};
exports.getMergedAPIConfig = (defaultConfig, newConfig, serviceName = 'default') => {
    const merged = Object.assign(Object.assign({}, defaultConfig), newConfig);
    if (newConfig && newConfig.env) {
        merged.env = newConfig.env;
    }
    else {
        merged.env = exports.getEnvFromCloudConfig(defaultConfig, serviceName);
    }
    return merged;
};


/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),

/***/ "protobufjs/minimal":
/*!*************************************!*\
  !*** external "protobufjs/minimal" ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("protobufjs/minimal");

/***/ })

/******/ });