``// TODO
//  Finish fill mode
//  When creating a 2-point symmetry, have mouseout end (cancel?) the symmetry
//  Have help text appear when selecting each mode/option
//  Add ability to click and drag symmetries
//  Add abiity to delete individual symmetries

//Keyboard shortcuts:
$(document).keyup(function(e) {
	switch(e.key) {
		case 'Escape':
			modal.style.display = "none";
			temporarySymmetry = null;
			mode = "draw";
			$("#draw").prop("checked", true);
			updateCanvas();
			break;
		case 'c':
			if (!e.ctrlKey) {
				clearDrawing();
			}
			break;
		case 'C':
			clearSymmetries();
			break;
		case 'd':
			mode = 'draw';
			$("#draw").prop("checked", true);
			temporarySymmetry = null;
			updateCanvas();
			break;
		case 'e':
			mode = 'editSymmetries';
			$("#editSymmetries").prop("checked", true);
			updateCanvas();
			break;
		case 'p':
			setSymmetryType("point")
			break;
		case 'r':
			setSymmetryType("rotation")
			break;
		case 'l':
			setSymmetryType("line")
			break;
		case 't':
			setSymmetryType("translation")
			break;
		case 's':
			setSymmetryType("scale")
			break;
		case '?':
			$("#shortcutKeyDialog").dialog("open");
			break;
		case 'z':
			if (e.metaKey || e.ctrlKey) {
				undo();
			}
			break;
		case 'Shift':
			// When shift key is released, we should recalculate symmetries in case we are no longer displaying result of temporary symmetries.
			recalculateSymmetries(false);
			break;
}
});

function setSymmetryType(type) {
	mode = 'editSymmetries';
	$("#editSymmetries").prop("checked", true);
	$("#"+type).prop("checked", true);
	if (lastMouseX != undefined && lastMouseY != undefined) {
		temporarySymmetry = createSpecifiedSymmetry([lastMouseX, lastMouseY]);
		updateCanvas();
	}
}

console.log('hi');

function openDrawerMenu(){
	var x = document.getElementById("maintoolBar");
	if (!x.classList.contains("responsive")){
		x.classList.add("responsive");
	} else {
		x.classList.remove("responsive");
	}
}

// Initialize modal FAQ page
function setUpModal() {
	// Modal javascript, css, and html are based on http://www.w3schools.com/howto/howto_css_modals.asp
	// I know, I know, w3schools is supposed to be a bad resource. But it's awfully convenient, ok?!
	// Get the modal:
	var modal = document.getElementById('modal');
	// Modal starts out hidden:
	modal.style.display = "none";
	// Get the button that opens the modal
	var FAQlink = document.getElementById("FAQLink");
	// Get the <span> element that closes the modal:
	var closeButton = document.getElementById("closeButton");
	// When the user clicks on the button, open the modal:
	FAQlink.onclick = function() {
	    modal.style.display = "block";
	}
	// When the user clicks on <span> (x), close the modal
	closeButton.onclick = function() {
	    modal.style.display = "none";
	}
	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
	    if (event.target == modal) {
	        modal.style.display = "none";
	    }
	}
}

function DocumentKeyPressHandler(e) {
	// Thanks to: https://stackoverflow.com/a/16006607/1460057
	var evtobj = window.event? event : e
	if (evtobj.keyCode == 90 && evtobj.ctrlKey) {

	}
}

document.onkeydown = DocumentKeyPressHandler;

// *************************************
// This code is based on https://en.wikipedia.org/wiki/HSL_and_HSV
// Free to use for any purpose. No attribution needed.
//
// Source: https://gist.github.com/vahidk/05184faf3d92a0aa1b46aeaa93b07786
// Thanks to vahidk (https://gist.github.com/vahidk) for the color conversion code

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let d = max - min;
  let h;
  if (d === 0) h = 0;
  else if (max === r) h = (g - b) / d % 6;
  else if (max === g) h = (b - r) / d + 2;
  else if (max === b) h = (r - g) / d + 4;
  let l = (min + max) / 2;
  let s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return [h * 60, s, l];
}

function hslToRgb(h, s, l) {
  let c = (1 - Math.abs(2 * l - 1)) * s;
  let hp = h / 60.0;
  let x = c * (1 - Math.abs((hp % 2) - 1));
  let rgb1;
  if (isNaN(h)) rgb1 = [0, 0, 0];
  else if (hp <= 1) rgb1 = [c, x, 0];
  else if (hp <= 2) rgb1 = [x, c, 0];
  else if (hp <= 3) rgb1 = [0, c, x];
  else if (hp <= 4) rgb1 = [0, x, c];
  else if (hp <= 5) rgb1 = [x, 0, c];
  else if (hp <= 6) rgb1 = [c, 0, x];
  let m = l - c * 0.5;
  return [
    Math.round(255 * (rgb1[0] + m)),
    Math.round(255 * (rgb1[1] + m)),
    Math.round(255 * (rgb1[2] + m))];
}
// *************************************


// *************************************
// Source: https://stackoverflow.com/a/5624139/1460057
// User Tim Down (https://stackoverflow.com/users/96100/tim-down)

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
// *************************************
function saveCurrentSymmetryConfiguration() {
	var name = document.getElementById("storeSymmetryName").value;
	var serializedSymmetries = exportSymmetries(symmetries);
	var newOptionTag = `<option class=\"toolBarSubElement\" value=\"`+serializedSymmetries+`\">`+encodeURI(name)+`</option>`;
	$("#savedSymmetries").append(newOptionTag);
}
function loadSavedSymmetryConfiguration() {
	symmetries = importSymmetries($("#savedSymmetries").find(":selected").value);
	recalculateSymmetries();
	updateCanvas();
}

function exportSymmetries(symmetryList) {
	var serializedSymmetries = encodeURI(JSON.stringify(symmetryList));
	//symmetryList.map(s => s.toJSON());
	return serializedSymmetries;
}
function getSymmetryConfigurationName(symmetryList) {
	// Generate short descriptive name for the given list of symmetries
	var names = [];
	for (var k = 0; k < symmetryList; k++) {
		if (symmetryList[k].type == "identity") {
			name = name.concat(symmetryList[k].getName());
		}
	}
}
function importSymmetries(serializedSymmetries) {
	if (serializedSymmetries == undefined) {
		serializedSymmetries = $("#savedSymmetries option:selected").val();
	}
	var symmetryList = JSON.parse(decodeURI(serializedSymmetries));
	symmetryList = symmetryList.map(obj => symmetry.fromObject(obj));
	return symmetryList;
}

function exportCurrentSymmetriesToUser() {
	$("#exportDialog").html(exportSymmetries(symmetries));
	$("#exportDialog").dialog("open");
}
function importSymmetriesFromUser() {
	serializedSymmetries = prompt("Paste encoded symmetry text here:");
	symmetries = importSymmetries(serializedSymmetries);
	updateCanvas();
}

