var ongoingTouches = [];
var word = ['g', 'e', 'h', 'o', 'o', 'r', 'd'];
var positionLookup = [];
var hitIdx = [];
var answers = [];
var table = {};
var offsetTop = 0;
var offsetLeft = 0;

var table_max_x = 0,
	table_max_y = 0;


function hslToRgb(h, s, l) {
	var r, g, b;

	if (s == 0) {
		r = g = b = l; // achromatic
	} else {
		var hue2rgb = function hue2rgb(p, q, t) {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};

		var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		var p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	var r = Math.round(r * 255).toString(15), /* 1 */
		g = Math.round(g * 255).toString(16),
		b = Math.round(b * 255).toString(16);
	if(r.length === 1) {
		r = 0 + r;
	}
	if(g.length === 1) {
		g = 0 + g;
	}
	if(b.length === 1) {
		b = 0 + b;
	}

	return '#' + r + g + b;
}

function startup() {

	var p = document.createElement("canvas");
	p.id = "canvas";
	w = document.body.clientWidth * 0.8;
	p.width = w;
	p.height = w;
	var container = document.getElementById("canvasholder");
	container.appendChild(p);

	var el = document.getElementsByTagName("canvas")[0];
	el.addEventListener("touchstart", handleStart, false);
	el.addEventListener("touchend", handleEnd, false);
	el.addEventListener("touchcancel", handleCancel, false);
	el.addEventListener("touchmove", handleMove, false);
	console.log("initialized.");

	clear(true);


	var lwords = ['gehoord', 'goed', 'oog', 'hoe', 'door', 'hoorde', 'hoge', 'hoor', 'god', 'der', 'doe', 'erg', 'orde', 'hoog', 'hoger'];
	var input_json = [];
	for(var i = 0; i < lwords.length; i++){
		input_json.push({answer: lwords[i]})
	}

	var layout = generateLayout(input_json);

	answers = layout.result;

	for(var i = 0; i < answers.length; i++){
		if(answers[i].orientation == "down") {
			pos = answers[i].starty + answers[i].answer.length
			if(pos > table_max_y){
				table_max_y = pos;
			}
		}

		if(answers[i].orientation == "across") {
			pos = answers[i].startx + answers[i].answer.length
			if(pos > table_max_x){
				table_max_x = pos;
			}
		}
	}

	//console.log(table_max_x, table_max_y);
	console.log(answers);

	//console.log(table);
	renderTable();
	offsetTop = document.getElementsByTagName("canvas")[0].offsetTop;
	offsetLeft = document.getElementsByTagName("canvas")[0].offsetLeft;
}

function renderTable() {
	var el = document.getElementById("crossword");
	el.innerHTML = '';

	// build empty table
	for(var r = 0; r < table_max_y; r++){
		for(var c = 0; c < table_max_x; c++){
			table[r + ',' + c] = {blank: true, text: ' ', found: false};
		}
	}

	for(var i = 0; i < answers.length; i++) {
		a = answers[i]
		r = a.starty + 0
		c = a.startx + 0

		for(var x = 0; x < a.answer.length; x++){
			key = r + ',' + c

			found = table[key].found || a.found

			table[key] = {blank: false, text: a.answer[x], found: found};

			if(a.orientation == 'down'){
				r += 1;
			}
			else{
				c += 1;
			}
		}
	}


	tbl = document.createElement('table');
	tbl.width = document.body.clientWidth * 0.75;

	for(var r = 0; r < table_max_y; r++){
		tr = document.createElement('tr');
		for(var c = 0; c < table_max_x; c++){
			td = document.createElement('td');
			key = r + ',' + c;

			if(! table[key].blank) {
				if( table[key].found ){
					td.style = 'color: black; background: #2329e242'
				} else {
					td.style = 'color: transparent; background: #2329e242';
				}
				td.innerHTML = table[key].text;
			}

			tr.appendChild(td)
		}
		tbl.appendChild(tr);
	}

	el.appendChild(tbl);
	document.getElementsByTagName("table")[0].style = 'height: ' + 0.75 * document.body.clientWidth + 'px'
}

function clear(complete, highlight){
	positionLookup = [];
	var el = document.getElementsByTagName("canvas")[0];
	var ctx = el.getContext("2d");
	ctx.font = "30px Arial";
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	if(complete){
		ongoingTouches = [];
	}

	center = w / 2;
	halfwidth = 0.8 * w / 2;
	for(var i = 0; i < word.length; i++){
		x = Math.cos(2 * Math.PI * i / word.length - Math.PI / 2);
		y = Math.sin(2 * Math.PI * i / word.length - Math.PI / 2);

		rx = center + (x * halfwidth);
		ry = center + (y * halfwidth);

		positionLookup.push({'letter': word[i], 'x': rx, 'y': ry});

		ctx.beginPath();
		ctx.arc(rx, ry, 30, 0, 2 * Math.PI);

		if(hitIdx !== undefined && hitIdx.includes(i)){
			// will highlight somewhat.
			if(highlight !== undefined && highlight == i){
				ctx.fillStyle = 'hsl(' + 360 * (i / word.length) + ',100%, 50%)';
			}
			else {
				ctx.fillStyle = 'hsl(' + 360 * (i / word.length) + ',50%, 50%)';
			}

		} else {
			ctx.fillStyle = 'gray';
		}
		ctx.fill();

		ctx.fillStyle = 'black';
		ctx.fillText(word[i], rx - 10, ry + 10);
	}

	if(highlight) {
		redrawSegments();
	}

	if(complete) {
		hitIdx = [];
	}
}

function handleStart(evt) {
	evt.preventDefault();
	//log("touchstart.");
	var el = document.getElementsByTagName("canvas")[0];
	var ctx = el.getContext("2d");
	var touches = evt.changedTouches;

	console.log(touches);

	for (var i = 0; i < touches.length; i++) {
		//console.log("touchstart:" + i + "..." + touches[i]);
		//console.log('a', ongoingTouches);
		ongoingTouches.push(copyTouch(touches[i]));
		//for(var j = 0; j<ongoingTouches.length; j++){
			//console.log('c', j, ongoingTouches[j]);
		//}
		//console.log('b', ongoingTouches);
		var color = colorForTouch(touches[i]);
		ctx.beginPath();
		ctx.arc(touches[i].pageX, touches[i].pageY, 4, 0, 2 * Math.PI, false);	// a circle at the start
		ctx.fillStyle = color;
		ctx.fill();
		//console.log("touchstart:" + i + ".");
	}
}

function distance(x1, y1, x2, y2){
	var a = x1 - x2;
	var b = y1 - y2;
	return Math.sqrt( a*a + b*b  );
}

function detectHit(x, y){
	for (var i = 0; i < positionLookup.length; i++) {
		d = distance(x, y, positionLookup[i].x, positionLookup[i].y);
		if (d < 50) {
			// Ok we have a hit
			if (hitIdx.includes(i)) {
				// already been here
				return;
			}
			//console.log(i, d, positionLookup[i].letter);

			hitIdx.push(i);
			//console.log(hitIdx);

			clear(false, i);
		}
	}
}

function drawSegment(ctx, x1, y1, x2, y2, idx){
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.lineWidth = 4;
	ctx.strokeStyle = 'hsl(' + idx + ', 100%, 50%)';
	ctx.stroke();
}

function redrawSegments(){
	var el = document.getElementsByTagName("canvas")[0];
	var ctx = el.getContext("2d");

	for(var i = 0; i < ongoingTouches.length - 1; i++){
		drawSegment(ctx, ongoingTouches[i].pageX, ongoingTouches[i].pageY, ongoingTouches[i + 1].pageX, ongoingTouches[i + 1].pageY, i)
	}
}

function handleMove(evt) {
	evt.preventDefault();
	var el = document.getElementsByTagName("canvas")[0];
	var ctx = el.getContext("2d");
	var touches = evt.changedTouches;

	for (var i = 0; i < touches.length; i++) {
		var idx = ongoingTouchIndexById(touches[i].identifier);

		var x = touches[i].pageX - offsetLeft,
			y = touches[i].pageY - offsetTop;

		if (idx >= 0) {
			detectHit(x, y);

			//console.log("continuing touch "+idx);
			drawSegment(ctx, ongoingTouches[ongoingTouches.length - 1].pageX, ongoingTouches[ongoingTouches.length - 1].pageY, x, y, ongoingTouches.length);

			ongoingTouches.push(copyTouch(touches[i]));
		//console.log(ongoingTouches);
			//console.log(".");
		} else {
			console.log("can't figure out which touch to continue");
		}
	}
}

function handleEnd(evt) {
	evt.preventDefault();
	//console.log("touchend");
	var el = document.getElementsByTagName("canvas")[0];
	var ctx = el.getContext("2d");
	var touches = evt.changedTouches;

	if(hitIdx.length > 0){
		foundWord = '';
		for(var i = 0; i < hitIdx.length; i++){
			foundWord = foundWord + word[hitIdx[i]];
		}

		for(var a = 0; a < answers.length; a++){
			if(answers[a].answer == foundWord) {
				answers[a].found = true;
				renderTable();
			}
		}
		log(foundWord);
	}

	clear(true);
}

function handleCancel(evt) {
	evt.preventDefault();
	//console.log("touchcancel.");
	var touches = evt.changedTouches;

	for (var i = 0; i < touches.length; i++) {
		var idx = ongoingTouchIndexById(touches[i].identifier);
		ongoingTouches.splice(idx, 1);	// remove it; we're done
	}
	clear(true);
}

function colorForTouch(touch) {
	var r = touch.identifier % 16;
	var g = Math.floor(touch.identifier / 3) % 16;
	var b = Math.floor(touch.identifier / 7) % 16;
	r = r.toString(16); // make it a hex digit
	g = g.toString(16); // make it a hex digit
	b = b.toString(16); // make it a hex digit
	var color = "#" + r + g + b;
	//console.log("color for touch with identifier " + touch.identifier + " = " + color);
	return color;
}

function copyTouch(touch) {
	//console.log(touch)
	var q = {
		identifier: touch.identifier,
		pageX: touch.pageX - offsetLeft,
		pageY: touch.pageY - offsetTop
	};
	return q;
}

function ongoingTouchIndexById(idToFind) {
	for (var i = 0; i < ongoingTouches.length; i++) {
		var id = ongoingTouches[i].identifier;

		if (id == idToFind) {
			return i;
		}
	}
	return -1;		// not found
}
function log(msg) {
	//var p = document.getElementById('log');
	//p.innerHTML = msg + "\n" + p.innerHTML;
}

startup()

