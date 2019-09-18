vertexCount = 0;

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

// <-- Functions below this point are specific to us -->
const vsSource = `
attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying lowp vec4 vColor;

void main() {
	gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
	vColor = aVertexColor;
}`;

const fsSource = `
varying lowp vec4 vColor;
void main() {
	gl_FragColor = vColor;
}`;

function main() {
	// <-- COMMENT THIS OUT TO VIEW LOADING SPINNER -->
	document.querySelector("body").removeChild(document.querySelector("#loading-spinner"));

	const canvas = document.querySelector("#glCanvas");
	// Initialize the GL context
	const gl = canvas.getContext("webgl");

	// Only continue if WebGL is available and working
	if (gl === null) {
		alert("Unable to initialize WebGL. Your browser or machine may not support it.");
		return;
	}

	// Start program
	const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
	const programInfo = {
		program: shaderProgram,
			attribLocations: {
			vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      		vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
			},
		uniformLocations: {
			projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
			modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
			},
	};

	// Here's where we call the routine that builds all the
	// objects we'll be drawing.
	const buffers = initBuffers(gl);

	// Draw the scene
	drawScene(gl, programInfo, buffers);
}

function initBuffers(gl) {
	// number of verts
	const cFidelity = 100;

	// Create a buffer for the positions.
	const positionBuffer = gl.createBuffer();

	// Select the positionBuffer as the one to apply buffer
	// operations to from here out.
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	// Now create an array of positions for the outer verts.
	const positions = [
		0.0, 0.0 // vertex always
	];

	for (i = 0; i <= cFidelity; i++){
	  positions.push(Math.cos(i * 2 * Math.PI/cFidelity)); // x coord
	  positions.push(Math.sin(i * 2 * Math.PI/cFidelity)); // y coord
	}

	vertexCount = positions.length/2;

	// F32 array -> WebGL to build shape
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

	col = rgbaNorm("#ffd1dc");

	// Array of colors to do
	const colors = [
		col.r, col.g, col.b, col.a // RGB COLOR
	];

	for (i = 0; i <= cFidelity; i++){
		colors.push(col.r, col.g, col.b, col.a);
	}

	const colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

	return {
		position: positionBuffer,
		color: colorBuffer,
	};
}

function drawScene(gl, programInfo, buffers) {
	gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
	gl.clearDepth(1.0);                 // Clear everything
	gl.enable(gl.DEPTH_TEST);           // Enable depth testing
	gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

	// Clear the canvas before we start drawing on it.
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Create a perspective matrix
	// FOV: 45d, W/H: canvas, sight: 0.1 - 100 from camera
	const fieldOfView = radian(45);   // in radians
	const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
	const zNear = 0.1;
	const zFar = 100.0;
	const projectionMatrix = mat4.create();

	// note: glmatrix.js always has the first argument
	// as the destination to receive the result.
	mat4.perspective(projectionMatrix,
				   fieldOfView,
				   aspect,
				   zNear,
				   zFar);

	// Set the drawing position to the "identity" point, which is
	// the center of the scene.
	const modelViewMatrix = mat4.create();

	// Now move the drawing position a bit to where we want to
	// start drawing the.

	mat4.translate(modelViewMatrix,     // destination matrix
	         modelViewMatrix,     		// matrix to translate
	         [-0.0, 0.0, -6.0]);  		// amount to translate

	// position buffer -> vertexAttribute pointer
	{
		const numComponents = 2;  // pull out 2 values per iteration
		const type = gl.FLOAT;    // the data in the buffer is 32bit floats
		const normalize = false;  // don't normalize
		const stride = 0;         // how many bytes to get from one set of values to the next
		                      	  // 0 = use type and numComponents above
		const offset = 0;         // how many bytes inside the buffer to start from
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
		gl.vertexAttribPointer(
			programInfo.attribLocations.vertexPosition,
			numComponents,
			type,
			normalize,
			stride,
			offset);
		gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
	}

	// color buffer -> vertexAttribute pointer
	{
		const numComponents = 4;
		const type = gl.FLOAT;
		const normalize = false;
		const stride = 0;
		const offset = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
		gl.vertexAttribPointer(
			programInfo.attribLocations.vertexColor,
			numComponents,
			type,
			normalize,
			stride,
			offset);
		gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
	}

	// Tell WebGL to use our program when drawing
	gl.useProgram(programInfo.program);

	// Set the shader uniforms
	gl.uniformMatrix4fv(
		programInfo.uniformLocations.projectionMatrix,
		false,
		projectionMatrix);
	gl.uniformMatrix4fv(
		programInfo.uniformLocations.modelViewMatrix,
		false,
		modelViewMatrix);
	{
		const offset = 0;
		gl.drawArrays(gl.TRIANGLE_FAN, offset, vertexCount);
	}
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

function radian(degree) {
   var rad = degree * (Math.PI / 180);
   return rad;
}

window.onload = main;