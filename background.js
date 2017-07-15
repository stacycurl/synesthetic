
// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  // function injectScript(func) {
    // return '(' + func + ')();';
  // }

  // function executeScript(files, script) {
    // if (files.length == 0) {
      // chrome.tabs.executeScript(script);
    // } else {
      // chrome.tabs.executeScript(
          // null,
          // { file: files[0] },
          // function () { executeScript(files.slice(1), script) }
      // );
    // }
  // }

  // chrome.tabs.executeScript(null, {file: "elm.js"}, function() {
    chrome.tabs.executeScript(null, {file: "cube-3d/squares.js"}, function() {
      chrome.tabs.executeScript(null, {file: "backgroundBody.js"}, function() {
        chrome.tabs.executeScript(null, {code: "impl();"});
      });
    });
  // });

  // executeScript(["elm.js", "cube-3d/squares.js", "backgroundImpl.js"], {
    // code: "impl();"
  // });
});
