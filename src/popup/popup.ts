import "./popup.css";

// Get the slider elements
const normalPlaybackRateSlider = document.getElementById('normalPlaybackRate') as HTMLInputElement;
const silentPlaybackRateSlider = document.getElementById('silentPlaybackRate') as HTMLInputElement;
const silenceThresholdSlider = document.getElementById('silenceThreshold') as HTMLInputElement;
const transitionDurationSlider = document.getElementById('transitionDuration') as HTMLInputElement;
const transitionIntervalSlider = document.getElementById('transitionInterval') as HTMLInputElement;
const requiredSilenceFramesSlider = document.getElementById('requiredSilenceFrames') as HTMLInputElement;

// Add event listeners for sliders using the reusable function
addSliderEventListener(normalPlaybackRateSlider, 'updatePlaybackRate', (value) => {
    currentPlaybackRate = value;
    setTargetPlaybackRate(currentPlaybackRate);
    console.log("change");
});

addSliderEventListener(silentPlaybackRateSlider, 'updateSilentPlaybackRate', (value) => {
    // Handle silent playback rate changes
});

addSliderEventListener(silenceThresholdSlider, 'updateSilenceThreshold', (value) => {
    // Handle silence threshold changes
});

addSliderEventListener(transitionDurationSlider, 'updateTransitionDuration', (value) => {
    // Handle transition duration changes
});

addSliderEventListener(transitionIntervalSlider, 'updateTransitionInterval', (value) => {
    // Handle transition interval changes
});

addSliderEventListener(requiredSilenceFramesSlider, 'updateRequiredSilenceFrames', (value) => {
    // Handle required silence frames changes
});

// Function to add event listener to a slider element
function addSliderEventListener(slider: HTMLInputElement, eventName: string, callback: (value: number) => void) {
    slider.addEventListener(eventName, () => {
        const value = Number(slider.value);
        if (!isNaN(value)) {
            callback(value);
        }
    });
}

