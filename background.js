
// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  function injectScript(func) {
    return '(' + func + ')();';
  }

  //console.log('Substituting ...');

  chrome.tabs.executeScript(null, { file: "cube-3d/squares.js" }, function() {
  chrome.tabs.executeScript({
    code: injectScript(function() {
      function mapText(update) {
        function recurse(element) {
          if (element.childNodes.length > 0) {
            for (var i = 0; i < element.childNodes.length; i++) {
              recurse(element.childNodes[i]);
            }
          }

          if (element.nodeType == Node.TEXT_NODE && /\S/.test(element.nodeValue)) {
            element.parentNode.replaceChild(update(element), element);
          }
        }

        recurse(document.getElementsByTagName('html')[0]);
      }

      var cube = new LetterCube({})

      var mapping = cube.initial() // toHex()

      function drawTexts(texts, ctx) {
        // console.log("drawTexts.texts:", texts)
        for (var y = 0; y < texts.length; y++) {
          var text = texts[y].replace(/[^a-zA-Z ,]/g, '')
          // console.log("drawTexts.text:", text);

          for (var x in text) {
            draw(text[x], x, y, ctx)
          }
        }
      }

      var xsize = 5;
      var ysize = 5;
      var maxWords = 13
      var gap = ysize
      var letterHeight = ysize
      var spaces = " "

      function draw(letter, xoffset, yoffset, ctx) {
        // console.log("draw.letter:", [letter, xoffset, yoffset]);
        var mapped = mapping[letter];

        if (mapped !== undefined) {
          drawRect(
            ctx,
            1 + xoffset * xsize,
            1 + yoffset * (gap + letterHeight),
            mapped
          );
        }
      }

      function drawRect(ctx, x, y, fill) {
        // console.log("drawRect:", [x, y, fill]);
        ctx.fillStyle = fill;
        ctx.fillRect(x, y, xsize, ysize);
      }

      function groupByN(array, n) {
        var result = [];

        for (var i = 0; i < array.length; i += n) {
          var element = array.slice(i, i + n).join(spaces);
          // console.log("groupByN", [i, element]);
          result.push(element);
        }

        // console.log("groupByN.result", result);
        return result;
      }

      function groupText(text, words) {
        var texts = groupByN(text.toLowerCase().split(' '), words);
        //var texts = groupByN(text.split(' '), words);

        // console.log("groupText.result", texts);
        return texts
      }

      // console.log(groupText("blah blah yada yada", 2))

      //*
      mapText(function(element) {
        var texts = groupText(element.nodeValue, maxWords)
        //console.log("mapText.texts", texts)

        var maxText = texts.reduce(function(acc, text) {
          return Math.max(acc, text.length)
        }, 0)

        var range = document.createRange();
        range.selectNodeContents(element);
        var rect = range.getBoundingClientRect();
        var width = xsize * maxText + 2;
        var height = 2 + (texts.length * letterHeight) + ((texts.length - 1) * gap);
        // console.log([maxText, width, height, texts, texts.length]);
        var canvas = document.createElement('canvas');
        canvas.title = element.nodeValue

        canvas.id     = "CursorLayer";
        canvas.width  = width;
        canvas.height = height;
        canvas.style.zIndex   = 8;
        canvas.style.position = "relative";
        canvas.style.border   = "1px solid";

        var ctx=canvas.getContext("2d");
        drawTexts(texts, ctx);
        return canvas;
      });
      //*/
    })
  })})
});
