const vertexSource = `
  precision highp float;
  attribute vec3 aPosition;
  varying vec2 vTexturePosition;
  void main(void) {
    vTexturePosition = vec2(aPosition.x + 1.0, 1.0 - aPosition.y) * 0.5;
    gl_Position = vec4(aPosition, 1.0);
  }
`;

const fragmentSource = `
  precision highp float;
  uniform sampler2D uSampler;
  varying vec2 vTexturePosition;
  void main(void) {
    gl_FragColor = texture2D(uSampler, vTexturePosition);
  }
`;

createVisualizer(vertexSource, fragmentSource, (gl, shaderProgram) => {
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

  // AUDIO ANALYZER
  const analyzer = window.AudioAnalyzer(audio);
  analyzer.onSample(sample => {
    draw(sample);
  });
  // END AUDIO ANALYZER

  // DRAW
  function draw(sample) {
    // Clear pixels and depth
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      Math.sqrt(sample.length/4),
      Math.sqrt(sample.length/4),
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      sample
    );
    gl.generateMipmap(gl.TEXTURE_2D);

    //Draw the vertex arrays
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  }
});
