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
let requiredSilenceFrames: number = 3; // Number of frames required for silence

// Audio context flag and state
let audioContextInitialised = false;
let normalPlaybackRate = 1;
let silentPlaybackRate = 1;

// Create the audio context and gain node
function createAudioContext() {
    audioContext = new window.AudioContext();
    gainNode = audioContext.createGain();
}

// Get the video volume and adjust playback rate
function getVideoVolume(video: HTMLMediaElement) {
    chrome.storage.local.get(
        ["normalPlaybackRate", "silentPlaybackRate", "silenceThreshold"],
        (data) => {
            normalPlaybackRate = data.normalPlaybackRate || 1;
            silentPlaybackRate = data.silentPlaybackRate || 1;
            silenceThreshold = data.silenceThreshold || -5.9;
            targetPlaybackRate = normalPlaybackRate;
        }
    );

    if (!audioContextInitialised) {
        createAudioContext();
        audioContextInitialised = true;
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

    const maxAmplitude = Math.max(...Array.from(dataArray));
    const volumeInDecibels = 20 * Math.log10(maxAmplitude / 255);
    const threshold = -5.9;
    console.log(
        "Actual Volume: ",
        volumeInDecibels,
        "Threshold: ",
        silenceThreshold
    );

    if (volumeInDecibels >= silenceThreshold) {
        silenceCounter = 0;
        setTargetPlaybackRate(normalPlaybackRate);
    } else {
        if (silenceCounter >= requiredSilenceFrames) {
            setTargetPlaybackRate(silentPlaybackRate);
        } else {
            setTargetPlaybackRate(normalPlaybackRate);
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
    targetPlaybackRate = Math.max(0.5, Math.min(2, rate));
    if (isTransitioning) return;
    startPlaybackTransition();
}

// Perform the playback rate transition
function startPlaybackTransition() {
    isTransitioning = true;
    const totalSteps = Math.ceil(
        (transitionDuration * 1000) / transitionInterval
    );
    const playbackRateStep =
        (targetPlaybackRate - currentPlaybackRate) / totalSteps;
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
        isPausedOrEnded = true;
    } else {
        if (!audioContextInitialised) {
            createAudioContext();
            audioContextInitialised = true;
        }
        isPausedOrEnded = false;
        getVideoVolume(video);
    }
}

// Find the first video element on the page
let videoElement: HTMLVideoElement | null = null;

// Loops through the mutations in the mutations list and finds video element
const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
            videoElement = document.querySelector("video");

            if (videoElement) {
                observer.disconnect();
                videoElement.addEventListener("play", handleVideoEvents);
                videoElement.addEventListener("pause", handleVideoEvents);
                videoElement.addEventListener("ended", handleVideoEvents);
                break;
            }
        }
    }
});

// Start observing changes in the body element
observer.observe(document.body, { childList: true, subtree: true });
