import path from "path";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
    if (mode === "chrome") {
        return {
            build: {
                outDir: path.join(__dirname, "build/chrome"),
                emptyOutDir: true,
                rollupOptions: {
                    output: {
                        entryFileNames: "assets/[name].js",
                        chunkFileNames: "assets/[name].js",
                        assetFileNames: "assets/[name].[ext]"
                    }
                }
            }
        };
    }

    if (mode === "firefox") {
        return {
            build: {
                outDir: path.join(__dirname, "build/firefox"),
                emptyOutDir: true,
                rollupOptions: {
                    output: {
                        entryFileNames: "assets/[name].js",
                        chunkFileNames: "assets/[name].js",
                        assetFileNames: "assets/[name].[ext]"
                    }
                }
            }
        };
    }
    return {};
});