class symmetry {
    constructor(type, level, point1, point2, order) {
		// type = "point", "line", "rotation", "translation", "scale", or "identity"
    this.type = type;
		this.level = level;
    this.point1 = point1;
    this.point2 = point2;
		this.order = order;
    }
		static fromObject(obj) {
			// Convert a generic deserialized symmetry object into a symmetry object
			return new symmetry(obj.type, obj.level, obj.point1, obj.point2, obj.order);
		}
		static fromJSON(serializedSymmetry) {
			var obj = JSON.parse(serializedSymmetry);
			return new symmetry(obj.type, obj.level, obj.point1, obj.point2, obj.order);
		}
		getName() {
			switch (this.type) {
				case "point":
					return this.level + ":point";
					break;
				case "line":
					return this.level + ":line";
					break;
				case "rotation":
					return this.level + ":rot"+obj.order;
					break;
				case "translation":
					return this.level + ":trans"+obj.order;
					break;
				case "scale":
					return this.level + ":scale"+obj.order;
					break;
				case "identity":
					return this.level + ":I";
					break;
			}
		}
		distSqTo(x, y) {
			var distSq1, distSq2;
			if (this.point1 != null) {
				distSq1 = (x-this.point1[0])**2 + (y-this.point1[1])**2;
			} else {
				distSq1 = Number.POSITIVE_INFINITY;
			}
			if (this.point2 != null) {
				distSq2 = (x-this.point2[0])**2 + (y-this.point2[1])**2;
			} else {
				distSq2 = Number.POSITIVE_INFINITY;
			}
			return [distSq1, distSq2];
		}
		symmetrize(x, y) {
      switch (this.type) {
				case "point":
					var newX = [];
					var newY = [];
					var deltaX, deltaY;
					deltaX = this.point1[0] - x;
					deltaY = this.point1[1] - y;
					return [[this.point1[0]+deltaX], [this.point1[1]+deltaY]];
				case "identity":
					return [[], []]
				case "line":
					let point2 = this.point2;
					if (point2 == undefined) {
						point2 = getTempPoint2(this.point1);
					}
					var dx0 = point2[0] - this.point1[0];
					var dy0 = point2[1] - this.point1[1];
					var dx1 = x - this.point1[0];
					var dy1 = y - this.point1[1];
					var l0 = Math.sqrt(dx0*dx0 + dy0*dy0);
					var l1 = Math.sqrt(dx1*dx1 + dy1*dy1);
					var dparallel = (dx0 * dx1 + dy0 * dy1) / l0;
					var fparallel = dparallel / l0;
					var dx2 = dx0 * fparallel;
					var dy2 = dy0 * fparallel;
					// Point 3 is projection onto line
					var point3 = [this.point1[0] + dx2, this.point1[1]+dy2];
					var point4 = [point3[0] + point3[0] - x, point3[1] + point3[1] - y];
					return [[point4[0]], [point4[1]]];
				case "rotation":
					var newXs = [];
					var newYs = [];
					var newX, newY;
					var angle = 2*Math.PI / this.order;
					for (var r = 0; r < this.order-1; r++) {
						newX = x - this.point1[0];
						newY = y - this.point1[1];
						[newX, newY] = [
							Math.cos(angle*(r+1))*newX - Math.sin(angle*(r+1))*newY + this.point1[0],
							Math.sin(angle*(r+1))*newX + Math.cos(angle*(r+1))*newY + this.point1[1]
						];
						newXs[r] = newX;
						newYs[r] = newY;
					}
					return [newXs, newYs];
				case "translation":
					var newXs = [];
					var newYs = [];
					if (this.point2 != null && this.point1 != null) {
						var newX, newY;
						var dx = this.point2[0] - this.point1[0];
						var dy = this.point2[1] - this.point1[1];
						for (var t = 0; t < this.order; t++) {
							[newX, newY] = [x+dx*(t+1), y+dy*(t+1)];
							newXs[t] = newX;
							newYs[t] = newY;
						}
					}
					return [newXs, newYs];
				case "scale":
					var newXs = [];
					var newYs = [];
					if (this.point2 != null && this.point1 != null) {
						var newX, newY;
						var scaleFactor = Math.sqrt((this.point2[0]-this.point1[0])**2 + (this.point2[1]-this.point1[1])**2)/scaleBaseRadius
						var dx = x - this.point1[0];
						var dy = y - this.point1[1];
						for (var t = 0; t < this.order; t++) {
							[newX, newY] = [this.point1[0]+dx*(scaleFactor**(t+1)), this.point1[1]+dy*(scaleFactor**(t+1))];
							newXs[t] = newX;
							newYs[t] = newY;
						}
					}
					return [newXs, newYs];
				default:
					console.log("error, invalid symmetry type");
			}
    }
}

var traceX = [[]];
var traceY = [[]];
var traceC = [[]];

var drawCanvas;
var drawCtx;
var showSymmetries = true;
var showDrawing = true;
var mode = "draw"; //Or "editSymmetries" or "fill"
var temporarySymmetry;
var hoverSymmetryIndex;       // Index indicating which, if any, symmetry is close to the mouse
var hoverSymmetryPointIndex;  // Index indicating which point of the symmetry is closer (point1 ==> 0 or point2 ==> 1)
var symmetryHoverDistance = 100;  // Max distance squared between mouse and symmetry needed to count as hovering
var symmetryColor = 'green';
var hoverSymmetryColor = 'red';
var symmetries = initializeSymmetryList();
sortSymmetries(symmetries);
var scaleBaseRadius = 40;

function initializeSymmetryList(otherSymmetries) {
	// Basically just add an identity symmetry to the beginning.
	if (otherSymmetries == undefined) {
		otherSymmetries = [];
	}
	var symmetryList = [
	//	new symmetry("point", 1, [950, 400]),
		new symmetry("identity", 0, null, null, 0),
	//	new symmetry("point", 2, [700, 400]),
	//	new symmetry("line", 1, [0, 200], [100, 210]),
	//	new symmetry("line", 1, [0, 300], [100, 250]),
	//	new symmetry("rotation", 1, [750, 400], false, 7),
	//	new symmetry("rotation", 1, [600, 200], false, 4)
	];
	return symmetryList.concat(otherSymmetries);
}

function toggleSymmetryVisibility() {
	showSymmetries = !showSymmetries;
	updateCanvas();
}

function toggleDrawingVisibility() {
	showDrawing = !showDrawing;
	updateCanvas();
}

function setModeIndicator(newMode) {
	$("#"+newMode).prop('checked', true);
	setMode(newMode);
}

function setMode(newMode) {
//	if (mode == "draw" && newMode == "editSymmetries") {
//		showDrawing = false;
//		showSymmetries = true;
//	} else if (mode == "editSymmetries" && newMode == "draw") {
//		showDrawing = true;
//		showSymmetries = false;
//	}
	mode = newMode;
}

function updateMode() {
	var newMode = $('input[name="Mode"]:checked').val();
	setMode(newMode)
	updateCanvas();
}

function getSelectedSymmetryType() {
	return $('input[name="symmetryType"]:checked').val();
}

