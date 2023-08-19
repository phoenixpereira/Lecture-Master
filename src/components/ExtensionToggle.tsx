import React from "react";

interface ExtensionToggleProps {
    extensionEnabled: boolean;
}

const ExtensionToggle: React.FC<ExtensionToggleProps> = ({
    extensionEnabled
}) => {
    return (
        <>
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
        </>
    );
};

export default ExtensionToggle;
