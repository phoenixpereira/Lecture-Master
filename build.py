from pathlib import Path
import shutil
import subprocess
import sys
import os


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
    shutil.make_archive("chrome", "zip", "build/chrome/")
    ch_zip = Path("build/chrome.zip")
    if ch_zip.exists():
        ch_zip.unlink()
    shutil.move("./chrome.zip", "build/")



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
    shutil.make_archive("firefox", "zip", "build/firefox/")
    ff_zip = Path("build/firefox.zip")
    if ff_zip.exists():
        ff_zip.unlink()
    shutil.move("./firefox.zip", "build/")
    os.rename("build/firefox.zip", "build/firefox.zip")

def main(argv):
    if len(argv) == 1:
        build_chrome()
        build_firefox()

if __name__ == "__main__":
    argv = sys.argv
    main(argv)