import json
from pathlib import Path
import shutil
import subprocess
import sys


def build_chrome():
    subprocess.run("yarn build-chrome", shell=True)
    subprocess.run(
        "npx tsc ./src/background.ts --outDir ./build/chrome/assets",
        shell=True,
    )
    subprocess.run(
        "npx tsc ./src/contentScript.ts --outDir ./build/chrome/assets",
        shell=True,
    )
    shutil.copyfile(
        "src/manifests/chrome/manifest.json", "build/chrome/manifest.json"
    )



def build_firefox():
    subprocess.run("yarn build-firefox", shell=True)
    subprocess.run(
        "npx tsc ./src/background.ts --outDir ./build/firefox/assets",
        shell=True,
    )
    subprocess.run(
        "npx tsc ./src/contentScript.ts --outDir ./build/firefox/assets",
        shell=True,
    )
    shutil.copyfile(
        "src/manifests/firefox/manifest.json", "build/firefox/manifest.json"
    )

def main(argv):
    if len(argv) == 1:
        build_chrome()
        build_firefox()
if __name__ == "__main__":
    argv = sys.argv
    main(argv)