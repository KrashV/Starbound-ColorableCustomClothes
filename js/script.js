// Script handler

var cuurentImage;
var originalImageData, currentImageData;
var colorTable;
var cuurentDyeIndex = 0;

// On load
$(function() {
	
	// Bind image
	$('#btnSelectImage').on('click', function() {
		$('#selectImage').trigger('click');
	});
	
	$("#selectImage").change(function() {
		cuurentImage = null;
		originalImageData = null;
		currentImageData = null;
		readImageInput(this, imageLoaded);
		resetColorTable();
		$('#result').val('\"colorOptions\":'+JSON.stringify(colorTable));
		this.value = "";
	});
	
	// Load preview
	img = new Image();
	img.onload = function() {
		drawResizedImage($("#cvsPrevewImage").get(0), img, 2);
		resetColorTable();
	};
	img.src = "images/pants.png";
});

/**
  * Reads the image input
  * https://github.com/Silverfeelin/Starbound-Hatter/blob/master/scripts/drawables.js
**/
function readImageInput(input, callback) {
	if (input.files && input.files.length > 0) {
		// Use first file. By default, users shouldn't be able to select multiple files.
		var file = input.files[0];

		var fr = new FileReader();
		fr.onload = function() {
		  var img = new Image;
		  img.onload = callback;

		  img.src = this.result;
		};
		fr.readAsDataURL(file);
	}
}

/**
  * Process the loading of the selected image
  * https://github.com/Silverfeelin/Starbound-Hatter/blob/master/scripts/drawables.js
**/
function imageLoaded() {
  var image = this;
  // Animate the preview update in three steps.
  var step = -1;

  var steps = [
    // Step one: Fade out the previous hat, if there is one.
    function() {
      if ($("#cvsPrevewImage").is(":visible"))
        $("#cvsPrevewImage").fadeOut(100, nextStep);
      else
        nextStep();
    },
    // Step two: Draw the new hat, and animate the preview dimensions if the new hat is bigger or smaller than the previous hat.
    function() {
      cuurentImage = image;
	  
      clearCanvas($("#cvsPrevewImage").get(0));
      var bot, lef;
	  drawResizedImage($("#cvsPrevewImage").get(0), cuurentImage, 2);
	  bot = cuurentImage.height*2,
	  lef = cuurentImage.width*2;
	  $("#cvsPrevewImage").animate({bottom: bot, left: lef}, 200, nextStep);
    },
    // Step three: Fade in the new hat.
    function() {
      $("#cvsPrevewImage").fadeIn(100);
    }
  ];

  var nextStep = function() {
    if (typeof(steps[++step]) == "function")
      steps[step]();
  };

  nextStep();
}

/**
 * Clears the given canvas, or a part of it.
 * @param {object} canvas - DOM element to clear.
 * @param {number} [dx=0] - X-coordinate of the upper left corner of the area to clear.
 * @param {number} [dy=0] - Y-coordinate of the upper left corner of the area to clear.
 * @param {number} [width=canvas.width] - Width of area to clear.
 * @param {number} [height=canvas.height] - Height of area to clear.
 */