function getSelectedSymmetryLevel() {
	return $("#symmetryLevel").val();
}

function setSelectedSymmetryLevel(lvl) {
	$("#symmetryLevel").val(lvl);
}

function compareSymmetryLevel(s1, s2) {
	return s1.level - s2.level;
}

function sortSymmetries(symmetryList) {
	symmetryList.sort(compareSymmetryLevel);
}

function addSymmetry(symmetry) {
	symmetries.push(symmetry);
	sortSymmetries(symmetries);
	recalculateSymmetries();
	updateCanvas();
	if (document.getElementById("symmetryLevelAutoIncrement").checked) {
		var currentSymmetryLevel = getSelectedSymmetryLevel();
		setSelectedSymmetryLevel(parseInt(currentSymmetryLevel)+1);
	}
}

function applySymmetries(xs, ys, remainingSymmetries) {
	if (remainingSymmetries.length == 0) {
		return [xs, ys];
	}
	var symXs = [];
	var symYs = [];
	var newSymXs, newSymYs;
	// Sort remaining symmetries in order of level, lowest to highest
	remainingSymmetries.sort(compareSymmetryLevel);
	// Loop over symmetries of the lowest order, symmetrizing all inputs
	let currentLevel = remainingSymmetries[0].level;
	for (let k = 0; k < remainingSymmetries.length; k++) {
		if (remainingSymmetries[k].level == currentLevel) {
			for (let j = 0; j < xs.length; j++) {
				[newSymXs, newSymYs] = remainingSymmetries[k].symmetrize(xs[j], ys[j]);
				symXs = symXs.concat(newSymXs);
				symYs = symYs.concat(newSymYs);
			}
		} else {
			// No more symmetries at this level - move on
			break;
		}
	}
	// Remove symmetries at current level:
	remainingSymmetries = remainingSymmetries.filter(s => (s.level > currentLevel));

	// Recurse on all input and symmetrized points using remaining symmetries
	return applySymmetries(xs.concat(symXs), ys.concat(symYs), remainingSymmetries);
}

function addPoint(x, y, c, includeTemporarySymmetry) {
	var currentSymmetries;
	if (includeTemporarySymmetry && temporarySymmetry != undefined) {
		currentSymmetries = symmetries.concat(temporarySymmetry);
	} else {
		currentSymmetries = symmetries;
	}
	var [symXs, symYs] = applySymmetries([x], [y], currentSymmetries);

	for (var k = 0; k < symXs.length; k++) {
		if (traceX.length <= k) {
			traceX[k] = [];
			traceY[k] = [];
			traceC[k] = [];
		}
		traceX[k] = traceX[k].concat(symXs[k]);
		traceY[k] = traceY[k].concat(symYs[k]);
		traceC[k] = traceC[k].concat(c)
	}
}

function restartFromLast() {
	if (!isNaN(traceX[0][traceX[0].length-1])) {
		// We are not at the beginning of a new segment...this doesn't make sense...
		return;
	}
	for (var k = traceX[0].length-1; k >= 0; k--) {
		if (!isNaN(traceX[0][k])) {
			// Found last point of last trajectory - copy it to the beginning of the new trajectory.
			traceX = [traceX[0].concat([traceX[0][k]])]
			traceY = [traceY[0].concat([traceY[0][k]])]
			traceC = [traceC[0].concat([traceC[0][k]])]
			recalculateSymmetries();
			break;
		}
	}
}

function undo() {
	let lastStrokeStartIndex = 0;
	let pointCount = 0;
	for (var k = traceX[0].length-1; k >= 0; k--) {
		if (isNaN(traceX[0][k])) {
			if (pointCount > 0) {
				lastStrokeStartIndex = k+1;
				break;
			}
		} else {
			pointCount++;
		}
	}
	traceX = [traceX[0].slice(0, lastStrokeStartIndex)]
	traceY = [traceY[0].slice(0, lastStrokeStartIndex)]
	traceC = [traceC[0].slice(0, lastStrokeStartIndex)]
	recalculateSymmetries();
}

function recalculateSymmetries(includeTemporarySymmetry) {
	baseTraceX = traceX[0];
	baseTraceY = traceY[0];
	baseTraceC = traceC[0];
	traceX = [[]];
	traceY = [[]];
	traceC = [[]];
	for (var k = 0; k < baseTraceX.length; k++) {
		addPoint(baseTraceX[k], baseTraceY[k], baseTraceC[k], includeTemporarySymmetry);
	}

	updateCanvas();
}

function mouseUpHandler(evt) {

}

function mouseoutHandler(evt) {
	lastMouseX = undefined;
	lastMouseY = undefined;
	if (mode == "editSymmetries") {
		// console.log("mouse out");
		temporarySymmetry = undefined;
		updateCanvas();
		recalculateSymmetries();
	}
	if (evt.buttons == 1 && mode == "draw") {
		endSegment(evt);
	}
}

function endSegment(evt) {
	for (var k = 0; k < traceX.length; k++) {
		traceX[k].push(NaN);
		traceY[k].push(NaN);
		traceC[k].push(NaN);
	}
	return false;
}

function rejoinSegment() {
	// Remove trailing segment separator, if it exists, thereby continuing the
	//	last segment rather than starting a new one
	for (let k = 0; k < traceX.length; k++) {
		while (traceX[k].length > 0 && isNaN(traceX[k][traceX[k].length-1])) {
			traceX[k].pop(traceX[k].length-1);
			traceY[k].pop(traceY[k].length-1);
			traceC[k].pop(traceC[k].length-1);
		}
	}
}

function getCanvasCoords(evt, isTouch) {
    var rect = drawCanvas.getBoundingClientRect();
		var rawX, rawY;
		if (isTouch) {
			rawX = evt.touches[0].clientX;
			rawY = evt.touches[0].clientY;
		} else {
			rawX = evt.clientX;
			rawY = evt.clientY;
		}
    var x = rawX - rect.left;
    var y = rawY - rect.top;
	return [x, y];
}

function getRotNum() {
	return $("#rotNum").val();
}

function getTransNum() {
	return $("#transNum").val();
}

function getScaleNum() {
	return $('#scaleNum').val();
}

var rainbowHue = 0;
var rainbowHueStep = 1;
function getSelectedLineColor() {
	var rainbow = $("#rainbow").prop("checked");
	if (rainbow) {
		var [r, g, b] = hslToRgb(rainbowHue, 1, 0.5);
		rainbowHue = (rainbowHue + rainbowHueStep) % 255;
		var outputColor = "rgb("+r+", "+g+", "+b+")";
		return outputColor;
	} else {
        //         console.log($("#color").val());
        // return $("#color").val();
        return $("#lineColor").val();
	}
}
function getSelectedBackgroundColor() {
	return $("#backgroundColor").val();
}

var lastMouseX, lastMouseY;

function touchendHandler(evt) {
	clickHandler(evt, 'end');
}

function touchstartHandler(evt) {
	clickHandler(evt, 'start');
}

