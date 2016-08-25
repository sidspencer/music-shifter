 /* Copy at will, I wave any right or contrarianism. 
 * - Sid Spencer 
 * 20151025
 */

var _bufferSource = null;
var _file = null;
var _recorder = null;
var _isPlaying = false;

/**
 * Handler to disable clicking on the Export link
 */
function disableClick(e) {
    e.preventDefault();
}


/**
 * Upon hit of the Play button, set up the web audio stuff and the recorder. Read the data, start it up.
 * Also disable/enable proper buttons.
 */
function generateAndPlay() {
    if (_isPlaying) {
        alert("You must stop the current track first.");
        return;
    }

    $("#stop").prop("disabled", false);
    $("#play").prop("disabled", true);
    
    // Connect the buffer source for playing, and the stream destination for saving.
    _bufferSource = audioContext.createBufferSource();
    _bufferSource.connect(audioContext.destination);

    var output = audioContext.createMediaStreamDestination();
    var outputChunks = [];

     _recorder = new Recorder(_bufferSource, { "workerPath": "lib/Recorderjs-master/recorderWorker.js" });

    // Read the uploaded audio file, play it when loaded.
    var reader = new FileReader();

    reader.onload = function(ev) {
        audioContext.decodeAudioData(ev.target.result, function(buffer) {
            _bufferSource.buffer = buffer;

            // This is the nightcoring.
            _bufferSource.playbackRate.value = $("#playbackRate").val();
                
            // Automatically stop at the end of the track.
            _bufferSource.onended = function stopPlayingAndRecording(evt) {
                stopPlaying();
            };

            // Attach EQ filters
            attachEqFilters();

            // Finally start playing/recording.
            _bufferSource.start(0);
            _recorder.record();
            
            _isPlaying = true;
        });
    };
    
    reader.readAsArrayBuffer(_file);
}


/**
 * 
 */
function attachEqFilters() {

    var low = audioContext.createBiquadFilter();
	low.type = "peaking";
	low.frequency.value = 320.0;
    low.Q.value = 0.5
	low.gain.value = $("#bassLevel").val();
	low.connect(audioContext.destination);

	var mid = audioContext.createBiquadFilter();
	mid.type = "peaking";
	mid.frequency.value = 1000.0;
	mid.Q.value = 0.5;
	mid.gain.value = $("#midLevel").val();
	mid.connect(low);

	var high = audioContext.createBiquadFilter();
	high.type = "peaking";
	high.frequency.value = 3200.0;
    high.Q.value = 0.5;
	high.gain.value = $("#trebleLevel").val();
	high.connect(mid);

    _bufferSource.connect(high);    
}

/**
 * Store the uploaded audio file data 
 */ 
function storeAudioFile(evt) {
    var files = evt.target.files
    
    if (files[0]) {
        _file = files[0];
        $("#play").prop("disabled", false);
    }
}


/**
 * Stop playing and recording the track. 
 * Also disable/enable proper buttons, and build the blob url for exporting.
 */
function stopPlaying() {
    $("#stop").prop("disabled", true);
    $("#play").prop("disabled", false);

    _recorder.stop();
    _bufferSource.stop();
    _isPlaying = false;

    _recorder.exportWAV(
        function setDownloadUrl(blob) {
            $("#export").attr("href", URL.createObjectURL(blob));
            $("#export").off("click", disableClick);
        },
        "audio/mp3"
    );
}

