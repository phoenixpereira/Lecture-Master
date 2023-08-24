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


def update_version(fp, version, msg):
    with open(fp, "r+") as f:
        config = json.load(f)
        f.seek(0)
        config["version"] = version
        json.dump(config, f, indent=2)
        f.truncate()
    if msg != "":
        print(msg)


def build_prod(version=None):
    """Build with extra steps for production"""

    if version is None:
        try:
            version = subprocess.check_output(
                "git describe --tags --abbrev=0", shell=True, stderr=subprocess.DEVNULL
            )
            version = str(version)[3:-3]
        except subprocess.CalledProcessError as e:
            version = "1.0.0"
            print(f"Error while fetching version!\n{e}")
        print(f"Current version: {version}")

    update_version("package.json", version, "Updated package.json")
    update_version(
        "src/manifests/chrome/manifest.json", version, "Updated Chrome manifest.json"
    )
    update_version(
        "src/manifests/firefox/manifest.json", version, "Updated Firefox manifest.json"
    )

    build_chrome()
    build_firefox()

    shutil.make_archive("firefox", "zip", "build/firefox/")
    shutil.make_archive("chrome", "zip", "build/chrome/")
    ff_zip = Path("build/firefox.zip")
    if ff_zip.exists():
        ff_zip.unlink()
    ch_zip = Path("build/chrome.zip")
    if ch_zip.exists():
        ch_zip.unlink()
    shutil.move("./firefox.zip", "build/")
    shutil.move("./chrome.zip", "build/")


def build_test():
    """Build test for CI"""

    build_chrome()
    build_firefox()

    shutil.make_archive("firefox", "zip", "build/firefox/")
    shutil.make_archive("chrome", "zip", "build/chrome/")
    ff_zip = Path("build/firefox.zip")
    if ff_zip.exists():
        ff_zip.unlink()
    ch_zip = Path("build/chrome.zip")
    if ch_zip.exists():
        ch_zip.unlink()
    shutil.move("./firefox.zip", "build/")
    shutil.move("./chrome.zip", "build/")


def main(argv):
    if len(argv) == 1:
        build_chrome()
        build_firefox()
    elif len(argv) >= 2:
        if argv[1] == "prod" and len(argv) == 3:
            build_prod(argv[2])
        elif argv[1] == "prod":
            build_prod()
        elif argv[1] == "test":
            build_test()
        elif argv[1] == "chrome":
            build_chrome()
        elif argv[1] == "firefox":
            build_firefox()
        else:
            print("Not a valid option")
    else:
        print("Not a valid option")


if __name__ == "__main__":
    argv = sys.argv
    main(argv)