function clickHandler(evt, touchType) {
	// touchType is undefined if this is a mouse event, 'start', or 'end' if it's a touch event.
	// console.log('clickHandler! touchType=', touchType)
	if (mode == "editSymmetries") {
		if (hoverSymmetryIndex == null || (!evt.ctrlKey && !evt.altKey)) {   // Not clicking on an existing symmetry
			if (temporarySymmetry != undefined) {    // Temporary symmetry exists
				if (temporarySymmetry.type == "line" || temporarySymmetry.type == "translation" || temporarySymmetry.type == "scale") {
					if (temporarySymmetry.point2 == null) {
						// Fix first point, begin modifying second point
						temporarySymmetry.point2 = getCanvasCoords(evt);
					} else {
						// Fix second point, add symmetry
						addSymmetry(temporarySymmetry)
						temporarySymmetry = undefined;
					}
				} else {
					addSymmetry(temporarySymmetry)
					temporarySymmetry = undefined;
				}
			} else {    // Temporary symmetry does not already exist
				if (touchType == 'start') {
					// Beginning screen touch with no temporary symmetry? Create it now.
					let touchCoords = getCanvasCoords(evt, true);
					temporarySymmetry = createSpecifiedSymmetry(touchCoords, touchCoords.slice());
					if (temporarySymmetry.type != "line" && temporarySymmetry.type != "translation" && temporarySymmetry.type != "scale") {
						addSymmetry(temporarySymmetry)
						temporarySymmetry = undefined;
					}
				} else {
					console.log("This should not happen unless this is a touch device");
				}
			}
		} else if (evt.ctrlKey | evt.altKey) {    // Clicking on an existing symmetry with control key down
			// Control button was pressed
			temporarySymmetry = symmetries.splice(hoverSymmetryIndex, 1)[0];
			// Make sure we're starting by editing the correct point
			if (temporarySymmetry.type == "scale") {
				// For scale symmetries, it makes more sense to pick up the primary point and leave the secondary point undefined.
				temporarySymmetry.point2 = undefined;
			} else {
				if (temporarySymmetry.point2 != undefined) {
					let points = [temporarySymmetry.point1, temporarySymmetry.point2];
					temporarySymmetry.point1 = points[(1+hoverSymmetryPointIndex) % 2];
					temporarySymmetry.point2 = points[hoverSymmetryPointIndex];
				}
			}
			recalculateSymmetries();
			updateCanvas();
		}
	} else if (mode == "draw") {
		var [x, y] = getCanvasCoords(evt);
		var c = getSelectedLineColor();
		addPoint(x, y, c);
		endSegment();
		updateCanvas();
	} else if (mode == "fill") {
		var [x, y] = getCanvasCoords(evt);
		var color = getSelectedLineColor();
		floodFill(x, y, color)
//				var [symXs, symYs] = applySymmetries(x, y, 0);
//				for (var k = 0; k < symXs.length; k++) {
//					floodFill(symXs[k], symYs[k], color);
//				}
	}
}

function touchmoveHandler(e) {
	e.preventDefault();
	mousemoveHandler(e, true);
}

function mousemoveHandler(evt, isTouch) {
	if (firstCanvasWidthUpdate) {
		updateCanvasSize();
		firstCanvasWidthUpdate = false;
	}
	var [x, y] = getCanvasCoords(evt, isTouch);
	// var dm = (Math.sqrt((x-lastMouseX)**2+(y-lastMouseY)**2));
	lastMouseX = x;
	lastMouseY = y;
  if (mode == "draw") {
  	if (evt.buttons == 1 || isTouch) {
  		var c = getSelectedLineColor();
			addPoint(x, y, c);
  		updateCanvas();
  	}
  } else if (mode == "editSymmetries") {
//		console.log(hoverSymmetryIndex, temporarySymmetry == null ? null : temporarySymmetry.type);
		var canvasUpdateNeeded = false;
		if (!isTouch) {
			// hovering to edit not yet supported for touch devices
			var closestSymmetryData = getClosestSymmetry(x, y);
			var closestSymmetryDistance = closestSymmetryData[2];
			if (closestSymmetryDistance < symmetryHoverDistance) {
				if (hoverSymmetryIndex == null) {  // We weren't hovering over a symmetry, but now we are.
					canvasUpdateNeeded = true;  // If we werent already hovering, need to update canvas now.
				}
				hoverSymmetryIndex = closestSymmetryData[0];
				hoverSymmetryPointIndex = closestSymmetryData[1];
			} else {   // We were hovering on a symmetry, but now we're not.
				if (hoverSymmetryIndex != null) {
					canvasUpdateNeeded = true;
				}
				hoverSymmetryIndex = null;
				hoverSymmetryPointIndex = null;
			}
		}

    if (temporarySymmetry != undefined) {
			canvasUpdateNeeded = true;
			if (temporarySymmetry.point2 == null) {
				// Choosing first point...
				temporarySymmetry.point1 = [x, y];
			} else {
				// Choosing second point...
				temporarySymmetry.point2 = [x, y];
			}
    } else {
			// No temporary symmetry at the moment, create one
			temporarySymmetry = createSpecifiedSymmetry([x, y]);
		}
		if (canvasUpdateNeeded) {
			updateCanvas();
		}
		if (evt.shiftKey) {
			recalculateSymmetries(true);
		}
  }
	return false;
}

function createSpecifiedSymmetry(point1, point2) {
	var type = getSelectedSymmetryType();
	var level = parseInt(getSelectedSymmetryLevel());
	var point1 = point1;
	var point2 = point2;
	var order;
	if (type == "rotation") {
		order = parseInt(getRotNum());
	} else if (type == "translation") {
		order = parseInt(getTransNum());
	} else if (type == "scale") {
		order = parseInt(getScaleNum());
	} else if (type == "line") {
	}
	return new symmetry(type, level, point1, point2, order);
}

function getClosestSymmetry(x, y) {
	// Note: Distance is really distance squared
	var closestIndex;
	var closestDistance = Number.POSITIVE_INFINITY;
	var closestSymmetryPointIndex;
	var currentDistances;
	for (var k = 0; k < symmetries.length; k++) {
		currentDistances = symmetries[k].distSqTo(x, y);
		currentDistance = Math.min.apply(null, currentDistances);
		if (currentDistance < closestDistance) {
			closestIndex = k;
			closestDistance = currentDistance;
			closestSymmetryPointIndex = currentDistances[0] < currentDistances[1] ? 0: 1;
		}
	}
	return [closestIndex, closestSymmetryPointIndex, closestDistance];
}

