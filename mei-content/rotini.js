var canvas;
var vertexCount = 0;
var cScale = 1;

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
	// Initialize the GL context
	canvas = document.querySelector("#glCanvas");
	const gl = canvas.getContext("webgl");
	changeRes(.75);

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

	// Draw the scene repeatedly
	function render(now) {
		now *= 0.001;  // convert to seconds
		drawScene(gl, programInfo, buffers, now);

		requestAnimationFrame(render);
	}
	requestAnimationFrame(render);
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
		col.r, col.g, col.b, col.a // START WITH ONE
	];
	for (i = 0; i <= cFidelity; i++) {
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

function drawScene(gl, programInfo, buffers, now) {
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
	// start drawing.

	mat4.translate(modelViewMatrix,     // destination matrix
	         modelViewMatrix,     		// matrix to translate
	         [-0.0, 0.0, -6.0]);  		// amount to translate

	// And then scale the matrix by said amount
	mat4.scale(modelViewMatrix,  		// destination matrix
     		  modelViewMatrix,     		// matrix to scale
	          [cScale, cScale, cScale]);   // amount to scale

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

	// Pulse big and small
	const scaleF = 0.02;
	const speedF = 10;

	// console.log(Math.pow(Math.sin(speedF * now), 3));
	cScale += scaleF * Math.pow(Math.sin(speedF * now), 3);
}

window.onload = main;