const vertexSource = `
  precision highp float;
  attribute vec3 aPosition;
  varying vec2 vTexturePosition;
  uniform float uTime;
  uniform sampler2D uSamplerIn;
  uniform sampler2D uSamplerOut;
  uniform vec2 uMousePosition;

  float rand(vec2 co){
      return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
  }

  void main(void) {
    float t = uTime/1000.0;
    vTexturePosition = vec2(aPosition.x + 1.0, 1.0 - aPosition.y) * 0.5;
    gl_PointSize = 1.0;
    vec2 offset = - (uMousePosition - aPosition.xy);
    offset = rand(aPosition.xy) * 0.5 * offset;
    float distance = distance(uMousePosition, aPosition.xy);
    float acosX = 3.14*distance;
    if (acosX > 1.0) {
      offset = vec2(0.0);
    } else {
      offset = offset * acos(acosX);
    }
    gl_Position = vec4(aPosition.xy + offset, aPosition.z, 1.0);
  }
`;

const fragmentSource = `
  precision highp float;
  uniform float uTime;
  uniform sampler2D uSamplerIn;
  uniform sampler2D uSamplerOut;
  varying vec2 vTexturePosition;
  void main(void) {
    gl_FragColor = texture2D(uSamplerIn, vTexturePosition);
  }
`;

createVisualizer(vertexSource, fragmentSource, (gl, shaderProgram) => {
  // INITIALIZE BUFFERS
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  const vertices = [];
  for (let x = 0; x < 1024; x++) {
    for (let y = 0; y < 1024; y++) {
      vertices.push(x/1024 * 2 - 1);
      vertices.push(y/1024 * 2 - 1);
      vertices.push(0);
    }
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  // END INITIALIZE BUFFERS

  // POINTERS
  const aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
  gl.enableVertexAttribArray(aPosition);
  //gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
  gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  const tTextureIn = gl.createTexture();
  const tTextureOut = gl.createTexture();

  const uSamplerIn = gl.getUniformLocation(shaderProgram, "uSamplerIn");
  const uSamplerOut = gl.getUniformLocation(shaderProgram, "uSamplerOut");

  const uTime = gl.getUniformLocation(shaderProgram, "uTime");
  const uMousePosition = gl.getUniformLocation(shaderProgram, "uMousePosition");

  // INTERACTION HANDLER
  var mousePosition = [];
  canvas.addEventListener('mousemove', evt => {
    mousePosition = [
      (evt.clientX/canvas.width - 0.5) * 2.0,
      (1.0 - evt.clientY/canvas.height - 0.5) * 2.0
    ];
  });
  // END INTERACTION HANDLER

  // DRAW
  function draw(sample) {
    // Clear pixels and depth
    gl.clear(gl.COLOR_BUFFER_BIT);

    //Set uniforms
    gl.uniform1f(uTime, performance.now());

    //Set uniforms
    gl.uniform2f(uMousePosition, mousePosition[0], mousePosition[1]);

    //Draw the vertex arrays
    gl.drawArrays(gl.PARTICLES, 0, vertices.length/3);

    requestAnimationFrame(draw);
  }


  // LOAD IMAGE IN
  const image = new Image();
  image.crossOrigin = true;
  image.onload = () => {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tTextureIn);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.uniform1i(uSamplerIn, 0);

    loadImageOut();
  };
  image.src = './cheese.jpg';

  // LOAD IMAGE OUT
  function loadImageOut() {
    const image = new Image();
    image.crossOrigin = true;
    image.onload = () => {
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, tTextureOut);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.uniform1i(uSamplerOut, 1);

      requestAnimationFrame(draw);
    };
    image.src = './bread.jpg';
  }

  // END LOAD IMAGE
});