function addPredefinedSymmetryConfigurations() {
	let configs = {
		"1trans4_2rot7":"%5B%7B%22type%22:%22identity%22,%22level%22:0,%22point1%22:null,%22point2%22:null,%22order%22:0,%22tracesX%22:%5B%5D,%22tracesY%22:%5B%5D%7D,%7B%22type%22:%22rotation%22,%22level%22:2,%22point1%22:%5B696,234.59999084472656%5D,%22order%22:7,%22tracesX%22:%5B%5D,%22tracesY%22:%5B%5D%7D,%7B%22type%22:%22translation%22,%22level%22:1,%22point1%22:%5B716,180.59999084472656%5D,%22point2%22:%5B724,167.59999084472656%5D,%22order%22:4,%22tracesX%22:%5B%5D,%22tracesY%22:%5B%5D%7D%5D",
		"1rot7_2rot3":"%5B%7B%22type%22:%22identity%22,%22level%22:0,%22point1%22:null,%22point2%22:null,%22order%22:0,%22tracesX%22:%5B%5D,%22tracesY%22:%5B%5D%7D,%7B%22type%22:%22rotation%22,%22level%22:1,%22point1%22:%5B717,273.59999084472656%5D,%22order%22:7,%22tracesX%22:%5B%5D,%22tracesY%22:%5B%5D%7D,%7B%22type%22:%22rotation%22,%22level%22:2,%22point1%22:%5B823,268.59999084472656%5D,%22order%22:3,%22tracesX%22:%5B%5D,%22tracesY%22:%5B%5D%7D%5D",
		"1rot3_2rot12":"%5B%7B%22type%22:%22identity%22,%22level%22:0,%22point1%22:null,%22point2%22:null,%22order%22:0,%22tracesX%22:%5B%5D,%22tracesY%22:%5B%5D%7D,%7B%22type%22:%22rotation%22,%22level%22:1,%22point1%22:%5B648,231.59999084472656%5D,%22order%22:3,%22tracesX%22:%5B%5D,%22tracesY%22:%5B%5D%7D,%7B%22type%22:%22rotation%22,%22level%22:2,%22point1%22:%5B797,231.59999084472656%5D,%22order%22:12,%22tracesX%22:%5B%5D,%22tracesY%22:%5B%5D%7D%5D",
		"1line_2line_3line":"%5B%7B%22type%22:%22identity%22,%22level%22:0,%22point1%22:null,%22point2%22:null,%22order%22:0,%22tracesX%22:%5B%5D,%22tracesY%22:%5B%5D%7D,%7B%22type%22:%22line%22,%22level%22:1,%22point1%22:%5B596,224.59999084472656%5D,%22point2%22:%5B645,173.59999084472656%5D,%22tracesX%22:%5B%5D,%22tracesY%22:%5B%5D%7D,%7B%22type%22:%22line%22,%22level%22:2,%22point1%22:%5B624,227.59999084472656%5D,%22point2%22:%5B640,241.59999084472656%5D,%22tracesX%22:%5B%5D,%22tracesY%22:%5B%5D%7D,%7B%22type%22:%22line%22,%22level%22:4,%22point1%22:%5B660,243.59999084472656%5D,%22point2%22:%5B659,199.59999084472656%5D,%22tracesX%22:%5B%5D,%22tracesY%22:%5B%5D%7D%5D",
		"1rot29":"%5B%7B%22type%22:%22identity%22,%22level%22:0,%22point1%22:null,%22point2%22:null,%22order%22:0,%22tracesX%22:%5B%5D,%22tracesY%22:%5B%5D%7D,%7B%22type%22:%22rotation%22,%22level%22:1,%22point1%22:%5B681,220.59999084472656%5D,%22order%22:29,%22tracesX%22:%5B%5D,%22tracesY%22:%5B%5D%7D%5D",
		"1rot7_2line":"%5B%7B%22type%22:%22identity%22,%22level%22:0,%22point1%22:null,%22point2%22:null,%22order%22:0,%22tracesX%22:%5B%5D,%22tracesY%22:%5B%5D%7D,%7B%22type%22:%22rotation%22,%22level%22:1,%22point1%22:%5B663,208.59999084472656%5D,%22order%22:7,%22tracesX%22:%5B%5D,%22tracesY%22:%5B%5D%7D,%7B%22type%22:%22line%22,%22level%22:2,%22point1%22:%5B738,162.59999084472656%5D,%22point2%22:%5B736,240.59999084472656%5D,%22tracesX%22:%5B%5D,%22tracesY%22:%5B%5D%7D%5D",
		"1rot7_2trans7_3trans4":"%5B%7B%22type%22:%22identity%22,%22level%22:0,%22point1%22:null,%22point2%22:null,%22order%22:0,%22tracesX%22:%5B%5D,%22tracesY%22:%5B%5D%7D,%7B%22type%22:%22rotation%22,%22level%22:1,%22point1%22:%5B416,392.59999084472656%5D,%22order%22:7,%22tracesX%22:%5B%5D,%22tracesY%22:%5B%5D%7D,%7B%22type%22:%22translation%22,%22level%22:2,%22point1%22:%5B462,388.59999084472656%5D,%22point2%22:%5B575,384.59999084472656%5D,%22order%22:7,%22tracesX%22:%5B%5D,%22tracesY%22:%5B%5D%7D,%7B%22type%22:%22translation%22,%22level%22:3,%22point1%22:%5B464,372.59999084472656%5D,%22point2%22:%5B464,268.59999084472656%5D,%22order%22:4,%22tracesX%22:%5B%5D,%22tracesY%22:%5B%5D%7D%5D",
		"1rot4_2line":"%5B%7B%22type%22:%22identity%22,%22level%22:0,%22point1%22:null,%22point2%22:null,%22order%22:0,%22tracesX%22:%5B%5D,%22tracesY%22:%5B%5D%7D,%7B%22type%22:%22rotation%22,%22level%22:1,%22point1%22:%5B696,235.59999084472656%5D,%22order%22:4,%22tracesX%22:%5B%5D,%22tracesY%22:%5B%5D%7D,%7B%22type%22:%22line%22,%22level%22:2,%22point1%22:%5B560,105.59999084472656%5D,%22point2%22:%5B662,202.59999084472656%5D,%22tracesX%22:%5B%5D,%22tracesY%22:%5B%5D%7D%5D",
		"1line_2line_3rot7":"%5B%7B%22type%22:%22identity%22,%22level%22:0,%22point1%22:null,%22point2%22:null,%22order%22:0,%22tracesX%22:%5B%5D,%22tracesY%22:%5B%5D%7D,%7B%22type%22:%22line%22,%22level%22:1,%22point1%22:%5B578,261.59999084472656%5D,%22point2%22:%5B720,196.59999084472656%5D,%22tracesX%22:%5B%5D,%22tracesY%22:%5B%5D%7D,%7B%22type%22:%22line%22,%22level%22:2,%22point1%22:%5B544,166.59999084472656%5D,%22point2%22:%5B823,300.59999084472656%5D,%22tracesX%22:%5B%5D,%22tracesY%22:%5B%5D%7D,%7B%22type%22:%22rotation%22,%22level%22:3,%22point1%22:%5B664,223.59999084472656%5D,%22order%22:7,%22tracesX%22:%5B%5D,%22tracesY%22:%5B%5D%7D%5D",
		"1scale5_2rot6":"%5B%7B%22type%22:%22identity%22,%22level%22:0,%22point1%22:null,%22point2%22:null,%22order%22:0,%22tracesX%22:%5B%5D,%22tracesY%22:%5B%5D%7D,%7B%22type%22:%22scale%22,%22level%22:1,%22point1%22:%5B640,188.6363525390625%5D,%22point2%22:%5B658,176.6363525390625%5D,%22order%22:5,%22tracesX%22:%5B%5D,%22tracesY%22:%5B%5D%7D,%7B%22type%22:%22rotation%22,%22level%22:2,%22point1%22:%5B640,187.6363525390625%5D,%22order%22:6,%22tracesX%22:%5B%5D,%22tracesY%22:%5B%5D%7D%5D",
		"1rot7_2line_v2":"%5B%7B%22type%22:%22identity%22,%22level%22:0,%22point1%22:null,%22point2%22:null,%22order%22:0,%22tracesX%22:%5B%5D,%22tracesY%22:%5B%5D%7D,%7B%22type%22:%22rotation%22,%22level%22:1,%22point1%22:%5B538,223.4545440673828%5D,%22order%22:7,%22tracesX%22:%5B%5D,%22tracesY%22:%5B%5D%7D,%7B%22type%22:%22line%22,%22level%22:2,%22point1%22:%5B259,223.4545440673828%5D,%22point2%22:%5B768,223.4545440673828%5D,%22tracesX%22:%5B%5D,%22tracesY%22:%5B%5D%7D%5D",
		"1rot3_2scl_2scl_2scl":"%5B%7B%22type%22:%22identity%22,%22level%22:null,%22point1%22:null,%22point2%22:null,%22order%22:0%7D,%7B%22type%22:%22rotation%22,%22level%22:1,%22point1%22:%5B703,246%5D,%22order%22:3%7D,%7B%22type%22:%22scale%22,%22level%22:2,%22point1%22:%5B628,117%5D,%22point2%22:%5B618,97%5D,%22order%22:6%7D,%7B%22type%22:%22scale%22,%22level%22:2,%22point1%22:%5B852,247%5D,%22point2%22:%5B872,246%5D,%22order%22:6%7D,%7B%22type%22:%22scale%22,%22level%22:2,%22point1%22:%5B632,369%5D,%22point2%22:%5B622,386%5D,%22order%22:6%7D%5D",
		"1scl6_2scl6_3scl6_4rot3":"%5B%7B%22type%22:%22identity%22,%22level%22:null,%22point1%22:null,%22point2%22:null,%22order%22:0%7D,%7B%22type%22:%22scale%22,%22level%22:1,%22point1%22:%5B510,287%5D,%22point2%22:%5B521,269%5D,%22order%22:6%7D,%7B%22type%22:%22scale%22,%22level%22:2,%22point1%22:%5B604,114%5D,%22point2%22:%5B607,134%5D,%22order%22:6%7D,%7B%22type%22:%22scale%22,%22level%22:3,%22point1%22:%5B708,280%5D,%22point2%22:%5B696,264%5D,%22order%22:6%7D,%7B%22type%22:%22rotation%22,%22level%22:4,%22point1%22:%5B608,227%5D,%22order%22:3%7D%5D",
		"1rot6_2rot17_3scl7":"%5B%7B%22type%22:%22identity%22,%22level%22:null,%22point1%22:null,%22point2%22:null,%22order%22:0%7D,%7B%22type%22:%22rotation%22,%22level%22:1,%22point1%22:%5B694,268%5D,%22order%22:6%7D,%7B%22type%22:%22rotation%22,%22level%22:3,%22point1%22:%5B885,268%5D,%22order%22:17%7D,%7B%22type%22:%22scale%22,%22level%22:4,%22point1%22:%5B885,269%5D,%22point2%22:%5B905,253%5D,%22order%22:7%7D%5D"
	};
	for (const [name, value] of Object.entries(configs)) {
		let newOption = `<option class="toolBarSubElement" value=${value}>${name}</option>`;
		$("#savedSymmetries").append(newOption);
	}
}