function clearCanvas(canvas, dx, dy, width, height) {
  if (dx === undefined || dx == null)
    dx = 0;
  if (dy === undefined || dy == null)
    dy = 0;
  if (width === undefined || width == null)
    width = canvas.width;
  if (height === undefined || height == null)
    height = canvas.height;

  var context = canvas.getContext('2d');

  context.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Draws the given image on the canvas. Scaling is done without smoothing.
 * Sets the canvas to to the desired width and height, or calculate these values from the image dimensions and scale.
 * @param {object} canvas - Canvas DOM element to draw the image on.
 * @param {object} image - Image to draw.
 * @param {number} [scale=1] Scale of image, 1 is original size.
 * @param {object} [srcStart=[0,0]] Start point of the source image.
 * @param {object} [srcSize] Size of the region to capture from the source image. Defaults to (image size - srcStart).
 * @param {object} [destStart=[0,0]] Destination point of the drawn image.
 * @param {object} [destSize] Size of drawn image. Defaults to srcSize * scale.
 */
function drawResizedImage(canvas, image, scale, srcStart, srcSize, destStart, destSize) {
	
  if (scale === undefined || scale == null)
    scale = 1;
  if (srcStart === undefined || srcStart == null)
    srcStart = [0,0];
  if (srcSize === undefined || srcSize == null)
    srcSize = [image.width - srcStart[0], image.height - srcStart[1]];
  if (destStart === undefined || destStart == null)
    destStart = [0,0];
  if (destSize === undefined || destSize == null)
    destSize = [srcSize[0] * scale, srcSize[1] * scale];

  if (canvas.width != destSize[0] || canvas.height != destSize[1])
  {
    $(canvas).css("width", destSize[0]);
    $(canvas).css("height", destSize[1]);
    canvas.setAttribute("width", destSize[0]);
    canvas.setAttribute("height", destSize[1]);
  }

  var context = canvas.getContext('2d');

  context.mozImageSmoothingEnabled = false;
  context.msImageSmoothingEnabled = false;
  context.imageSmoothingEnabled = false;
  context.drawImage(image, srcStart[0], srcStart[1], srcSize[0], srcSize[1], destStart[0], destStart[1], destSize[0], destSize[1]);
  originalImageData = context.getImageData(srcStart[0], srcStart[1], destSize[0], destSize[1]);
  currentImageData = new ImageData(
	  new Uint8ClampedArray(originalImageData.data),
	  originalImageData.width,
	  originalImageData.height
	)
}

/**
  * Updates the color on the canvas
  * @param {jscolor} newColor - new color
  * @param {array} baseColor - RGB value of the base image
**/
function updateColor(newColor, baseColor) {
	// examine every pixel, 
	// change any old rgb to the new-rgb
	var imageDataCopy = new ImageData(
	  new Uint8ClampedArray(currentImageData.data),
	  currentImageData.width,
	  currentImageData.height
	)
	for (var i=0;i<imageDataCopy.data.length;i+=4)
	{
		  // is this pixel the old rgb?
		if (originalImageData.data[i]==baseColor[0] &&
			originalImageData.data[i+1]==baseColor[1] &&
			originalImageData.data[i+2]==baseColor[2]
		)
		{
			// change to your new rgb
			imageDataCopy.data[i]=newColor.rgb[0];
			imageDataCopy.data[i+1]=newColor.rgb[1];
			imageDataCopy.data[i+2]=newColor.rgb[2];
			
	
			var index = $("#lstSelectColor")[0].selectedIndex;
			var color = newColor.toHEXString().replace('#', '');
			colorTable[index][rgbToHex(baseColor[0], baseColor[1], baseColor[2])] = color;
			
		}
	}
	// put the altered data back on the canvas
	$("#cvsPrevewImage").get(0).getContext('2d').putImageData(imageDataCopy,0,0);
	currentImageData = new ImageData(
	  new Uint8ClampedArray(imageDataCopy.data),
	  imageDataCopy.width,
	  imageDataCopy.height
	)
	$('#result').val('\"colorOptions\":'+JSON.stringify(colorTable));
}

// Initial colorTable setup
function resetColorTable() {
	var stringTable = '[{ "ffca8a" : "ffca8a", "e0975c" : "e0975c", "a85636" : "a85636", "6f2919" : "6f2919" }, { "ffca8a" : "ffca8a", "e0975c" : "e0975c", "a85636" : "a85636", "6f2919" : "6f2919" }, { "ffca8a" : "ffca8a", "e0975c" : "e0975c", "a85636" : "a85636", "6f2919" : "6f2919" }, { "ffca8a" : "ffca8a", "e0975c" : "e0975c", "a85636" : "a85636", "6f2919" : "6f2919" }, { "ffca8a" : "ffca8a", "e0975c" : "e0975c", "a85636" : "a85636", "6f2919" : "6f2919" }, { "ffca8a" : "ffca8a", "e0975c" : "e0975c", "a85636" : "a85636", "6f2919" : "6f2919" }, { "ffca8a" : "ffca8a", "e0975c" : "e0975c", "a85636" : "a85636", "6f2919" : "6f2919" }, { "ffca8a" : "ffca8a", "e0975c" : "e0975c", "a85636" : "a85636", "6f2919" : "6f2919" }, { "ffca8a" : "ffca8a", "e0975c" : "e0975c", "a85636" : "a85636", "6f2919" : "6f2919" }, { "ffca8a" : "ffca8a", "e0975c" : "e0975c", "a85636" : "a85636", "6f2919" : "6f2919" }, { "ffca8a" : "ffca8a", "e0975c" : "e0975c", "a85636" : "a85636", "6f2919" : "6f2919" }, { "ffca8a" : "ffca8a", "e0975c" : "e0975c", "a85636" : "a85636", "6f2919" : "6f2919" }]';
	colorTable = JSON.parse(stringTable);
	
	
	document.getElementById('ffca8a').jscolor.fromString('ffca8a');
	document.getElementById('e0975c').jscolor.fromString('e0975c');
	document.getElementById('a85636').jscolor.fromString('a85636');
	document.getElementById('6f2919').jscolor.fromString('6f2919');
}

// RGB to HEX
function rgbToHex(r, g, b) {
    return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}