
// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  function injectScript(func) {
    return '(' + func + ')();';
  }

  //console.log('Substituting ...');

  chrome.tabs.executeScript(null, { file: "cube-3d/squares.js" }, function() {
  chrome.tabs.executeScript({
    code: injectScript(function() {
      function Substitutor(solid) {
        var cube = new LetterCube({})

        this.mapping = cube.initial() // toHex()
        this.solid = solid
        this.xsize = 5;
        this.ysize = 5;
        this.maxWords = 13
        this.gap = this.ysize
        this.letterHeight = this.ysize
        this.spaces = " "
      }

      Substitutor.prototype = {
        mapText: function(update) {
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
        },
        drawTexts: function(texts, ctx) {
          // console.log("drawTexts.texts:", texts)
          for (var y = 0; y < texts.length; y++) {
            var text = texts[y].replace(/[^a-zA-Z ,]/g, '')
            // console.log("drawTexts.text:", text);

            for (var x in text) {
              this.draw(text[x], x, y, ctx)
            }
          }
        },
        draw: function(letter, xoffset, yoffset, ctx) {
          // console.log("draw.letter:", [letter, xoffset, yoffset]);
          var mapped = this.mapping[letter];
          // console.log('mapped', letter, mapped)

          if (mapped !== undefined) {
            this.drawRect(
              ctx,
              1 + xoffset * this.xsize,
              1 + yoffset * (this.gap + this.letterHeight),
              mapped
            );
          }
        },
        drawRect: function(ctx, x, y, fill) {
          // console.log("drawRect:", [x, y, fill]);
          ctx.fillStyle = fill;
          ctx.fillRect(x, y, this.xsize, this.ysize);
        },
        groupByN: function(array, n) {
          var result = [];

          for (var i = 0; i < array.length; i += n) {
            var element = array.slice(i, i + n).join(this.spaces);
            // console.log("groupByN", [i, element]);
            result.push(element);
          }

          // console.log("groupByN.result", result);
          return result;
        },
        groupText: function(text, words) {
          var texts = this.groupByN(text.toLowerCase().split(' '), words);
          //var texts = groupByN(text.split(' '), words);

          // console.log("groupText.result", texts);
          return texts
        },
        apply: function() {
          var self = this

          this.mapText(function(element) {
            // console.log('mapText.element', element)
            var texts = self.groupText(element.nodeValue, self.maxWords)
            // console.log("mapText.texts", texts)

            var maxText = texts.reduce(function(acc, text) {
              return Math.max(acc, text.length)
            }, 0)

            var range = document.createRange();
            range.selectNodeContents(element);
            var rect = range.getBoundingClientRect();
            var width = self.xsize * maxText + 2;
            var height = 2 + (texts.length * self.letterHeight) + ((texts.length - 1) * self.gap);
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
            ctx.fillStyle = "#ffffff"
            ctx.fillRect(0, 0, width, height)
            self.drawTexts(texts, ctx);
            return canvas;
          });
        }
      }

      var options = new Options()

      options.isSolid(function(result) {
        var substitutor = new Substitutor(result)

        substitutor.apply()
      })
    })
  })})
});
