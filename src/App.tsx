import React, { useEffect, useState } from "react";
import { FaPlay, FaFastForward, FaVolumeMute } from "react-icons/fa";

export default function App() {
    // State variables to hold the current values
    const [normalPlaybackRate, setNormalPlaybackRate] = useState(1);
    const [silentPlaybackRate, setSilentPlaybackRate] = useState(1);
    const [silenceThreshold, setSilenceThreshold] = useState(-14);
    const [extensionEnabled, setExtensionEnabled] = useState(false);
    const [videoVolume, setVideoVolume] = useState(0);
    const isAudioSkipping = videoVolume < silenceThreshold;

    const calculateSliderPercentage = (
        value: number,
        min: number,
        max: number
    ): number => ((value - min) / (max - min)) * 100;

    // Calculate volume meter fill based on video's volume
    const volumeMeterFill = {
        backgroundImage: `linear-gradient(to right, ${
            isAudioSkipping ? "#B3FFB3" : "#f06543"
        } 0%, ${
            isAudioSkipping ? "#B3FFB3" : "#f06543"
        } ${calculateSliderPercentage(
            videoVolume,
            -24,
            0
        )}%, #313638 ${calculateSliderPercentage(
            videoVolume,
            -24,
            0
        )}%, #313638 100%)`
    };

    const generateSliderBackgroundStyle = (
        value: number,
        minValue: number,
        maxValue: number
    ): React.CSSProperties => {
        const percentage = calculateSliderPercentage(value, minValue, maxValue);
        return {
            backgroundImage: `linear-gradient(to right, ${"#f09d51"} 0%, ${"#f09d51"} ${percentage}%, #313638 ${percentage}%, #313638 100%)`
        };
    };

    // Handle extension toggle via keyboard
    const handleExtensionToggle = () => {
        const newExtensionState = !extensionEnabled;
        setExtensionEnabled(newExtensionState);
        chrome.storage.local.set({ extensionEnabled: newExtensionState });
    };

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        setStateFunction: React.Dispatch<React.SetStateAction<number>>,
        storageKey: string
    ) => {
        const value = parseFloat(event.target.value);
        setStateFunction(value); // Update the state variable
        chrome.storage.local.set({ [storageKey]: value }); // Update the storage
    };

    useEffect(() => {
        const updateExtensionState = (data: any) => {
            setNormalPlaybackRate(data.normalPlaybackRate || 1);
            setSilentPlaybackRate(data.silentPlaybackRate || 1);
            setSilenceThreshold(data.silenceThreshold || -14);
            setExtensionEnabled(data.extensionEnabled || false);
        };

        chrome.runtime.onMessage.addListener((message) => {
            if (message.action === "updateVolumeMeter") {
                setVideoVolume(message.volume.toFixed(2));
            }
        });

        chrome.storage.local.get(
            [
                "normalPlaybackRate",
                "silentPlaybackRate",
                "silenceThreshold",
                "extensionEnabled"
            ],
            (data) => updateExtensionState(data)
        );
    }, []);

    return (
        <div className="flex flex-col justify-center min-h-screen bg-gray-800 text-white">
            {/* Header */}
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
            {/* Extension Toggle */}
            <div className="container flex flex-row justify-center items-center mt-5 ml-8">
                <h3 className="text-base">Enable Lecture Master</h3>
                <button
                    id="extensionToggle"
                    className={`cursor-pointer relative w-10 h-5 rounded-full ml-2 mr-16 ${
                        extensionEnabled
                            ? "bg-gray-100 transition-all duration-300"
                            : "bg-bright-orange transition-all duration-300"
                    }`}
                    style={{ marginLeft: "auto" }}
                    onClick={handleExtensionToggle}
                >
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
                </button>
            </div>
            <div
                className={`flex flex-col mt-2 mx-8 ${
                    extensionEnabled
                        ? "opacity-50 pointer-events-none duration-300"
                        : "duration-300"
                }`}
            >
                <hr className="w-full h-0.5 my-4 bg-white opacity-25 rounded" />
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
                            <span>{silenceThreshold.toFixed(1)}</span>dB
                        </div>
                    </div>
                    <div
                        id="volumeMeter"
                        className="w-[16.65rem] h-8 bg-gray-600 rounded-full absolute -translate-x-[0.325rem] translate-y-[1.35rem]"
                        style={volumeMeterFill}
                    ></div>
                    <input
                        type="range"
                        id="silenceThreshold"
                        className="w-64 mt-2 mb-1 form-range appearance-none bg-gray-600 h-6 rounded-full slider-no-handle z-10"
                        style={generateSliderBackgroundStyle(
                            silenceThreshold,
                            -24,
                            0
                        )}
                        min="-24"
                        max="0"
                        step="0.1"
                        defaultValue="-14"
                        onChange={(event) =>
                            handleInputChange(
                                event,
                                setSilenceThreshold,
                                "silenceThreshold"
                            )
                        }
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
                            <span>{normalPlaybackRate.toFixed(1)}</span>x
                        </div>
                    </div>
                    <input
                        type="range"
                        id="normalPlaybackRate"
                        className="w-64 mt-1 form-range appearance-none bg-gray-600 h-6 rounded-full slider-no-handle"
                        style={generateSliderBackgroundStyle(
                            normalPlaybackRate,
                            0.1,
                            5
                        )}
                        min="0.1"
                        max="5"
                        step="0.1"
                        defaultValue="1"
                        onChange={(event) =>
                            handleInputChange(
                                event,
                                setNormalPlaybackRate,
                                "normalPlaybackRate"
                            )
                        }
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
                            <span>{silentPlaybackRate.toFixed(1)}</span>x
                        </div>
                    </div>
                    <input
                        type="range"
                        id="silentPlaybackRate"
                        className="w-64 mt-1 form-range appearance-none bg-gray-600 h-6 rounded-full slider-no-handle"
                        style={generateSliderBackgroundStyle(
                            silentPlaybackRate,
                            0.1,
                            5
                        )}
                        min="0.1"
                        max="5"
                        step="0.1"
                        defaultValue="1"
                        onChange={(event) =>
                            handleInputChange(
                                event,
                                setSilentPlaybackRate,
                                "silentPlaybackRate"
                            )
                        }
                    />
                    <div className="flex justify-between w-full text-white">
                        <span>0.1x</span>
                        <span>5x</span>
                    </div>
                </div>
            </div>
            {/* Footer */}
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
