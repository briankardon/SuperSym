``// TODO
//  Finish fill mode
//  Have help text appear when selecting each mode/option

//Keyboard shortcuts:
$(document).keydown(function(e) {
	switch(e.key) {
		case 'x':
		case 'X':
			$("#gridSnap").prop('checked', true);
			gridSnap = true;
			break;
		case 'z':
			if (e.metaKey || e.ctrlKey || e.shiftKey) {
				e.preventDefault()
			}
			break;
	}
});
$(document).keyup(function(e) {
	switch(e.key) {
		case 'x':
		case 'X':
			$("#gridSnap").prop('checked', false);
			gridSnap = false;
			break;
		case 'Escape':
			modal.style.display = "none";
			temporarySymmetry = null;
			hoverSymmetryIndex = null;
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
		case 'R':
			generateRandomSymmetryList(gridSnap);
			break;
		case 'r':
			setSymmetryType("rotation")
			break;
		case 'i':
			setSymmetryType("spiral");
			break;
		case 'l':
			setSymmetryType("line")
			break;
		case 'g':
			setSymmetryType('glide');
			break;
		case 't':
			setSymmetryType("translation")
			break;
		case 's':
			setSymmetryType("scale")
			break;
		case 'k':
			setSymmetryType("circle");
			break;
		case '?':
			openShortcutKeyDialog();
			break;
		case 'z':
			if (e.metaKey || e.ctrlKey) {
				undo();
				e.preventDefault()
			}
			break;
		case 'Z':
			if (e.metaKey || e.ctrlKey) {
				redo();
				e.preventDefault()
			}
			break;
		case 'Shift':
			// When shift key is released, we should recalculate symmetries in case we are no longer displaying result of temporary symmetries.
			recalculateSymmetries(false);
			break;
		case '1':
		case '2':
		case '3':
		case '4':
		case '5':
			colorHistoryClickHandler(e, e.key);
			break;
		case '!':
			colorHistoryClickHandler(e, '1');
			break;
		case '@':
			colorHistoryClickHandler(e, '2');
			break;
		case '#':
			colorHistoryClickHandler(e, '3');
			break;
		case '$':
			colorHistoryClickHandler(e, '4');
			break;
		case '%':
			colorHistoryClickHandler(e, '5');
			break;
	}
});

function openShortcutKeyDialog() {
	$("#shortcutKeyDialog").dialog("open");
}

function setSymmetryType(type) {
	mode = 'editSymmetries';
	$("#editSymmetries").prop("checked", true);
	$("#symmetryType").val(type);
	$("#symmetryType").trigger('change');
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
	$("#hotkeyLink").on('click', openShortcutKeyDialog);
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

function getContrastingRGBColor(rgb) {
	// Takes a vector of three rgb color values,
	// 	and returns a vector of three rgb color values
	//	that provide good contrast with the original color.
	return rgb.reduce((a, b) => a + b, 0)/(3*255) > 0.5 ? [0, 0, 0] : [255, 255, 255];
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
		Math.round(255 * (rgb1[2] + m))
	];
}
// *************************************


// *************************************
// Source: https://stackoverflow.com/a/5624139/1460057
// User Tim Down (https://stackoverflow.com/users/96100/tim-down)

function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}

function parseRGBString(rgb) {
	// Parse string of form 'rgb(22, 33, 11)'
	return rgb.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/).slice(1, 4).map((s) => parseInt(s));
}

function rgbToHex(rgb) {
	return "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
}

function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	if (result) {
		return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
	} else {
		return null;
	}
	// return result ? {
	//     r: parseInt(result[1], 16),
	//     g: parseInt(result[2], 16),
	//     b: parseInt(result[3], 16)
	// } : null;
}

