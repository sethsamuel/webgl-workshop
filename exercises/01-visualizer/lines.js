const vertexSource = `
  precision highp float;
  attribute vec3 aPosition;
  varying float vAmplitude;
  void main(void) {
    vAmplitude = abs(aPosition.y);
    gl_Position = vec4(aPosition, 1.0);
  }
`;

const fragmentSource = `
  precision highp float;
  varying float vAmplitude;
  void main(void) {
    gl_FragColor = vec4(1.0,vAmplitude,0,1.0);
  }
`;

createVisualizer(vertexSource, fragmentSource, (gl, shaderProgram) => {
  // INITIALIZE BUFFERS
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // END INITIALIZE BUFFERS

  // POINTERS
  const aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
  gl.enableVertexAttribArray(aPosition);
  //gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
  gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);

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

    var vertices = [];
    sample.forEach((s, i) => {
        const x = i/sample.length * 2 - 1;
        // x0
        vertices.push(x);
        // y0
        vertices.push(0);
        // z0
        vertices.push(0);

        // x1
        vertices.push(x);
        // y1
        vertices.push((s)/256);
        // z1
        vertices.push(0);
    });
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    gl.lineWidth(1);
    //Draw the vertex arrays
    gl.drawArrays(gl.LINES, 0, vertices.length/3);

  }
});
