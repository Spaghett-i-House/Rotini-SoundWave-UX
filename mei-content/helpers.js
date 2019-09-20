// Initiates a given shader program
function initShaderProgram(gl, vsSource, fsSource) {
	const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
	const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

	// Create the shader program
	const shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	// If creating the shader program failed, alert
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		console.log('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
		return null;
	}

	return shaderProgram;
}

// Loads a given shader
function loadShader(gl, type, source) {
	const shader = gl.createShader(type);

	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	// See if it compiled successfully

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}

	return shader;
}

function changeRes(perc) {
	gl = canvas.getContext("webgl");
	const w = 1920 * perc;
	const h = 1080 * perc;

	canvas.width = w;
	canvas.height = h;
	gl.viewport(0, 0, w, h);
}

// hex/opac to RGBA from 0 to 1
function rgbaNorm(hex, opac) {
	if (hex[0] == '#')
		hex = hex.slice(1);

    rv = parseInt(hex.substring(0,2), 16) / 255.0;
    gv = parseInt(hex.substring(2,4), 16) / 255.0;
    bv = parseInt(hex.substring(4,6), 16) / 255.0;

    if (opac === null || typeof opac === "undefined")
    	opac = 1.0;
    else
    	opac /= 255.0;

    return {r: rv, g: gv, b: bv, a: opac}
}

// Convert to radians
function radian(degree) {
   var rad = degree * (Math.PI / 180);
   return rad;
}