function rgbToString(rgb) {
	// Convert rgb vector to a string of the from 'rgb(55, 44, 33)'
	return 'rgb('+rgb[0]+', '+rgb[1]+', '+rgb[2]+')';
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
function importSymmetries(serializedSymmetries, uriEncoded) {
	if (serializedSymmetries == undefined) {
		serializedSymmetries = $("#savedSymmetries option:selected").val();
	}
	if (uriEncoded == undefined) {
		uriEncoded = true;
	}
	var symmetryList;
	if (typeof(serializedSymmetries) == "string") {
		symmetryList = JSON.parse(uriEncoded ? decodeURI(serializedSymmetries) : serializedSymetries);
	} else {
		symmetryList = serializedSymmetries;
	}
	for (let k = 0; k < symmetryList.length; k++) {
		if (symmetryList[k].level == null) {
			// JSON encodes negative infinity as "null". This restores the correct value.
			symmetryList[k].level = Number.NEGATIVE_INFINITY;
		}
	}
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
	recalculateSymmetries();
	updateCanvas();
}

class symmetry {
	constructor(type, level, point1, point2, order) {
		this.type = type;
		this.level = level;
		this.point1 = point1;
		this.point2 = point2;
		this.order = order;
	}
	static types = ["point", "line", "rotation", "translation", "scale", "spiral", "glide", "identity", "circle"];
	static fromObject(obj) {
		// Convert a generic deserialized symmetry object into a symmetry object
		return new symmetry(obj.type, obj.level, obj.point1, obj.point2, obj.order);
	}
	static fromJSON(serializedSymmetry) {
		var obj = JSON.parse(serializedSymmetry);
		if (obj.level == null) {
			obj.level = Number.NEGATIVE_INFINITY;
		}
		return new symmetry(obj.type, obj.level, obj.point1, obj.point2, obj.order);
	}
	getMultiplicity() {
		switch (this.type) {
			case "identity":
				return 1;
			case "point":
			case "circle":
			case "line":
				return 2;
			case "rotation":
			case "translation":
			case "scale":
			case "glide":
			case "spiral":
				return this.order + 1;
		}
	}
	getNumPoints(type) {
		// Return the # of points needed to define this symmetry (0, 1, or 2)
		if (type == undefined) {
			type = this.type;
		}
		switch (type) {
			case "identity":
				return 0;
				break;
			case "point":
			case "rotation":
				return 1;
				break;
			case "line":
			case "translation":
			case "scale":
			case "glide":
			case "spiral":
			case "circle":
				return 2;
				break;
		}
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
			case "glide":
				return this.level + ":lt";
				break;
			case "spiral":
				return this.level + ":rs";
				break;
			case "circle":
				return "circ";
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
		var newXs = [];
		var newYs = [];
		var newX, newY;
		switch (this.type) {
			case "point":
				let deltaX, deltaY;
				deltaX = this.point1[0] - x;
				deltaY = this.point1[1] - y;
				newXs = [this.point1[0]+deltaX];
				newYs = [this.point1[1]+deltaY];
				break;
			case "identity":
				newXs = [];
				newYs = [];
				break;
			case "line":
				let point2 = this.point2;
				if (point2 == undefined) {
					point2 = getTempPoint2(this.point1);
				}
				let [x2, y2] = reflect(x, y, this.point1[0], this.point1[1], point2[0], point2[1]);
				newXs = [x2];
				newYs = [y2];
				break;
			case "translation":
				if (this.point2 != null && this.point1 != null) {
					let dx = this.point2[0] - this.point1[0];
					let dy = this.point2[1] - this.point1[1];
					let k = 0;
					let start = balancedTranslation ? Math.ceil(-this.order/2) : 0;
					for (let t = start; t < start+this.order; t++) {
			 			if (t != 0) {
							[newX, newY] = [x+dx*t, y+dy*t];
							newXs[k] = newX;
							newYs[k] = newY;
							k += 1;
						}
					}
				}
				break;
			case "glide":
				if (this.point2 != null && this.point1 != null) {
					let [xr, yr] = reflect(x, y, this.point1[0], this.point1[1], this.point2[0], this.point2[1]);
					let dx = this.point2[0] - this.point1[0];
					let dy = this.point2[1] - this.point1[1];
					let k = 0;
					let start = balancedTranslation ? Math.ceil(-this.order/2) : 0;
					for (let g = start; g < start+this.order; g++) {
						if (g != 0) {
							if ((g % 2) == 0) {
								// Use original point
								[newX, newY] = [x+dx*g, y+dy*g];
							} else {
								// Use reflected point
								[newX, newY] = [xr+dx*g, yr+dy*g];
							}
							newXs[k] = newX;
							newYs[k] = newY;
							k += 1;
						}
					}
				}
				break;
			case "scale":
				if (this.point2 != null && this.point1 != null) {
					var scaleFactor = Math.sqrt((this.point2[0]-this.point1[0])**2 + (this.point2[1]-this.point1[1])**2)/scaleBaseRadius
					let dx = x - this.point1[0];
					let dy = y - this.point1[1];
					for (let t = 0; t < this.order; t++) {
						[newX, newY] = scale(x, y, this.point1[0], this.point1[1], (scaleFactor**(t+1)));
						newXs[t] = newX;
						newYs[t] = newY;
					}
				}
				break;
			case "rotation":
				var angle = 2*Math.PI / this.order;
				for (let r = 0; r < this.order-1; r++) {
					[newX, newY] = rotate(x, y, this.point1[0], this.point1[1], angle*(r+1));
					newXs[r] = newX;
					newYs[r] = newY;
				}
				break;
			case "spiral":
				if (this.point2 != null && this.point1 != null) {
					var angle = 2*Math.PI / this.order;
					var scaleFactor = Math.sqrt((this.point2[0]-this.point1[0])**2 + (this.point2[1]-this.point1[1])**2)/scaleBaseRadius
					let order = Math.abs(this.order);
					for (let s = 0; s < order; s++) {
						[newX, newY] = rotate(x, y, this.point1[0], this.point1[1], angle*(s+1));
						[newX, newY] = scale(newX, newY, this.point1[0], this.point1[1], (scaleFactor**(s+1)));
						newXs[s] = newX;
						newYs[s] = newY;
					}
				}
				break;
			case "circle":
				var r2 = (this.point2[0]-this.point1[0])**2 + (this.point2[1]-this.point1[1])**2;
				var dx = x - this.point1[0];
				var dy = y - this.point1[1];
				var p2 = dx**2 + dy**2;
				newXs = [this.point1[0] + dx*r2/p2];
				newYs = [this.point1[1] + dy*r2/p2];
				break;
			default:
				console.log("error, invalid symmetry type");
				newXs = [];
				newYs = [];
				break;
		}
		return [newXs, newYs];
	}
}

function reflect(x, y, x1, y1, x2, y2) {
	// Reflect point (x, y) about a line defined by points (x1, y1) and (x2, y2)
	let dx0 = x2 - x1;
	let dy0 = y2 - y1;
	let dx1 = x - x1;
	let dy1 = y - y1;
	let fparallel = ((dx0 * dx1 + dy0 * dy1) / (dx0 * dx0 + dy0 * dy0));
	let dx2 = dx0 * fparallel;
	let dy2 = dy0 * fparallel;
	// (x4, y4) is the reflection of (x, y) across line
	return [2*(x1 + dx2) - x, 2*(y1 + dy2) - y];
}
function scale(x, y, x1, y1, f) {
	// Scale point (x, y) relative to point (x1, y1) by factor f
	let dx = x - x1;
	let dy = y - y1;
	return [x1+dx*f, y1+dy*f];
}
function rotate(x, y, x1, y1, a) {
	// Rotate point (x, y) around point (x1, y1) by angle a (in radians)
	let dx = x - x1;
	let dy = y - y1;
	let c = Math.cos(a);
	let s = Math.sin(a);
	return [c*dx - s*dy + x1, s*dx + c*dy + y1];
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
var maxColorHistorySize = 5;
var balancedTranslation = true;   // Should translation/glid symmetries be two-sided? Or just one-sided?

var undoStack = [];
var redoStack = [];
var undoStackLength = 10;  // maximum number of undo's
var currentState = packState();

var gridSnap;  // Running record of latest user entered grid snap state
var gridSizeX;  // Running record of latest user entered grid size.
var gridSizeY;
var gridType;

var progress = 0;
var progressTimer;

function initializeSymmetryList(otherSymmetries) {
	// Basically just add an identity symmetry to the beginning.
	if (otherSymmetries == undefined) {
		otherSymmetries = [];
	}
	var symmetryList = [
		//	new symmetry("point", 1, [950, 400]),
		new symmetry("identity", Number.NEGATIVE_INFINITY, null, null, 0),
		//	new symmetry("point", 2, [700, 400]),
		//	new symmetry("line", 1, [0, 200], [100, 210]),
		//	new symmetry("line", 1, [0, 300], [100, 250]),
		//	new symmetry("rotation", 1, [750, 400], false, 7),
		//	new symmetry("rotation", 1, [600, 200], false, 4)
	];
	return symmetryList.concat(otherSymmetries);
}

function randint(k0, k1) {
	if (k1 == undefined) {
		k1 = Math.floor(k0);
		k0 = 0;
	} else {
		k0 = Math.floor(k0);
		k1 = Math.floor(k1);
	}
	[k0, k1] = [k0, k1].sort();
	return Math.floor(Math.random()*(k1-k0)) + k0;
}

function randints(k0, k1, N) {
	if (N == undefined) {
		N = 1;
	}
	var r = [];
	for (let k = 0; k < N; k++) {
		r[k] = randint(k0, k1);
	}
	return r;
}

function randFloat(vMin, vMax) {
	if (vMax == undefined) {
		vMax = vMin;
		vMin = 0;
	}
	return Math.random()*(vMax-vMin) + vMin;
}

function randchoose(a) {
	// Return a random element of an array
	return a[randint(a.length)];
}

function randchoices(a, N) {
	var r = [];
	for (let k = 0; k < N; k++) {
		r[k] = randchoose(a);
	}
	return r;
}

function generateRandomSymmetryList(snapToGrid) {
	clearSymmetries();
	var N = randint(1, 5);
	var xLim = [drawCanvas.width/2 - 100, drawCanvas.width/2 + 100];
	var yLim = [drawCanvas.height/2 - 100, drawCanvas.height/2 + 100];
	var oLim = [2, 12];
	var type, point1, point2, x, y, order, level;
	for (let k = 0; k < N; k++) {
		type = randchoose(symmetry.types);
		while (type == "identity") {
			// No identity please
			type = randchoose(symmetry.types);
		}
		order = randint(...oLim);
		level = k;
		x = randints(...xLim, 2);
		y = randints(...yLim, 2);
		point1 = [x[0], y[0]];
		if (gridSnap) {
			point1 = snap(...point1);
		}
		if (type == "scale" || type == "spiral") {
			let angle = randFloat(2*Math.PI);
			let radius = randFloat(scaleBaseRadius*0.3, scaleBaseRadius*1.3);
			let dx = radius * Math.cos(angle);
			let dy = radius * Math.sin(angle);
			point2 = [point1[0]+dx, point1[1]+dy];
		} else {
			point2 = [x[1], y[1]];
			if (gridSnap) {
				point2 = snap(...point2);

			}
		}
		addSymmetry(new symmetry(type, level, point1, point2, order));
	}
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
	return $('#symmetryType').val();
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

function removeSymmetry(symmetryIndex) {
	let removedSymmetry = symmetries.splice(symmetryIndex, 1)[0];
	saveState();
	return removedSymmetry;
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
	saveState();
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
	// Make sure there's at least one state to undo
	if (undoStack.length == 0) {
		return;
	}

	// Add current state to redo stack
	redoStack.unshift(currentState);

	// Ensure redo stack does not exceed maximum length
	if (redoStack.length > undoStackLength) {
		redoStack.pop();
	}

	// Set previous state to current state
	currentState = undoStack.shift();

	// Reload new current state
	recallState(currentState);
}

function redo() {
	// Make sure there's at least one state to redo
	if (redoStack.length == 0) {
		return;
	}

	// Save current state to undo stack
	undoStack.unshift(currentState);

	// Ensure undo stack does not exceed maximum length
	if (undoStack.length > undoStackLength) {
		undoStack.pop();
	}

	// Set previous state to current state
	currentState = redoStack.shift();

	// Reload redone state
	recallState(currentState);
}

function saveState() {
	// Ensure symmetries are sorted
	sortSymmetries(symmetries);

	// Add current saved state to undo stack
	undoStack.unshift(currentState);

	// Ensure undo stack does not exceed maximum length
	if (undoStack.length > undoStackLength) {
		undoStack.pop();
	}

	// Record new current state.
	currentState = packState();

	// Clear redo state
	clearRedoStack()
}

function clearRedoStack() {
	redoStack = [];
}

function packState() {
	return JSON.stringify({
		symmetries:symmetries,
		traceX:traceX[0],
		traceY:traceY[0],
		traceC:traceC[0]
	});
}

function recallState(stateString) {
	let state = JSON.parse(stateString);
	traceX = [state.traceX];
	traceY = [state.traceY];
	traceC = [state.traceC];
	symmetries = importSymmetries(state.symmetries);
	recalculateSymmetries();
}

function updateProgress() {
	let visibility;
	if (progress < 1) {
		visibility = "visible";
	} else {
		visibility = "visible";
	}
	let pct = Math.round(100*progress) + "%";
	console.log("progress=", progress, " pct=", pct, " visbility=", visibility);
	$("#progressBarBar").css({"width":pct}).html(pct);
	$("#progressBar").css({"visibility":visibility});
}

function predictPointCount() {
	return traceX[0].length * symmetries.map(s => s.getMultiplicity()).reduce((a, b) => a*b);
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
	saveState();
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

function snap(x, y) {
	if (gridSnap) {
		switch (gridType) {
			case 'rect':
				x = Math.round(x/gridSizeX)*gridSizeX;
				y = Math.round(y/gridSizeY)*gridSizeY;
				break;
			case 'hex':
				y = Math.round(y/gridSizeY);
				let offset = 0.5 * (y % 2);
				y = y*gridSizeY;
				x = (Math.round((x/gridSizeX)-offset)+offset)*gridSizeX;
				break;
		}
	}
	return [x, y];
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
	return snap(x, y);
}

function getSymmetryOrder() {
	return $("#symmetryOrder").val();
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
		return $("#lineColor").val();
	}
}
function getSelectedBackgroundColor() {
	return $("#backgroundColor").val();
}

function updateColorHistory() {
	let lineColor =	rgbToString(hexToRgb(getSelectedLineColor()));
	let backColor = getSelectedBackgroundColor();
	let isLineColorNew = true;
	let isBackColorNew = true;
	let maxHistoryNum = 0;
	let historyColors = $("#colorTools").find("button.colorHistory").map(function (k, button) {
		return $(button).css('background-color');
	}).get();
	let historyNums = $("#colorTools").find("button.colorHistory").map(function (k, button) {
		return $(button).text();
	}).get();

	if (historyNums.length > 0) {
		nextHistoryNum = Math.max(...historyNums) + 1;
	} else {
		nextHistoryNum = 1;
	}

	if (!historyColors.includes(lineColor)) {
		// Line color is new - add it to history
		addColorHistoryButton(lineColor, nextHistoryNum);
		nextHistoryNum = nextHistoryNum + 1;
	}
	if ($("#colorTools").find("button.colorHistory").length > maxColorHistorySize) {
		$("#colorTools").find("button.colorHistory")
		historyNums = $("#colorTools").find("button.colorHistory").map(function (k, button) {
			return $(button).text();
		}).get();
		// let minHistoryNum = Math.min(...historyNums);
		// Delete the oldest color to make room for new one
		removeColorHistoryButton(1);
	}
	// if (!historyColors.includes(backColor)) {
	// 	// Background color is new - add it to history
	// 	addColorHistoryButton(backColor, nextHistoryNum);
	// }
}

function addColorHistoryButton(color, num) {
	let colorHistoryButton = $("<button/>", {
		"text": num,
		"class": "colorHistory",
		"onclick": 'colorHistoryClickHandler(event, this)',
		"appendTo": $("#colorTools")
	}).css({
		"background-color": color,
		"width": "30px",
		"height": "30px",
		"padding": "0px"
	});
	try {
		rgbColor = parseRGBString($(colorHistoryButton).css('background-color'));
		$(colorHistoryButton).attr('title', rgbColor);
		let contrastRGB = getContrastingRGBColor(rgbColor);
		$(colorHistoryButton).css('color', rgbToHex(contrastRGB));
	} catch(err) {
		console.log('Error - cannot create history buttons.')
		$(colorHistoryButton).remove();
	}
}

function removeColorHistoryButton(numOrButton) {
	let buttonFound;
	if (typeof(numOrButton) == 'number') {
		buttonFound = $("#colorTools").find("button.colorHistory:contains('"+numOrButton+"')");
	} else {
		buttonFound = $(numOrButton);
	}

	if (buttonFound.length > 0) {
		buttonFound.remove();
		$("#colorTools").find("button.colorHistory").each(function(k, element) {
			$(element).text(k+1);
		});
	}
}

function colorHistoryClickHandler(event, numOrButton) {
	let buttonFound;
	switch (typeof(numOrButton)) {
		case 'string':
		buttonFound = parseInt(buttonFound);
		case 'number':
		buttonFound = $("#colorTools").find("button.colorHistory:contains('"+numOrButton+"')");
		break;
		default:
		buttonFound = $(numOrButton);
	}
	if (buttonFound.length == 0) {
		// No button with that number found.
		return;
	}
	let colorString = buttonFound.css('background-color');
	let color = rgbToHex(parseRGBString(colorString));
	if (event.shiftKey) {
		$('#backgroundColor').val(color);
	} else if (event.ctrlKey || event.altKey) {
		removeColorHistoryButton(buttonFound);
	} else {
		$('#lineColor').val(color);
	}
	updateCanvas();
}

function setLineColor(color) {
	$('#lineColor').val(color);
}
function setBackgroundColor(color) {
	$('#backgroundColor').val(color);
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
	if (mode == "editSymmetries") {
		if (hoverSymmetryIndex == null || (!evt.ctrlKey && !evt.altKey)) {   // Not clicking on an existing symmetry
			if (temporarySymmetry != undefined) {    // Temporary symmetry exists
				if (temporarySymmetry.getNumPoints() == 2) {
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
					if (temporarySymmetry.getNumPoints() < 2) {
						addSymmetry(temporarySymmetry)
						temporarySymmetry = undefined;
					}
				} else {
					// console.log("This should not happen unless this is a touch device");
				}
			}
		} else if (evt.ctrlKey | evt.altKey) {    // Clicking on an existing symmetry with control key down
			// Control button was pressed
			temporarySymmetry = removeSymmetry(hoverSymmetryIndex);
			// Make sure we're starting by editing the correct point
			if (temporarySymmetry.type == "scale" || temporarySymmetry.type == "spiral" || temporarySymmetry.type == "circle") {
				// For scale, spiral, and circle symmetries, it makes more sense to pick up the primary point and leave the secondary point undefined.
				if (hoverSymmetryPointIndex == 0) {
					// Clicked on point1
					temporarySymmetry.point2 = undefined;
				} else {
					// Clicked on point2

				}
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
	switch (type) {
		case "rotation":
		case "translation":
		case "scale":
		case "line":
		case "spiral":
		case "glide":
			order = parseInt(getSymmetryOrder());
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
		"1rot3_2rot12":"%5B%7B%22type%22:%22identity%22,%22level%22:0,%22point1%22:null,%22point2%22:null,%22order%22:0%7D,%7B%22type%22:%22rotation%22,%22level%22:1,%22point1%22:%5B630,259.80762113533154%5D,%22order%22:3%7D,%7B%22type%22:%22rotation%22,%22level%22:2,%22point1%22:%5B810,259.80762113533154%5D,%22order%22:12%7D%5D",
		"1line_2line_3line":"%5B%7B%22type%22:%22identity%22,%22level%22:0,%22point1%22:null,%22point2%22:null,%22order%22:0%7D,%7B%22type%22:%22line%22,%22level%22:1,%22point1%22:%5B700,120%5D,%22point2%22:%5B560,260%5D%7D,%7B%22type%22:%22line%22,%22level%22:2,%22point1%22:%5B560,160%5D,%22point2%22:%5B700,320%5D%7D,%7B%22type%22:%22line%22,%22level%22:4,%22point1%22:%5B660,120%5D,%22point2%22:%5B660,320%5D%7D%5D",
		"1rot29":"%5B%7B%22type%22:%22identity%22,%22level%22:0,%22point1%22:null,%22point2%22:null,%22order%22:0%7D,%7B%22type%22:%22rotation%22,%22level%22:1,%22point1%22:%5B700,311.76914536239786%5D,%22order%22:29%7D%5D",
		"1rot7_2line":"%5B%7B%22type%22:%22identity%22,%22level%22:0,%22point1%22:null,%22point2%22:null,%22order%22:0%7D,%7B%22type%22:%22rotation%22,%22level%22:1,%22point1%22:%5B540,242.4871130596428%5D,%22order%22:7%7D,%7B%22type%22:%22line%22,%22level%22:2,%22point1%22:%5B650,121.2435565298214%5D,%22point2%22:%5B650,363.7306695894642%5D%7D%5D",
		"1rot4_2line":"%5B%7B%22type%22:%22identity%22,%22level%22:0,%22point1%22:null,%22point2%22:null,%22order%22:0%7D,%7B%22type%22:%22rotation%22,%22level%22:1,%22point1%22:%5B660,300%5D,%22order%22:4%7D,%7B%22type%22:%22line%22,%22level%22:2,%22point1%22:%5B660,300%5D,%22point2%22:%5B560,200%5D%7D%5D",
		"1line_2line_3rot7":"%5B%7B%22type%22:%22identity%22,%22level%22:0,%22point1%22:null,%22point2%22:null,%22order%22:0%7D,%7B%22type%22:%22line%22,%22level%22:1,%22point1%22:%5B680,280%5D,%22point2%22:%5B800,200%5D%7D,%7B%22type%22:%22line%22,%22level%22:2,%22point1%22:%5B680,280%5D,%22point2%22:%5B540,200%5D%7D,%7B%22type%22:%22rotation%22,%22level%22:3,%22point1%22:%5B680,280%5D,%22order%22:7%7D%5D",
		"1scale5_2rot6":"%5B%7B%22type%22:%22identity%22,%22level%22:0,%22point1%22:null,%22point2%22:null,%22order%22:0%7D,%7B%22type%22:%22scale%22,%22level%22:1,%22point1%22:%5B680,280%5D,%22point2%22:%5B687,254%5D,%22order%22:5%7D,%7B%22type%22:%22rotation%22,%22level%22:2,%22point1%22:%5B680,280%5D,%22order%22:6%7D%5D",
		"1rot3_2scl_2scl_2scl":"%5B%7B%22type%22:%22identity%22,%22level%22:null,%22point1%22:null,%22point2%22:null,%22order%22:0%7D,%7B%22type%22:%22rotation%22,%22level%22:1,%22point1%22:%5B703,246%5D,%22order%22:3%7D,%7B%22type%22:%22scale%22,%22level%22:2,%22point1%22:%5B628,117%5D,%22point2%22:%5B618,97%5D,%22order%22:6%7D,%7B%22type%22:%22scale%22,%22level%22:2,%22point1%22:%5B852,247%5D,%22point2%22:%5B872,246%5D,%22order%22:6%7D,%7B%22type%22:%22scale%22,%22level%22:2,%22point1%22:%5B632,369%5D,%22point2%22:%5B622,386%5D,%22order%22:6%7D%5D",
		"1scl6_2scl6_3scl6_4rot3":"%5B%7B%22type%22:%22identity%22,%22level%22:null,%22point1%22:null,%22point2%22:null,%22order%22:0%7D,%7B%22type%22:%22scale%22,%22level%22:1,%22point1%22:%5B630,363.7306695894642%5D,%22point2%22:%5B647.5,350.7402885326976%5D,%22order%22:6%7D,%7B%22type%22:%22scale%22,%22level%22:2,%22point1%22:%5B630,103.92304845413263%5D,%22point2%22:%5B642.5,125.57368354874359%5D,%22order%22:6%7D,%7B%22type%22:%22scale%22,%22level%22:3,%22point1%22:%5B855,233.8268590217984%5D,%22point2%22:%5B830,233.8268590217984%5D,%22order%22:6%7D,%7B%22type%22:%22rotation%22,%22level%22:4,%22point1%22:%5B705,233.8268590217984%5D,%22order%22:3%7D%5D",
		"1rot6_2rot17_3scl7":"%5B%7B%22type%22:%22identity%22,%22level%22:null,%22point1%22:null,%22point2%22:null,%22order%22:0%7D,%7B%22type%22:%22rotation%22,%22level%22:1,%22point1%22:%5B570,311.76914536239786%5D,%22order%22:6%7D,%7B%22type%22:%22rotation%22,%22level%22:3,%22point1%22:%5B750,311.76914536239786%5D,%22order%22:17%7D,%7B%22type%22:%22scale%22,%22level%22:4,%22point1%22:%5B750,311.76914536239786%5D,%22point2%22:%5B762,290%5D,%22order%22:7%7D%5D",
		"1spi18_2rot6":"%5B%7B%22type%22:%22identity%22,%22level%22:null,%22point1%22:null,%22point2%22:null,%22order%22:0%7D,%7B%22type%22:%22spiral%22,%22level%22:1,%22point1%22:%5B630,311.76914536239786%5D,%22point2%22:%5B651,287%5D,%22order%22:18%7D,%7B%22type%22:%22rotation%22,%22level%22:2,%22point1%22:%5B750,311.76914536239786%5D,%22order%22:6%7D%5D",
		"1spi18_2rot6_3spi18_4rot6":"%5B%7B%22type%22:%22identity%22,%22level%22:null,%22point1%22:null,%22point2%22:null,%22order%22:0%7D,%7B%22type%22:%22spiral%22,%22level%22:1,%22point1%22:%5B537.5,272.7980021920981%5D,%22point2%22:%5B570,277.12812921102034%5D,%22order%22:18%7D,%7B%22type%22:%22rotation%22,%22level%22:2,%22point1%22:%5B537.5,272.7980021920981%5D,%22order%22:6%7D,%7B%22type%22:%22spiral%22,%22level%22:3,%22point1%22:%5B742.5,272.7980021920981%5D,%22point2%22:%5B712.5,272.7980021920981%5D,%22order%22:18%7D,%7B%22type%22:%22rotation%22,%22level%22:4,%22point1%22:%5B742.5,272.7980021920981%5D,%22order%22:5%7D%5D",
		"1rot3_2trans7_3trans7":"%5B%7B%22type%22:%22identity%22,%22level%22:null,%22point1%22:null,%22point2%22:null,%22order%22:0%7D,%7B%22type%22:%22rotation%22,%22level%22:1,%22point1%22:%5B660,311.76914536239786%5D,%22order%22:3%7D,%7B%22type%22:%22translation%22,%22level%22:2,%22point1%22:%5B660,311.76914536239786%5D,%22point2%22:%5B780,311.76914536239786%5D,%22order%22:20%7D,%7B%22type%22:%22translation%22,%22level%22:3,%22point1%22:%5B660,311.76914536239786%5D,%22point2%22:%5B600,207.84609690826525%5D,%22order%22:10%7D%5D",
		"0line_1rot3_2trans7_3trans7":"%5B%7B%22type%22:%22identity%22,%22level%22:null,%22point1%22:null,%22point2%22:null,%22order%22:0%7D,%7B%22type%22:%22line%22,%22level%22:0,%22point1%22:%5B660,311.76914536239786%5D,%22point2%22:%5B600,311.76914536239786%5D%7D,%7B%22type%22:%22rotation%22,%22level%22:1,%22point1%22:%5B660,311.76914536239786%5D,%22order%22:3%7D,%7B%22type%22:%22translation%22,%22level%22:2,%22point1%22:%5B660,311.76914536239786%5D,%22point2%22:%5B780,311.76914536239786%5D,%22order%22:20%7D,%7B%22type%22:%22translation%22,%22level%22:3,%22point1%22:%5B660,311.76914536239786%5D,%22point2%22:%5B600,207.84609690826525%5D,%22order%22:10%7D%5D",
		"1trans128_2circ","%5B%7B%22type%22:%22identity%22,%22level%22:null,%22point1%22:null,%22point2%22:null,%22order%22:0%7D,%7B%22type%22:%22translation%22,%22level%22:2,%22point1%22:%5B640,120%5D,%22point2%22:%5B720,120%5D,%22order%22:128%7D,%7B%22type%22:%22circle%22,%22level%22:3,%22point1%22:%5B680,440%5D,%22point2%22:%5B680,180%5D%7D%5D"
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

var lastSymmetryOrders = {};

$(function () {
	drawCanvas = document.getElementById("drawCanvas");
	drawCtx = drawCanvas.getContext('2d');

	$("#gridSnap").on('change', function () {
		gridSnap = $("#gridSnap").prop('checked');
	})
	$("#gridSize").on('change', function () {
		updateGridSize($("#gridSize").val());
	});
	$("#gridType").on('change', function() {
		gridType = $("#gridType").val();
		updateGridSize($("#gridSize").val())
	});
	$("#gridType").trigger('change');
	$("#gridSnap").trigger('change');
	$("#gridSize").trigger('change');

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

	updateColorHistory();

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

	// Pre-populate lastSymmetryOrders
	lastSymmetryOrders.point = 0;
	lastSymmetryOrders.line = 0;
	lastSymmetryOrders.rotation = 7;
	lastSymmetryOrders.scale = 5;
	lastSymmetryOrders.translation = 7;
	lastSymmetryOrders.glide = 18;
	lastSymmetryOrders.spiral = 18;

	//Setup event callbacks:
	$("#symmetryType").on(
		'change',
		function() {
			setModeIndicator("editSymmetries");
			let type = getSelectedSymmetryType();
			// Hide symmetry order for symmetry types that don't have an order
			switch (type) {
				case 'line':
				case 'circle':
				case 'point':
					$("#symmetryOrder").css(
						'visibility',
						'hidden'
					)
					break;
				default:
					$("#symmetryOrder").css(
						'visibility',
						'visible'
					)
					break;
			}
			$('#symmetryOrder').val(lastSymmetryOrders[type]);
		}
	);
	// Trigger change callback
	$("#symmetryType").change();

	$('#symmetryOrder').on(
		'click touchstart',
		function () {
			setModeIndicator("editSymmetries");
			let type = getSelectedSymmetryType();
			lastSymmetryOrders[type] = getSymmetryOrder();
		}
	);
	$("#drawCanvas").on(
		'mousedown touchstart',
		function (evt) {
			if (mode == "draw" && evt.shiftKey) {
				restartFromLast();
			}
		}
	);

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
	var version = '1.19';
	$("#footer").html($('#footer').html()+version);

	setModeIndicator("draw");
});

function updateGridSize(gridSize) {
	switch (gridType) {
		case 'rect':
			gridSizeX = gridSize;
			gridSizeY = gridSize;
			break;
		case 'hex':
			gridSizeX = gridSize;
			gridSizeY = gridSize * Math.sqrt(3)/2;
			break;
	}
}


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
			pixelMap[xx][yy] = rgbToHex([imgData.data[zz], imgData.data[zz+1], imgData.data[zz+2]]);
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
	saveState();
	updateCanvas();
}

function clearSymmetries() {
	symmetries = [new symmetry("identity", Number.NEGATIVE_INFINITY, null, null, 0)];
	$("#symmetryLevel").val(1);
	saveState();
	recalculateSymmetries();
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
function drawSpiralSymmetry(sym, color, alpha, verbose) {
	// drawRotationalSymmetry(sym, color, alpha, verbose);
	drawScaleSymmetry(sym, color, alpha, verbose);
	drawCtx.globalAlpha = alpha;
	drawRadiatingArcs(sym.point1[0], sym.point1[1], sym.order, scaleBaseRadius, null, [2, 8]);
	drawCtx.globalAlpha = 1.0;
}
function drawGlideSymmetry(sym, color, alpha, verbose) {
	let point1 = sym.point1;
	let point2 = sym.point2;
	if (point2 == null) {
		point2 = getTempPoint2(point1);
	}
	let dash = [4, 4];
	let lineWidth = 1;
	drawCtx.globalAlpha = alpha;
	drawFullLine(point1[0], point1[1], point2[0], point2[1], color, dash, lineWidth);
	// Draw control points
	drawCtx.beginPath();
	drawCtx.setLineDash([])
	drawArrowHead(point1[0], point1[1], point2[0]-point1[0], point2[1]-point1[1], 9, [], color, lineWidth);
	drawArrowHead(point2[0], point2[1], point2[0]-point1[0], point2[1]-point1[1], 9, [], color, lineWidth);
	if (verbose) {

	}
	drawCtx.globalAlpha = 1.0;
}
function drawArrowHead(x, y, dx, dy, length, dash, color, lineWidth) {
	// Draws an arrowhead at (x, y) with sides of the given length pointing in a direction defined by the deltas dx and dy
	// Convert dx/dy to unit vector
	let d = Math.sqrt(dx*dx+dy*dy);
	dx = dx*length/d;
	dy = dy*length/d;
	// Rotate
	let angle = 55; // in degrees
	let c = Math.cos((180 - angle/2) * Math.PI/180);
	let s = Math.sin((180 - angle/2) * Math.PI/180);
	let dxL = dx * c - dy * s;
	let dyL = dx * s + dy * c;
	let dxR = dx * c + dy * s;
	let dyR = -dx * s + dy * c;
	drawCtx.setLineDash(dash);
	drawCtx.strokeStyle = color;
	drawCtx.linewidth = lineWidth;
	drawCtx.beginPath();
	drawCtx.moveTo(x, y);
	drawCtx.lineTo(x + dxL, y + dyL);
	drawCtx.moveTo(x, y);
	drawCtx.lineTo(x + dxR, y + dyR);
	drawCtx.stroke();
}
function drawCircleSymmetry(sym, color, alpha, verbose) {
	let point1 = sym.point1;
	let point2 = sym.point2;
	if (point2 == null) {
		point2 = getTempPoint2(point1);
	}

	drawCtx.globalAlpha = alpha;
	drawCtx.linewidth = 1;
	drawCtx.strokeStyle = color;

	// Draw center of circle
	drawRadiatingArcs(point1[0], point1[1], 12, 0, 6, []);

	// Draw circumference
	drawCtx.beginPath();
	drawCtx.setLineDash([2, 8]);
	let radius = Math.sqrt((point2[0]-point1[0])**2 + (point2[1]-point1[1])**2);
	drawCtx.arc(point1[0], point1[1], radius, 0, 2*Math.PI);
	drawCtx.stroke()

	// Draw control point
	let dx = point2[0] - point1[0];
	let dy = point2[1] - point1[1];
	let lineWidth = 1;
	drawArrowHead(point2[0], point2[1], dx, dy, 9, [], color, lineWidth);
	drawArrowHead(point2[0], point2[1], -dx, -dy, 9, [], color, lineWidth);


	if (verbose) {

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
	drawRadiatingArcs(sym.point1[0], sym.point1[1], sym.order, 0, null, [2, 8]);
	if (verbose) {
		// drawCtx.fillStyle = 'black';
		// drawCtx.fillText(Math.round(sym.point1[0])+','+Math.round(sym.point1[1]), sym.point1[0]+rotationControlPointRadius, sym.point1[1]-rotationControlPointRadius);
		// drawCtx.fillText('x'+sym.order, sym.point1[0]+rotationControlPointRadius, sym.point1[1]+rotationControlPointRadius);
	}
	drawCtx.globalAlpha = 1.0;
}

function drawRadiatingArcs(x, y, order, startRadius, endRadius, dash) {
	if (endRadius == null) {
		endRadius = Math.sqrt(drawCanvas.width**2 + drawCanvas.height**2);
	}
	drawCtx.beginPath();
	drawCtx.setLineDash(dash)
	var angle;
	for (var j = 0; j < Math.abs(order); j++) {
		angle = 2*Math.PI * j / order;
		drawCtx.moveTo(x + Math.cos(angle)*startRadius, y + Math.sin(angle)*startRadius);
		drawCtx.lineTo(x + Math.cos(angle)*endRadius, y + Math.sin(angle)*endRadius);
	}
	drawCtx.stroke();
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
	let dash = [4, 4];
	let lineWidth = 1;
	drawCtx.globalAlpha = alpha;
	drawFullLine(point1[0], point1[1], point2[0], point2[1], color, dash, lineWidth);
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

function drawFullLine(x1, y1, x2, y2, color, dash, lineWidth) {
	// Get length guaranteed to be longer than canvas diagonal
	let L = drawCanvas.width + drawCanvas.height;
	let dx = x2 - x1;
	let dy = y2 - y1;
	// Pick the largest delta to generate scaling factor
	let maxDelta = Math.max(Math.abs(dx), Math.abs(dy));
	if (maxDelta == 0) {
		return;
	}
	let scale = L / maxDelta;
	// Increase dx and dy so x +/- dx and y +/- dy are all guaranteed to be off of canvas,
	// 	ensuring line will go all the way across the canvas.
	dx = scale * dx;
	dy = scale * dy;
	drawCtx.linewidth = lineWidth;
	drawCtx.strokeStyle = color;
	drawCtx.setLineDash(dash)
	drawCtx.beginPath();
	drawCtx.moveTo(x1-dx, y1-dy);
	drawCtx.lineTo(x1+dx, y1+dy);
	drawCtx.stroke();
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
		var startNewSegment;

		drawCtx.lineWidth = 1;
		drawCtx.strokeStyle = currentColor;
		drawCtx.setLineDash([]);

		drawCtx.beginPath();
		for (var traceNum = 0; traceNum < traceX.length; traceNum++) {
			startNewSegment = true;
			for (var k = 0; k < traceX[traceNum].length; k++){
				if (isNaN(traceX[traceNum][k]) ||  traceC[traceNum][k] != currentColor) {
					startNewSegment = true;
					if (isNaN(traceX[traceNum][k])) {
						continue;
					}
				}
				if (startNewSegment) {
					// Stroke last segment
					drawCtx.strokeStyle = currentColor;
					drawCtx.stroke();
					// Start new segment
					drawCtx.beginPath();
					drawCtx.moveTo(traceX[traceNum][k], traceY[traceNum][k]);

					currentColor = traceC[traceNum][k];
					startNewSegment = false;
				} else {
					// Continue current segment
					drawCtx.lineTo(traceX[traceNum][k], traceY[traceNum][k]);
				}
			}
		}
		drawCtx.strokeStyle = currentColor;
		drawCtx.stroke();

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
					drawPointSymmetry(symmetriesToDraw[k], color, alpha, verbose);
					break;
				case "line":
					drawLineSymmetry(symmetriesToDraw[k], color, alpha, verbose);
					break;
				case "rotation":
					drawRotationalSymmetry(symmetriesToDraw[k], color, alpha, verbose);
					break;
				case "translation":
					drawTranslationalSymmetry(symmetriesToDraw[k], color, alpha, verbose);
					break;
				case "scale":
					drawScaleSymmetry(symmetriesToDraw[k], color, alpha, verbose);
					break;
				case "spiral":
					drawSpiralSymmetry(symmetriesToDraw[k], color, alpha, verbose);
					break;
				case "glide":
					drawGlideSymmetry(symmetriesToDraw[k], color, alpha, verbose);
					break;
				case "circle":
					drawCircleSymmetry(symmetriesToDraw[k], color, alpha, verbose);
					break;
				default:
					console.log("Error, invalid symmetry type");
			}
		}
		drawCtx.globalAlpha = 1.0;
	}
}
