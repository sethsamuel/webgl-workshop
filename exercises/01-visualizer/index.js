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

createVisualizer(vertexSource, fragmentSource, gl => {
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
