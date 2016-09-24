const AudioAnalzer = function(audioElement) {
  var sampleCallbacks = [];

  const audioContext = new AudioContext();
  const source = audioContext.createMediaElementSource(audioElement);

  const analyzer = audioContext.createAnalyser();
  source.connect(analyzer);
  analyzer.connect(audioContext.destination);

  analyzer.fftSize = 2048;
  const bufferLength = analyzer.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function sample() {
    analyzer.getByteTimeDomainData(dataArray);

    sampleCallbacks.forEach(callback => {
      callback(dataArray);
    });
    requestAnimationFrame(sample);
  }

  requestAnimationFrame(sample);

  return {
    onSample: function(callback) {
      sampleCallbacks.push(callback);
    }
  };
};

window.AudioAnalyzer = AudioAnalzer;