function updateCanvasSize() {
	// Thanks to Stackoverflow user Phrogz for this: https://stackoverflow.com/a/10215724/1460057
	drawCanvas.offsetWidth;
  drawCanvas.width  = drawCanvas.offsetWidth > 0 ? drawCanvas.offsetWidth : window.innerWidth;
	updateCanvas();
}

// This is an ugly hack - a flag to update the canvas width
// 	when the mouse starts moving. I couldn't get an accurate
//	canvas width without waiting for user mouse movement.
var firstCanvasWidthUpdate = true;

$(function () {
	drawCanvas = document.getElementById("drawCanvas");
	drawCtx = drawCanvas.getContext('2d');

	document.body.addEventListener("touchstart", function (e) {
	  if (e.target == drawCanvas) {
	    e.preventDefault();
	  }
	},  { passive: false });
	document.body.addEventListener("touchend", function (e) {
	  if (e.target == drawCanvas) {
	    e.preventDefault();
	  }
	}, { passive: false });
	document.body.addEventListener("touchmove", function (e) {
	  if (e.target == drawCanvas) {
	    e.preventDefault();
	  }
	}, { passive: false });

	// Set up modal
	setUpModal();

	// Queue up predefined symmetry configurations in the dropdown menu
	addPredefinedSymmetryConfigurations();

	// Set up canvas resize handler
	window.onresize = updateCanvasSize;

	// Set up export dialog
	$( "#exportDialog" ).dialog({
    autoOpen: false
  });
	$("#shortcutKeyDialog").dialog({
		autoOpen: false
	});

		// Set splash page to fade
	 setTimeout(function() {
	    $("#splash").fadeOut(1000, function() {
	       $("#content").show();
	    });
	 }, 300);


    $("#color").spectrum({
        flat: true,
        showInitial: true,
        showInput: true,
        showPalette: true,
        palette: [ ],
        preferredFormat: "rgb",
//        localStorageKey: "supersym.colors",
        showSelectionPalette: true, // true by default
        selectionPalette: []
    });

	//Setup event callbacks:
	$("input[name=symmetryType]").on('click touchstart',
		function(){
			setModeIndicator("editSymmetries");
		}
	);
	$("#drawCanvas").on('mousedown touchstart',
		function (evt) {
			if (mode == "draw" && evt.shiftKey) {
				restartFromLast();
			}
		}
	)
	$("#drawCanvas").on('click', clickHandler);
	$("#drawCanvas").on('touchstart', touchstartHandler);

	$("#symmetryTransparency").val(0.3);
	$("#drawTransparency").val(1.0);


	$("#drawCanvas").on('mouseout', mouseoutHandler);
	$("#drawCanvas").on('touchend', touchendHandler);
	$("#drawCanvas").on('mousemove', mousemoveHandler);
	$("#drawCanvas").on('touchmove', touchmoveHandler);
	$("#symmetryTransparency").on('change', updateCanvas)
	$("#drawTransparency").on('change', updateCanvas)

	// Set version number
	$("#footer").html($('#footer').html()+'1.07')
});

function flatCoord(x, y, numPerPixel) {
	return Math.round((x + y*drawCanvas.width)*(numPerPixel || 4));
}

