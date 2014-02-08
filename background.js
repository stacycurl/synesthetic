
// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  function injectScript(func) {
    return '(' + func + ')();';
  }

  //console.log('Substituting ...');

  chrome.tabs.executeScript(null, { file: "cube-3d/squares.js" }, function() {
  chrome.tabs.executeScript({
    code: injectScript(function() {
      var options = new Options()

      options.isSolid(function(result) {
        var substitutor = new Substitutor(result)

        substitutor.apply()
      })
    })
  })})
});
