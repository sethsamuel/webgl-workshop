// GLOBALS
const body = document.body;
const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');
// END GLOBALS

// BEGIN WINDOW SIZING
function resize() {
  const size = Math.min(window.innerWidth, window.innerHeight) - 16;
  canvas.width = size;
  canvas.height = size;
  // Set viewport
  gl.viewport(0, 0, canvas.width, canvas.height);
}
resize();

window.addEventListener('resize', resize);
// END WINDOW SIZING


// GL SETTINGS

// Color to draw on clear
gl.clearColor(0,0,0,1);

// Clear buffers
gl.clear(gl.COLOR_BUFFER_BIT);

// END GL SETTINGS


// INITIALIZE SHADERS

// CREATE VERTEX SHADER
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
const vertexSource = `
  precision highp float;
  attribute vec3 aPosition;
  varying vec2 vTexturePosition;
  void main(void) {
    vTexturePosition = vec2(aPosition.x + 1.0, 1.0 - aPosition.y) * 0.5;
    gl_Position = vec4(aPosition, 1.0);
  }
`;
gl.shaderSource(vertexShader, vertexSource);
gl.compileShader(vertexShader);
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
  throw new Error("An error occurred compiling the shader: " + gl.getShaderInfoLog(vertexShader));
}else{
  console.log("Vertex shader compiled");
}
// END CREATE VERTEX SHADER

// CREATE FRAGMENT SHADER
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
const fragmentSource = `
  precision highp float;
  uniform sampler2D uSampler;
  varying vec2 vTexturePosition;
  void main(void) {
    gl_FragColor = texture2D(uSampler, vTexturePosition);
  }
`;
gl.shaderSource(fragmentShader, fragmentSource);
gl.compileShader(fragmentShader);
if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
  throw new Error("An error occurred compiling the shader: " + gl.getShaderInfoLog(fragmentShader));
}else{
  console.log("Fragment shader compiled");
}
// END CREATE FRAGMENT SHADER

// COMPILE PROGRAM
const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);

if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
  throw new Error("Unable to initialize the shader program.");
}else{
  console.log("Initialized shader program");
}
gl.useProgram(shaderProgram);
// END COMPILE PROGRAM

// END INITIALIZE SHADERS

// INITIALIZE BUFFERS
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
const vertices = [
  1, 1, 0,
  -1, 1, 0,
  1, -1, 0,
  -1, -1, 0
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
// END INITIALIZE BUFFERS

// POINTERS
const aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
gl.enableVertexAttribArray(aPosition);
//gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);

const uSampler = gl.getUniformLocation(shaderProgram, "uSampler");
// END POINTERS

// DRAW LOOP
function draw() {
  // Clear pixels and depth
  gl.clear(gl.COLOR_BUFFER_BIT);

  //Set uniforms
  gl.uniform1i(uSampler, 0);

  //Draw the vertex arrays
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / 3);

  requestAnimationFrame(draw);
}
// END DRAW LOOP

// LOAD IMAGE
const tTexture = gl.createTexture();
const image = new Image();
image.crossOrigin = true;
image.onload = () => {
  gl.bindTexture(gl.TEXTURE_2D, tTexture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.generateMipmap(gl.TEXTURE_2D);

  requestAnimationFrame(draw);
};
image.src = './texture.jpg';

// END LOAD IMAGE
