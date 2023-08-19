import React, { useEffect, useState } from "react";
import { FaPlay, FaFastForward, FaVolumeMute } from "react-icons/fa";

export default function App() {
    // State variables to hold the current values
    const [normalPlaybackRate, setNormalPlaybackRate] = useState(1);
    const [silentPlaybackRate, setSilentPlaybackRate] = useState(1);
    const [silenceThreshold, setSilenceThreshold] = useState(-14);
    const [extensionEnabled, setExtensionEnabled] = useState(false);

    // Volume meter related state
    const [videoVolume, setVideoVolume] = useState(0);

    function calculateSliderPercentage(
        value: number,
        min: number,
        max: number
    ): number {
        return ((value - min) / (max - min)) * 100;
    }

    // Calculate the volume meter fill percentage based on the video's volume
    const volumeMeterFill = {
        backgroundImage: `linear-gradient(to right, #B3FFB3 0%, #B3FFB3 ${calculateSliderPercentage(
            videoVolume,
            -24,
            0
        )}%, #313638 ${calculateSliderPercentage(
            videoVolume,
            -24,
            0
        )}%, #313638 100%)`
    };

    const handleExtensionToggle = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const newExtensionState = !extensionEnabled;
        setExtensionEnabled(newExtensionState);
        chrome.storage.local.set({ extensionEnabled: newExtensionState });
    };

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

    useEffect(() => {
        chrome.runtime.onMessage.addListener(
            (message, sender, sendResponse) => {
                if (message.action === "updateVolumeMeter") {
                    setVideoVolume(message.volume.toFixed(2));
                }
            }
        );
        // Initialise the current values from extension storage on component mount
        chrome.storage.local.get(
            [
                "normalPlaybackRate",
                "silentPlaybackRate",
                "silenceThreshold",
                "extensionEnabled"
            ],
            (data) => {
                const normalRate = data.normalPlaybackRate || 1;
                const silentRate = data.silentPlaybackRate || 1;
                const threshold = data.silenceThreshold || -14;
                const enabled = data.extensionEnabled || false;

                // Update state and UI sliders
                setNormalPlaybackRate(normalRate);
                setSilentPlaybackRate(silentRate);
                setSilenceThreshold(threshold);
                setExtensionEnabled(enabled);

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
            }
        );
    }, []);

    return (
        <div className="flex flex-col justify-center min-h-screen bg-gray-800 text-white">
            <div className="container flex flex-row justify-center items-center self-center">
                <img
                    src="icons/active.png"
                    alt="Active Image"
                    className={`w-8 h-8 mr-2 transition-opacity absolute ${
                        extensionEnabled ? "opacity-0" : "opacity-100"
                    }`}
                    style={{
                        left: 65,
                        zIndex: extensionEnabled ? 1 : 2,
                        transition: "opacity 300ms ease-in-out"
                    }}
                />
                <img
                    src="icons/inactive.png"
                    alt="Inactive Image"
                    className={`w-8 h-8 mr-2 transition-opacity absolute ${
                        extensionEnabled ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                        left: 65,
                        zIndex: extensionEnabled ? 2 : 1,
                        transition: "opacity 300ms ease-in-out"
                    }}
                />

                <h1 className="text-lg font-bold tracking-tight sm:text-7xl text-center ml-6">
                    Lecture Master
                </h1>
            </div>
            <div className="container flex flex-row justify-center items-center mt-5 ml-8">
                <h3 className="text-base">Enable Lecture Master</h3>
                <label
                    htmlFor="extensionToggle"
                    className={`cursor-pointer relative w-10 h-5 rounded-full ml-2 mr-16 ${
                        extensionEnabled
                            ? "bg-gray-100 transition-all duration-300"
                            : "bg-bright-orange transition-all duration-300"
                    }`}
                    style={{ marginLeft: "auto" }}
                >
                    <input
                        type="checkbox"
                        id="extensionToggle"
                        className="sr-only peer"
                        checked={extensionEnabled}
                        onChange={handleExtensionToggle}
                    />
                    <span
                        className={`w-2/5 h-4/5 absolute rounded-full top-0.5 ${
                            extensionEnabled
                                ? "bg-gray-400 transition-all duration-300"
                                : "bg-white transition-all duration-300"
                        }`}
                        style={{
                            left: extensionEnabled ? "0.3rem" : "50%"
                        }}
                    />
                </label>
            </div>
            <div
                className={`flex flex-col mt-2 mx-8 ${
                    extensionEnabled
                        ? "opacity-50 pointer-events-none duration-300"
                        : "duration-300"
                }`}
            >
                {/* Silence Threshold */}
                <div className="flex flex-col">
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex items-center">
                            <FaVolumeMute className="mr-3 mt-1" />
                            <label
                                htmlFor="silenceThreshold"
                                className="text-white"
                            >
                                Silence Threshold
                            </label>
                        </div>
                        <div className="text-dim-orange">
                            <span id="silenceThresholdValue">-14</span>dB
                        </div>
                    </div>
                    <div
                        id="volumeMeter"
                        className="w-[16.65rem] h-8 bg-gray-600 rounded-full absolute -translate-x-[0.325rem] translate-y-[1.125rem] "
                        style={volumeMeterFill}
                    ></div>
                    <input
                        type="range"
                        id="silenceThreshold"
                        className="w-64 mt-1 form-range appearance-none bg-gray-600 h-6 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 slider-no-handle z-10"
                        style={{
                            backgroundImage: `linear-gradient(to right, #f09d51 0%, #f09d51 ${calculateSliderPercentage(
                                silenceThreshold,
                                -24,
                                0
                            )}%, #313638 ${calculateSliderPercentage(
                                silenceThreshold,
                                -24,
                                0
                            )}%, #313638 100%)`
                        }}
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
                </div>
                <hr className="w-full h-0.5 my-4 bg-white opacity-25 rounded" />
                {/* Normal Speed */}
                <div className="flex flex-col">
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex items-center">
                            <FaPlay className="mr-3 mt-1" />
                            <label
                                htmlFor="normalPlaybackRate"
                                className="text-white"
                            >
                                Normal Speed
                            </label>
                        </div>
                        <div className="text-dim-orange">
                            <span id="normalPlaybackValue">1</span>x
                        </div>
                    </div>
                    <input
                        type="range"
                        id="normalPlaybackRate"
                        className="w-64 mt-1 form-range appearance-none bg-gray-600 h-6 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 slider-no-handle"
                        style={{
                            backgroundImage: `linear-gradient(to right, #f09d51 0%, #f09d51 ${calculateSliderPercentage(
                                normalPlaybackRate,
                                0.1,
                                5
                            )}%, #313638 ${calculateSliderPercentage(
                                normalPlaybackRate,
                                0.1,
                                5
                            )}%, #313638 100%)`
                        }}
                        min="0.1"
                        max="5"
                        step="0.1"
                        defaultValue="1"
                        onChange={handleNormalPlaybackRateChange}
                    />
                    <div className="flex justify-between w-full text-white">
                        <span>0.1x</span>
                        <span>5x</span>
                    </div>
                </div>

                <hr className="w-full h-0.5 my-4 bg-white opacity-25 rounded" />

                {/* Silent Speed */}
                <div className="flex flex-col">
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex items-center">
                            <FaFastForward className="mr-3 mt-1" />
                            <label
                                htmlFor="silentPlaybackRate"
                                className="text-white"
                            >
                                Silent Speed
                            </label>
                        </div>
                        <div className="text-dim-orange">
                            <span id="silentPlaybackValue">1</span>x
                        </div>
                    </div>
                    <input
                        type="range"
                        id="silentPlaybackRate"
                        className="w-64 mt-1 form-range appearance-none bg-gray-600 h-6 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 slider-no-handle"
                        style={{
                            backgroundImage: `linear-gradient(to right, #f09d51 0%, #f09d51 ${calculateSliderPercentage(
                                silentPlaybackRate,
                                0.1,
                                5
                            )}%, #313638 ${calculateSliderPercentage(
                                silentPlaybackRate,
                                0.1,
                                5
                            )}%, #313638 100%)`
                        }}
                        min="0.1"
                        max="5"
                        step="0.1"
                        defaultValue="1"
                        onChange={handleSilentPlaybackRateChange}
                    />
                    <div className="flex justify-between w-full text-white">
                        <span>0.1x</span>
                        <span>5x</span>
                    </div>
                </div>
            </div>

            <div className="text-white mt-5 self-center">
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
