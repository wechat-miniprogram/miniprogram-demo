/**
 * Created by zhangmiao on 2018/3/14.
 */
module.exports = inquire;

/**
 * Requires a module only if available.
 * @memberof util
 * @param {string} moduleName Module to require
 * @returns {?Object} Required module if available and not empty, otherwise `null`
 */
const app = getApp();
app.globalData.pbModuleMap = app.globalData.pbModuleMap || {};
function inquire(moduleName) {
    var moduleMap = app.globalData.pbModuleMap;
    var arr = moduleName.split('/');
    var name = arr[arr.length -1];
    if(typeof moduleMap[name] != 'undefined')
    {
        return moduleMap[name];
    }

    try {
        var mod = require(moduleName);
        if (mod) {
            moduleMap[name] = mod;
            return mod;
        }
        else {
            console.log('没有加载到该模块')
        }
    } catch (e) {} // eslint-disable-line no-empty
    return null;
}