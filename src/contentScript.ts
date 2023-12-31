/// <reference types="@types/chrome" />

// Initialise variables
let audioContext: AudioContext | undefined;
let source: MediaElementAudioSourceNode | undefined;
let analyser: AnalyserNode | undefined;
let gainNode: GainNode | undefined;
let isPausedOrEnded: boolean = false;
let currentPlaybackRate: number = 1;
let targetPlaybackRate: number = 1;
let isTransitioning: boolean = false;
let isExtensionEnabled = false;
let getVideoVolumeCount = 0;

// Transition settings
let transitionDuration: number = 0.25; // Duration of the transition in seconds
let transitionInterval: number = 10; // Interval between transition steps in milliseconds

// Silence detection settings
let silenceCounter: number = 0;
let silenceThreshold: number = -14; // Threshold for silence in decibels
let requiredSilenceFrames: number = 3;

// Audio context flag and state
let audioContextInitialised = false;
let normalPlaybackRate = 1;
let silentPlaybackRate = 1;
let volumeInDecibels = 0;

// Video elements
let videoElement: HTMLVideoElement | null = null;
let videoElements: NodeListOf<HTMLVideoElement>;

// Create the audio context and gain node
function createAudioContext() {
    audioContext = new window.AudioContext();
    gainNode = audioContext.createGain();
}

// Get the video volume and adjust playback rate
function getVideoVolume(video: HTMLMediaElement) {
    chrome.storage.local.get(
        [
            "normalPlaybackRate",
            "silentPlaybackRate",
            "silenceThreshold",
            "extensionEnabled"
        ],
        (data) => {
            normalPlaybackRate = data.normalPlaybackRate || 1;
            silentPlaybackRate = data.silentPlaybackRate || 1;
            silenceThreshold = data.silenceThreshold || -5.9;
            targetPlaybackRate = normalPlaybackRate;
            isExtensionEnabled = data.extensionEnabled;
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

    analyser.getByteFrequencyData(dataArray);

    // Calculate the average amplitude value
    let sumAmplitude = dataArray.reduce((acc, value) => acc + value, 0);
    const averageAmplitude = sumAmplitude / dataArray.length;

    // Normalise the amplitude to a value between 0 and 1
    const normalisedAmplitude = averageAmplitude / 255;

    // Calculate the volume in decibels using the normalised amplitude
    const volumeInDecibelsMeter = 10 * Math.log10(normalisedAmplitude);
    if (getVideoVolumeCount == 4) {
        volumeInDecibels = volumeInDecibelsMeter;
        getVideoVolumeCount = 0;
    } else {
        getVideoVolumeCount++;
    }

    if (volumeInDecibels >= silenceThreshold) {
        silenceCounter = 0;
        videoElement!.playbackRate = normalPlaybackRate;
    } else {
        if (silenceCounter >= requiredSilenceFrames) {
            videoElement!.playbackRate = silentPlaybackRate;
        } else {
            videoElement!.playbackRate = normalPlaybackRate;
        }
        silenceCounter++;
    }

    if (!isPausedOrEnded && !isExtensionEnabled) {
        chrome.runtime.sendMessage({ action: "setIconActive" });
        chrome.runtime.sendMessage({
            action: "updateVolumeMeter",
            volume: volumeInDecibelsMeter
        });
        setTimeout(() => {
            getVideoVolume(video);
        }, 50); // Run the function again after 50 milliseconds
    } else {
        chrome.runtime.sendMessage({ action: "setIconInactive" });
    }
}

// Handle video events (play, pause, ended)
function handleVideoEvents(event: Event) {
    chrome.storage.local.get(["extensionEnabled"], (data) => {
        isExtensionEnabled = data.extensionEnabled;
    });
    if (!isExtensionEnabled) {
        const video = event.target as HTMLMediaElement;
        // Check if the extension is enabled
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
}

// Loops through the mutations in the mutations list and finds video elements
const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
            videoElements = document.querySelectorAll("video");

            if (videoElements.length > 0) {
                const videoArray = Array.from(videoElements);

                // Get video element with audio track
                const lastVideoElement = videoArray[videoArray.length - 1];
                videoElement = lastVideoElement;
                console.log(videoElement);

                // Add event listeners
                videoElement.addEventListener("play", handleVideoEvents);
                videoElement.addEventListener("pause", handleVideoEvents);
                videoElement.addEventListener("ended", handleVideoEvents);

                observer.disconnect();
                break;
            }
        }
    }
});

// Start observing changes in the body element
observer.observe(document.body, { childList: true, subtree: true });
