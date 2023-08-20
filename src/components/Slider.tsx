import React from "react";

interface SliderProps {
    value: number;
    minValue: number;
    maxValue: number;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    backgroundStyle: React.CSSProperties;
    label: string;
    unit?: string;
    icon: React.ReactElement;
}

const Slider: React.FC<SliderProps> = ({
    value,
    minValue,
    maxValue,
    onChange,
    backgroundStyle,
    label,
    unit = "",
    icon
}) => (
    <div className="flex flex-col">
        <div className="flex flex-row justify-between items-center">
            <label className="flex items-center text-white">
                {icon}
                {label}
            </label>
            <div className="text-dim-orange">
                <span>{value.toFixed(1)}</span>
                {unit}
            </div>
        </div>
        <input
            type="range"
            className="w-64 mt-2 mb-1 form-range appearance-none bg-gray-600 h-6 rounded-full slider-no-handle z-10"
            style={backgroundStyle}
            min={minValue}
            max={maxValue}
            step="0.1"
            value={value}
            onChange={onChange}
        />
        <div className="flex justify-between w-full text-white">
            <span>
                {minValue}
                {unit}
            </span>
            <span>
                {maxValue}
                {unit}
            </span>
        </div>
    </div>
);

export default Slider;