function floodFill(x, y, color) {
	var imgData = drawCtx.getImageData(0, 0, drawCanvas.width, drawCanvas.height);
	var z = flatCoord(x, y);
	var pixSet = new Set([z]);
	var borderPixSet = new Set();
	var pixelMap = [];
	var zz;
	for (var xx = 0; xx < drawCanvas.width; xx++) {
		pixelMap[xx] = [];
		for (var yy = 0; yy < drawCanvas.height; yy++) {
			zz = flatCoord(xx, yy);
			pixelMap[xx][yy] = rgbToHex(imgData.data[zz], imgData.data[zz+1], imgData.data[zz+2]);
		}
	}
	var oldColor = pixelMap[x][y];
	floodFillIterate(x, y, color, oldColor, pixelMap, pixSet, borderPixSet);

	var xx, yy;
	var borderPixels = [];
	for (let point of borderPixSet) {
		borderPixels.push(JSON.parse(point));
	}
//	var [borderXs, borderYs] = orderBorderPoints(borderPixels);
}

function orderBorderPoints(borderPoints) {
	var currentPoint = borderPoints.splice(0, 1);
}

function floodFillIterate(x, y, color, oldColor, pixelMap, pixSet, borderPixSet) {
	var z = JSON.stringify([x, y]);
	var zz;
	var newAdditions = [];
	var neighbors = [[-1, 0], [1, 0], [0, -1], [0, 1]];
	var xx, yy, dx, dy;
	console.log("checking", x, y);
	for (var k = 0; k < neighbors.length; k++) {
		[dx, dy] = neighbors[k];
		xx = x+dx;
		yy = y+dy;
		zz = JSON.stringify([xx, yy]);
		console.log("Trying to expand into", xx, yy);
		if (!pixSet.has(zz)) {
			if (xx >= 0 && xx < drawCanvas.width && yy >= 0 && yy < drawCanvas.height && pixelMap[xx][yy] == oldColor) {
				// The peripheral pixel is also the old color,
				console.log("successful expansion!");
				newAdditions.push([xx, yy]);
				pixSet.add(zz);
			} else {
				// The central pixel here is a border pixel
				borderPixSet.add(z);
			}
		}
	}
	var xx, yy;
	for (var k = 0; k < newAdditions.length; k++) {
		[xx, yy] = newAdditions[k];
		setTimeout(function() {
			floodFillIterate(xx, yy, color, oldColor, pixelMap, pixSet, borderPixSet);
		}, 0);
	}
}

function getSymmetryTransparency() {
	return $("#symmetryTransparency").val();
}

function getDrawTransparency() {
	return $("#drawTransparency").val();
}

function getTraceCopy(trace) {
	return trace.slice();
}

function clearDrawing() {
	traceX = [[]];
	traceY = [[]];
	traceC = [[]];
	updateCanvas();
}

function clearSymmetries() {
	symmetries = [new symmetry("identity", Number.NEGATIVE_INFINITY, null, null, 0)];
	$("#symmetryLevel").val(1);
	updateCanvas();
}

function clearCanvas() {
	drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
}

function drawPointSymmetry(sym, color, alpha, verbose) {
  drawCtx.globalAlpha = alpha;
	drawCtx.linewidth = 1;
	drawCtx.strokeStyle = color;
	drawCtx.setLineDash([]);
	drawCtx.beginPath();
	drawCtx.arc(sym.point1[0], sym.point1[1], rotationControlPointRadius, 0, 2*Math.PI);
	drawCtx.stroke();
	if (verbose) {
		// drawCtx.fillStyle = 'black';
		// drawCtx.fillText(Math.round(sym.point1[0])+','+Math.round(sym.point1[1]), sym.point1[0]+rotationControlPointRadius, sym.point1[1]-rotationControlPointRadius);
	}
  drawCtx.globalAlpha = 1.0;
}

function drawRotationalSymmetry(sym, color, alpha, verbose) {
  drawCtx.globalAlpha = alpha;
	drawCtx.linewidth = 1;
	drawCtx.strokeStyle = color;
	drawCtx.setLineDash([]);

	// Draw center of rotation
	drawCtx.beginPath();
	drawCtx.arc(sym.point1[0], sym.point1[1], rotationControlPointRadius, 0, 2*Math.PI);
	drawCtx.stroke()

	// Draw radiating arms
	drawCtx.beginPath();
	drawCtx.setLineDash([2, 8])
	var canvasDiag = Math.sqrt(drawCanvas.width**2 + drawCanvas.height**2);
	var angle;
	for (var j = 0; j < sym.order; j++) {
		angle = 2*Math.PI * j / sym.order;
		drawCtx.moveTo(sym.point1[0], sym.point1[1]);
		drawCtx.lineTo(sym.point1[0] + Math.cos(angle)*canvasDiag, sym.point1[1] + Math.sin(angle)*canvasDiag);
	}
	drawCtx.stroke();
	if (verbose) {
		// drawCtx.fillStyle = 'black';
		// drawCtx.fillText(Math.round(sym.point1[0])+','+Math.round(sym.point1[1]), sym.point1[0]+rotationControlPointRadius, sym.point1[1]-rotationControlPointRadius);
		// drawCtx.fillText('x'+sym.order, sym.point1[0]+rotationControlPointRadius, sym.point1[1]+rotationControlPointRadius);
	}
  drawCtx.globalAlpha = 1.0;
}

const rotationControlPointRadius = 5;
const lineControlPointWidth = 8;
const transControlPointX = [-5, 5, 0];
const transControlPointY = [-2.5, -2.5, 7.5];

function getTempPoint2(point1) {
	return [point1[0]+40, point1[1]];
}

function drawLineSymmetry(sym, color, alpha, verbose) {
	let point1 = sym.point1;
	let point2 = sym.point2;
	if (point2 == null) {
		point2 = getTempPoint2(point1);
	}
  drawCtx.globalAlpha = alpha;
	var dx = point2[0] - point1[0];
	var dy = point2[1] - point1[1];
	var yIntercept0 = point1[1] - (point1[0] - 0) * dy / dx;
	var yIntercept1 = point1[1] - (point1[0] - drawCanvas.width) * dy / dx;
	drawCtx.linewidth = 1;
	drawCtx.strokeStyle = color;
	drawCtx.setLineDash([4, 4])
	drawCtx.beginPath();
	drawCtx.moveTo(0, yIntercept0);
	drawCtx.lineTo(drawCanvas.width, yIntercept1);
	drawCtx.stroke();
	// Draw control points
	drawCtx.beginPath();
	drawCtx.setLineDash([])
	drawCtx.rect(point1[0]-3, point1[1]-3, lineControlPointWidth, lineControlPointWidth);
	drawCtx.rect(point2[0]-3, point2[1]-3, lineControlPointWidth, lineControlPointWidth);
	drawCtx.stroke();
	if (verbose) {

	}
  drawCtx.globalAlpha = 1.0;
}

