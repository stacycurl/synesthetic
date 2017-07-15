var _stacycurl$synesthetic$Native_Canvas = function() {
  var createNode = typeof document === 'undefined'
		?
			function(_)
			{
				return {
					style: {},
					appendChild: function() {}
				};
			}
		:
			function(elementType)
			{
				var node = document.createElement(elementType);
				node.style.padding = '0';
				node.style.margin = '0';
				return node;
			}
		;

  return {
    addOne: F2(function(width, height) {
      var canvas = createNode('canvas');
      canvas.width          = width;
      canvas.height         = height;
      canvas.style.zIndex   = 8;
      canvas.style.position = "relative";
      canvas.style.border   = "1px solid";

      var ctx=canvas.getContext("2d");
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, width, height)

      return createNode;
    })
  };
}();
