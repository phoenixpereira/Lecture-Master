// Initialise variables
let audioContext: AudioContext | undefined;
let source: MediaElementAudioSourceNode | undefined;
let analyser: AnalyserNode | undefined;
let gainNode: GainNode | undefined;
let isPausedOrEnded: boolean = false;
let currentPlaybackRate: number = 1;
let targetPlaybackRate: number = 1;
let isTransitioning: boolean = false;

// Transition settings
let transitionDuration: number = 0.25; // Duration of the transition in seconds
let transitionInterval: number = 10; // Interval between transition steps in milliseconds

// Silence detection settings
let silenceCounter: number = 0;
let silenceThreshold: number = -5.9; // Threshold for silence in decibels
let requiredSilenceFrames: number = 3 // Number of frames required for silence

// Create the audio context and gain node
function createAudioContext() {
    audioContext = new window.AudioContext();
    gainNode = audioContext.createGain();
}

// Get the video volume and adjust playback rate
function getVideoVolume(video: HTMLMediaElement) {
    if (!audioContext) {
        createAudioContext();
    }

    if (!source || !analyser) {
        source = audioContext!.createMediaElementSource(video);
        analyser = audioContext!.createAnalyser();
        source.connect(analyser);
        analyser.connect(gainNode!);
        gainNode!.connect(audioContext!.destination);
    }

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    analyser.getByteTimeDomainData(dataArray);

    const maxAmplitude = Math.max(...dataArray);
    const volumeInDecibels = 20 * Math.log10(maxAmplitude / 255);
    const threshold = -5.9;
    console.log(targetPlaybackRate);

    if (volumeInDecibels >= silenceThreshold) {
        silenceCounter = 0;
        setTargetPlaybackRate(1);
        console.log("1x");
    } else {
        if (silenceCounter >= requiredSilenceFrames) {
            setTargetPlaybackRate(2);
            console.log("2x");
        } else {
            setTargetPlaybackRate(1);
            console.log("1x");
        }
        silenceCounter++;
    }

    if (!isPausedOrEnded) {
        setTimeout(() => {
            getVideoVolume(video);
        }, 200); // Run the function again after 200 milliseconds
    }
}

// Set the target playback rate
function setTargetPlaybackRate(rate: number) {
    targetPlaybackRate = Math.max(0.5, Math.min(2, rate)); // Limit target rate to supported range (0.5 to 2)
    if (isTransitioning) return; // Ignore if transition is already in progress
    startPlaybackTransition();
}

// Perform the playback rate transition
function startPlaybackTransition() {
    isTransitioning = true;
    const totalSteps = Math.ceil(transitionDuration * 1000 / transitionInterval);
    const playbackRateStep = (targetPlaybackRate - currentPlaybackRate) / totalSteps;
    let stepCount = 0;

    function updatePlaybackRate() {
        stepCount++;
        currentPlaybackRate += playbackRateStep;

        if (stepCount >= totalSteps) {
            currentPlaybackRate = targetPlaybackRate;
            isTransitioning = false;
            videoElement!.playbackRate = currentPlaybackRate;
            return;
        }

        videoElement!.playbackRate = currentPlaybackRate;
        setTimeout(updatePlaybackRate, transitionInterval);
    }

    updatePlaybackRate();
}

// Handle video events (play, pause, ended)
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
let videoElement: HTMLVideoElement | null = null;

// Loops through the mutations in the mutations list and finds video element
const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            videoElement = document.querySelector('video');

            if (videoElement) {
                observer.disconnect();
                videoElement.addEventListener('play', handleVideoEvents);
                videoElement.addEventListener('pause', handleVideoEvents);
                videoElement.addEventListener('ended', handleVideoEvents);
                break;
            }
        }
    }
});

// Start observing changes in the body element
observer.observe(document.body, { childList: true, subtree: true });
