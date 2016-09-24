// GLOBALS
const body = document.body;
const canvas = document.querySelector('canvas');
const audio = document.querySelector('audio');
const gl = canvas.getContext('webgl');
// END GLOBALS

// BEGIN WINDOW SIZING
function resize() {
  const size = Math.min(window.innerWidth, window.innerHeight - 48) - 16;
  canvas.width = size;
  canvas.height = size;

  audio.style.height = '32px';
  audio.style.width = size + 'px';
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

window.createVisualizer = (vertexSource, fragmentSource, callback) => {
  // INITIALIZE SHADERS

  // CREATE VERTEX SHADER
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
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

  const tTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tTexture);

  //Set uniforms
  gl.uniform1i(uSampler, 0);

  callback(gl);
}
