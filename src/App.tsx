import React, { useEffect, useState } from "react";

export default function App() {
    // State variables to hold the current values
    const [normalPlaybackRate, setNormalPlaybackRate] = useState(1);
    const [silentPlaybackRate, setSilentPlaybackRate] = useState(1);
    const [silenceThreshold, setSilenceThreshold] = useState(-14);
    const [analyserType, setAnalyserType] = useState("tabOutputAnalyser");

    // Slider event handlers to update the current values and store in extension storage
    const handleNormalPlaybackRateChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = parseFloat(event.target.value);
        setNormalPlaybackRate(value);
        document.getElementById("normalPlaybackValue")!.textContent =
            value.toFixed(1);
        chrome.storage.local.set({ normalPlaybackRate: value });
    };

    const handleSilentPlaybackRateChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = parseFloat(event.target.value);
        setSilentPlaybackRate(value);
        document.getElementById("silentPlaybackValue")!.textContent =
            value.toFixed(1);
        chrome.storage.local.set({ silentPlaybackRate: value });
    };

    const handleSilenceThresholdChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = parseFloat(event.target.value);
        setSilenceThreshold(value);
        document.getElementById("silenceThresholdValue")!.textContent =
            value.toFixed(1);
        chrome.storage.local.set({ silenceThreshold: value });
    };

    const handleAnalyserTypeChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const value = event.target.value;
        console.log(value);
        chrome.storage.local.set({ analyserType: value });
    };

    // Audio context flag and state
    const [audioContextInitialised, setAudioContextInitialised] =
        useState(false);

    useEffect(() => {
        // Initialise the current values from extension storage on component mount
        chrome.storage.local.get(
            [
                "normalPlaybackRate",
                "silentPlaybackRate",
                "silenceThreshold",
                "analyserType"
            ],
            (data) => {
                const normalRate = data.normalPlaybackRate || 1;
                const silentRate = data.silentPlaybackRate || 1;
                const threshold = data.silenceThreshold || -14;
                const type = data.analyserType || "tabOutputAnalyser";

                // Update state and UI sliders
                setNormalPlaybackRate(normalRate);
                setSilentPlaybackRate(silentRate);
                setSilenceThreshold(threshold);
                setAnalyserType(type);

                // Cast HTMLElement to HTMLInputElement to access the 'value' property
                (
                    document.getElementById(
                        "normalPlaybackRate"
                    ) as HTMLInputElement
                ).value = normalRate.toString();
                (
                    document.getElementById(
                        "normalPlaybackValue"
                    ) as HTMLElement
                ).textContent = normalRate.toFixed(1);

                (
                    document.getElementById(
                        "silentPlaybackRate"
                    ) as HTMLInputElement
                ).value = silentRate.toString();
                (
                    document.getElementById(
                        "silentPlaybackValue"
                    ) as HTMLElement
                ).textContent = silentRate.toFixed(1);

                (
                    document.getElementById(
                        "silenceThreshold"
                    ) as HTMLInputElement
                ).value = threshold.toString();
                (
                    document.getElementById(
                        "silenceThresholdValue"
                    ) as HTMLElement
                ).textContent = threshold.toFixed(1);

                // Set the select element value to the current analyserType
                (
                    document.getElementById(
                        "analyserTypeSelect"
                    ) as HTMLSelectElement
                ).value = type;
            }
        );
    }, []);

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-800 text-white">
            <div className="container flex flex-col justify-center items-center">
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-7xl text-center mx-4 mt-2">
                    Lecture Master
                </h1>
                <h2 className="mt-1 mb-2 px-6 text-center text-base font-semibold tracking-tight sm:text-2xl">
                    Makes watching lectures more efficient!
                </h2>
            </div>

            {/* Slider wrapper with horizontal margins */}
            <div className="flex flex-col items-center mt-2 mb-6 mx-4">
                {/* HTML sliders */}
                <div className="flex flex-col items-center mt-4">
                    <label
                        htmlFor="normalPlaybackRate"
                        className="text-white"
                    >
                        Normal Playback Rate:
                    </label>
                    <input
                        type="range"
                        id="normalPlaybackRate"
                        className="w-48 mt-1 form-range appearance-none bg-gray-600 h-6 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 slider-animation slider-handle"
                        min="0.5"
                        max="2"
                        step="0.1"
                        defaultValue="1"
                        onChange={handleNormalPlaybackRateChange}
                    />
                    <div className="flex justify-between w-full text-white">
                        <span>0.5x</span>
                        <span>2x</span>
                    </div>
                    <div className="text-white">
                        Current: <span id="normalPlaybackValue">1</span>x
                    </div>
                </div>

                <div className="flex flex-col items-center mt-4">
                    <label
                        htmlFor="silentPlaybackRate"
                        className="text-white"
                    >
                        Silent Playback Rate:
                    </label>
                    <input
                        type="range"
                        id="silentPlaybackRate"
                        className="w-48 mt-1 form-range appearance-none bg-gray-600 h-6 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 slider-animation slider-handle"
                        min="0.5"
                        max="2"
                        step="0.1"
                        defaultValue="1"
                        onChange={handleSilentPlaybackRateChange}
                    />
                    <div className="flex justify-between w-full text-white">
                        <span>0.5x</span>
                        <span>2x</span>
                    </div>
                    <div className="text-white">
                        Current: <span id="silentPlaybackValue">1</span>x
                    </div>
                </div>

                <div className="flex flex-col items-center mt-4">
                    <label
                        htmlFor="silenceThreshold"
                        className="text-white"
                    >
                        Silence Threshold:
                    </label>
                    <input
                        type="range"
                        id="silenceThreshold"
                        className="w-48 mt-1 form-range appearance-none bg-gray-600 h-6 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 slider-animation slider-handle"
                        min="-24"
                        max="0"
                        step="0.1"
                        defaultValue="-14"
                        onChange={handleSilenceThresholdChange}
                    />
                    <div className="flex justify-between w-full text-white">
                        <span>-24dB</span>
                        <span>0dB</span>
                    </div>
                    <div className="text-white">
                        Current: <span id="silenceThresholdValue">-14</span>dB
                    </div>
                </div>
                {/* Dropdown wrapper */}
                <div className="flex flex-col items-center mt-4">
                    <label
                        htmlFor="analyserTypeSelect"
                        className="text-white"
                    >
                        Analyser Type:
                    </label>
                    <select
                        id="analyserTypeSelect"
                        className="w-48 mt-1 form-select appearance-none bg-gray-600 h-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        onChange={handleAnalyserTypeChange}
                    >
                        <option value="tabOutputAnalyser">
                            Tab output analyser (Default)
                        </option>
                        <option value="elementAnalyser">
                            Element Analyser
                        </option>
                    </select>
                </div>
            </div>

            <div className="absolute bottom-4 text-white">
                Developed by{" "}
                <a
                    className="underline"
                    href="https://github.com/phoenixpereira"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Phoenix Pereira
                </a>
            </div>
        </div>
    );
}
