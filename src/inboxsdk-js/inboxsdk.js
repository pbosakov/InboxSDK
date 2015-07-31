import assign from 'lodash/object/assign';

var PlatformImplementationLoader = require('./loading/platform-implementation-loader');
var checkRequirements = require('./check-requirements');

/**
* @class
* The functions in this class are only used for load related functionality like loading the SDK itself or other external scripts.
*/
var InboxSDK = {
  LOADER_VERSION: process.env.VERSION
};

/**
* Loads the InboxSDK remotely and prepares it to be used.
* @function
* @param {string} version - The version of the SDK to load, the only acceptable value currently is "1.0".
* @param {string} appId - The AppId that you registered for on the <a href="/register">AppId Registration page</a>.
* @param {LoadOptions} opts - Options for the loading of the SDK
* @return {Promise} A promise which resolves when the SDK is loaded and ready to be used.
*/
InboxSDK.load = function(version, appId, opts){
  opts = assign({
    // defaults
    globalErrorLogging: true
  }, opts, {
    // stuff that can't be overridden, such as extra stuff this file passes to
    // the implementation script.
    VERSION: InboxSDK.LOADER_VERSION,
    REQUESTED_API_VERSION: version
  });

  checkRequirements(opts);

  var loadPromise = PlatformImplementationLoader.load(appId, opts);
  loadPromise.catch(function(err) {
    console.error("Failed to load implementation:", err, err && err.stack);
  });
  return loadPromise;
};

/**
* Loads a remote script into this extension's content script space and evals it
* @function
* @param {string} url - The URL of the remote script to load.
* @return {Promise} a promise which resolves when this script is finished downloading and eval'ing
*/

InboxSDK.loadScript = require('../common/load-script');

if (['https://mail.google.com', 'https://inbox.google.com'].indexOf(document.location.origin) != -1) {
  PlatformImplementationLoader.preload();
}

module.exports = InboxSDK;

/**
 * @class
 * This type is passed into {load} method.
 */
var LoadOptions = /** @lends LoadOptions */{
	/**
  * The name of your app. This is used by several methods in the SDK.
  * ^optional
  * ^default=null
  * @type {string}
	 */
	appName: null,

	/**
	 * The URL of the icon of your app. Can be HTTPS or a chrome runtime url.
	 * ^optional
	 * ^default=null
	 * @type {string}
	 */
	appIconUrl:null
};
