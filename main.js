const mic_btn = document.querySelector("#mic");
const playback = document.querySelector(".playback");

mic_btn.addEventListener("click", ToggleMic);

let can_record = false;
let is_recording = false;
let recorder = null;

let chunks = [];

function SetupAudio() {
  console.log("Setup");
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then(SetupStream)
      .catch((err) => {
        console.error("Error accessing audio stream:", err);
      });
  } else {
    console.error("getUserMedia not supported on your browser!");
  }
}

function SetupStream(stream) {
  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (e) => {
    chunks.push(e.data);
  };

  recorder.onstop = (e) => {
    const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
    chunks = [];
    const audioURL = window.URL.createObjectURL(blob);
    playback.src = audioURL;
  };

  can_record = true;
}

function ToggleMic() {
  if (!can_record) return;

  is_recording = !is_recording;
  if (is_recording) {
    recorder.start();
    mic_btn.classList.add("is_recording");
  } else {
    recorder.stop(); // Stop the recording
    mic_btn.classList.remove("is_recording");
  }
}

// Initialize the audio setup
SetupAudio();
