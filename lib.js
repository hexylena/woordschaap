function randomSetSeed(s) {
	seed = s;
}

function random() {
	var x = Math.sin(seed++) * 10000;
	return x - Math.floor(x);
}

//https://stackoverflow.com/questions/42773836/how-to-find-all-subsets-of-a-set-in-javascript
const getAllSubsets = theArray => theArray.reduce((subsets, value) => subsets.concat(subsets.map(set => [value, ...set])), [[]]);

function consume(iterator) {
	values = [];
	while (true) {
		val = iterator.next();
		if (val.done) {
			break;
		}
		values.push(val.value);
	}
	return values;
}

// https://stackoverflow.com/questions/37579994/generate-permutations-of-javascript-array
function perm(xs) {
	let ret = [];

	for (let i = 0; i < xs.length; i = i + 1) {
		let rest = perm(xs.slice(0, i).concat(xs.slice(i + 1)));

		if (!rest.length) {
			ret.push([xs[i]]);
		} else {
			for (let j = 0; j < rest.length; j = j + 1) {
				ret.push([xs[i]].concat(rest[j]));
			}
		}
	}
	return ret;
}

function subsets(array) {
	valid_subsets = [];
	selections = getAllSubsets(array).filter(function(a) {
		return a.length > 2 && a.length < 8;
	});
	for (var i = 0; i < selections.length; i++) {
		permutations = perm(selections[i]);
		for (var j = 0; j < permutations.length; j++) {
			p = permutations[j].join("");
			if (wordList.includes(p) || fullWordList.includes(p)) {
				if (!valid_subsets.includes(p)) {
					valid_subsets.push(p);
				}
			}
		}
	}
	return valid_subsets;
}

function only5k(array) {
	return array.filter(function(p) {
		return wordList.includes(p);
	});
}

// https://www.frankmitchell.org/2015/01/fisher-yates/
function shuffle(array) {
	var i = 0,
		j = 0,
		temp = null;

	for (i = array.length - 1; i > 0; i -= 1) {
		j = Math.floor(random() * (i + 1));
		temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
}

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

	var r = Math.round(r * 255).toString(15) /* 1 */,
		g = Math.round(g * 255).toString(16),
		b = Math.round(b * 255).toString(16);
	if (r.length === 1) {
		r = 0 + r;
	}
	if (g.length === 1) {
		g = 0 + g;
	}
	if (b.length === 1) {
		b = 0 + b;
	}

	return "#" + r + g + b;
}
function distance(x1, y1, x2, y2) {
	var a = x1 - x2;
	var b = y1 - y2;
	return Math.sqrt(a * a + b * b);
}

function setTitle(title) {
	document.getElementById("level").innerHTML = title;
}

/**
 * https://gist.github.com/mjackson/5311256
 *
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */
function rgbToHsl(r, g, b) {
	(r /= 255), (g /= 255), (b /= 255);

	var max = Math.max(r, g, b),
		min = Math.min(r, g, b);
	var h,
		s,
		l = (max + min) / 2;

	if (max == min) {
		h = s = 0; // achromatic
	} else {
		var d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}

		h /= 6;
	}

	return [h, s, l];
}