function drawTranslationalSymmetry(sym, color, alpha, verbose) {
	let point1 = sym.point1;
	let point2 = sym.point2;
	if (point2 == null) {
		point2 = [point1[0]+10, point1[1]];
	}
  drawCtx.globalAlpha = alpha;
	drawCtx.linewidth = 1;
	drawCtx.strokeStyle = color;
	drawCtx.setLineDash([2, 2]);
	drawCtx.beginPath();
	drawCtx.moveTo(point1[0], point1[1]);
	drawCtx.lineTo(point2[0], point2[1]);
	drawCtx.stroke();
	// Draw control points
	drawCtx.beginPath();
	drawCtx.setLineDash([])
	let points = [point1, point2];
	for (var j = 0; j < 2; j++) {
		drawCtx.moveTo(points[j][0]+transControlPointX[0], points[j][1]+transControlPointY[0]);
		for (var k = 1; k <= 3; k++) {
			drawCtx.lineTo(points[j][0]+transControlPointX[k % 3], points[j][1]+transControlPointY[k % 3]);
		}
	}
	drawCtx.stroke();
	var dx = point2[0] - point1[0];
	var dy = point2[1] - point1[1];
	var dx2 = dy;
	var dy2 = -dx;
	var l = Math.sqrt(dx*dx+dy*dy);
	var tipFraction = 0.15;
	var xTip = point2[0] - tipFraction * (dx - dx2)/l;
	var yTip = point2[1] - tipFraction * (dy - dy2)/l;
	drawCtx.lineTo(xTip, yTip);
	drawCtx.stroke();
	if (verbose) {

	}
  drawCtx.globalAlpha = 1.0;
}

function drawScaleSymmetry(sym, color, alpha, verbose) {
	let point1 = sym.point1;
	let point2 = sym.point2;
	if (point2 == null) {
		point2 = getTempPoint2(point1);
	}
  drawCtx.globalAlpha = alpha;
	drawCtx.linewidth = 1;
	drawCtx.strokeStyle = color;
	drawCtx.setLineDash([]);

	// Draw center X control point
	drawCtx.beginPath();
	drawCtx.moveTo(point1[0]-rotationControlPointRadius, point1[1]-rotationControlPointRadius)
	drawCtx.lineTo(point1[0]+rotationControlPointRadius, point1[1]+rotationControlPointRadius)
	drawCtx.moveTo(point1[0]-rotationControlPointRadius, point1[1]+rotationControlPointRadius)
	drawCtx.lineTo(point1[0]+rotationControlPointRadius, point1[1]-rotationControlPointRadius)
	drawCtx.stroke()

	drawCtx.beginPath();
	drawCtx.arc(point1[0], point1[1], scaleBaseRadius, 0, 2*Math.PI);
	drawCtx.stroke();
	drawCtx.beginPath();
	drawCtx.setLineDash([4, 4]);
	let dx = point2[0]-point1[0];
	let dy = point2[1]-point1[1];
	let scaleRadius = Math.sqrt(dx**2 + dy**2);
	let dx1 = dx/scaleRadius; // dx scaled to unit vector
	let dy1 = dy/scaleRadius; // dy scaled to unit vector
	drawCtx.arc(point1[0], point1[1], scaleRadius, 0, 2*Math.PI);
	drawCtx.stroke();

	// Draw scale factor control point
	drawCtx.beginPath();
	drawCtx.setLineDash([]);
	drawCtx.arc(point2[0], point2[1], rotationControlPointRadius, 0, 2*Math.PI);
	drawCtx.stroke();

	// Draw connecting line
	drawCtx.beginPath();
	drawCtx.setLineDash([4, 4])
	drawCtx.moveTo(point2[0], point2[1]);
	drawCtx.lineTo(point1[0] + dx1*scaleRadius, point1[1] + dy1*scaleRadius);
	drawCtx.stroke();
	if (verbose) {

	}
  drawCtx.globalAlpha = 1.0;
}

function updateCanvas() {
	clearCanvas();

	// Set background color
	drawCtx.fillStyle = getSelectedBackgroundColor();
	drawCtx.fillRect(0, 0, drawCanvas.width, drawCanvas.height);

	if (showDrawing) {
		drawCtx.globalAlpha = getDrawTransparency();

		var currentColor;
		var startNewSegment = true;

		drawCtx.lineWidth = 1;
		drawCtx.strokeStyle = currentColor;
		drawCtx.setLineDash([]);

		drawCtx.beginPath();
		for (var traceNum = 0; traceNum < traceX.length; traceNum++) {
			drawCtx.moveTo(traceX[traceNum][0], traceY[traceNum][0]);
			for (var k = 1; k < traceX[traceNum].length; k++){
				if (isNaN(traceX[traceNum][k]) || k + 1 == traceX[traceNum].length || traceC[traceNum][k] != currentColor) {
					if (isNaN(traceX[traceNum][k])) {
						startNewSegment = true;
//						drawCtx.moveTo(traceX[traceNum][k], traceY[traceNum][k]);
					}
					drawCtx.strokeStyle = currentColor;
					drawCtx.stroke();
					currentColor = traceC[traceNum][k];
					drawCtx.beginPath();
				}
				if (startNewSegment) {
					drawCtx.moveTo(traceX[traceNum][k], traceY[traceNum][k]);
					startNewSegment = false;
				} else {
					drawCtx.lineTo(traceX[traceNum][k], traceY[traceNum][k]);
				}

			}
		}
		drawCtx.globalAlpha = 1.0;

	}
    var symmetriesToDraw = [];
    if (showSymmetries) {
         symmetriesToDraw = symmetries.slice();
    }
    if (temporarySymmetry != undefined) {
        symmetriesToDraw = symmetriesToDraw.concat([temporarySymmetry]);
    }

	if (showSymmetries || temporarySymmetry != undefined) {
		var alpha;
		var color;
		for (var k = 0; k < symmetriesToDraw.length; k++) {
			alpha = getSymmetryTransparency();
			color = symmetryColor;
			let verbose = false;
			if (k == hoverSymmetryIndex) {
				color = hoverSymmetryColor
				verbose = true;
				alpha = 1;
			} else if (symmetriesToDraw[k] === temporarySymmetry) {
				if (hoverSymmetryIndex == null) {
					verbose = true;
				}
				alpha = 1;
			}
			switch (symmetriesToDraw[k].type) {
				case "identity":
					// Draw nothing
					break;
				case "point":
          drawPointSymmetry(symmetriesToDraw[k], color, alpha, verbose)
					break;
				case "line":
          drawLineSymmetry(symmetriesToDraw[k], color, alpha, verbose)
					break;
				case "rotation":
          drawRotationalSymmetry(symmetriesToDraw[k], color, alpha, verbose)
					break;
				case "translation":
          drawTranslationalSymmetry(symmetriesToDraw[k], color, alpha, verbose)
					break;
				case "scale":
          drawScaleSymmetry(symmetriesToDraw[k], color, alpha, verbose)
					break;
				default:
					console.log("Error, invalid symmetry type");
			}
		}
		drawCtx.globalAlpha = 1.0;
	}
}
