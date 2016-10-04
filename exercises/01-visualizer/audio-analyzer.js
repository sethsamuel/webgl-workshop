const AudioAnalzer = function(audioElement, sampleType) {
  var sampleCallbacks = [];

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContext();
  let source;
  if (audioElement.src) {
    source = audioContext.createMediaElementSource(audioElement);
  } else {
    source = audioContext.createOscillator();
    source.type = audioElement.type || 'sine';
    source.frequency.value = audioElement.frequency || 200;
    source.start();
  }

  const analyzer = audioContext.createAnalyser();
  source.connect(analyzer);
  analyzer.connect(audioContext.destination);

  analyzer.fftSize = 2048;
  // analyzer.smoothingTimeConstant = 0.85;
  const bufferLength = analyzer.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);


  function sample() {
    if (sampleType === 'time') {
      analyzer.getByteTimeDomainData(dataArray);
    } else {
      analyzer.getByteFrequencyData(dataArray);
    }

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
