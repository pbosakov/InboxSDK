/* @flow */
//jshint ignore:start

var _ = require('lodash');
var RSVP = require('rsvp');
var cproc = require('child_process');
var globp = RSVP.denodeify(require('glob'));

// Support Chrome Extensions Reloader
// https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid

function getUserHome() {
  return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
}

// Returns null if no Chrome profiles have the extension installed. If it the
// extension is installed, it returns the name of Chrome name suffix (such as
// "", " Canary", etc).
var getchromeSuffixWithReloaderExtension = _.once(function() {
  var path = getUserHome() +
    '/Library/Application Support/Google/Chrome*/*/Extensions/fimgfedafeadlieiabdeeaodndnlbhid';
  return globp(path).then(function(results) {
    var path = results[0];
    if (path) {
      return path.match(/Chrome([^\/]*)\//)[1];
    }
    return null;
  });
});

var getChromeLocation = _.memoize(function(chromeSuffix) {
  if (!chromeSuffix) {
    chromeSuffix = '';
  }
  var path =
    '/Applications/Google Chrome'+chromeSuffix+'.app/Contents/MacOS/Google Chrome*';
  return globp(path).then(function(results) {
    return results[0];
  });
});

export default function extensionReload() {
  return getchromeSuffixWithReloaderExtension().then(function(chromeSuffix) {
    if (chromeSuffix != null) {
      return getChromeLocation(chromeSuffix).then(function(chrome) {
        if (chrome) {
          cproc.spawn(chrome, ["http://reload.extensions"]);
        }
      });
    }
  });
}
