let audioContext: AudioContext | undefined;
let source: MediaElementAudioSourceNode | undefined;
let analyser: AnalyserNode | undefined;
let isPausedOrEnded: boolean = false;

function createAudioContext() {
    console.log("createAudioContext called");
    audioContext = new (window.AudioContext)();
}

function getVideoVolume(video: HTMLMediaElement) {
    if (!audioContext) {
        createAudioContext();
    }

    if (!source || !analyser) {
        source = audioContext!.createMediaElementSource(video);
        analyser = audioContext!.createAnalyser();
        source.connect(analyser);
        analyser.connect(audioContext!.destination);
    }

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    analyser.getByteTimeDomainData(dataArray);

    const maxAmplitude = Math.max(...dataArray);
    const volumeInDecibels = 20 * Math.log10(maxAmplitude / 255);
    if (volumeInDecibels.toFixed(2) === "-5.99") {
        console.log("Video is silent");
    }
    else {
        console.log('Video Volume (dB):', volumeInDecibels.toFixed(2));
    }


    if (!isPausedOrEnded) {
        setTimeout(() => {
            getVideoVolume(video);
        }, 250); // Run the function again after 1 second
    }
}

function handleVideoEvents(event: Event) {
    const video = event.target as HTMLMediaElement;

    if (video.paused || video.ended) {
        if (audioContext) {
            audioContext.suspend();
        }
        isPausedOrEnded = true;
    } else {
        if (!audioContext) {
            createAudioContext();
        } else {
            audioContext.resume();
            isPausedOrEnded = false;
            getVideoVolume(video);
        }
    }
}

// Find the first video element on the page
const videoElement = document.querySelector('video');

if (videoElement) {
    // Attach event listeners to the video element
    videoElement.addEventListener('play', handleVideoEvents);
    videoElement.addEventListener('pause', handleVideoEvents);
    videoElement.addEventListener('ended', handleVideoEvents);
}
