# Lecture Master

A browser extension to make watching lectures more efficient!

<img width="317" alt="Lecture-Master" src="https://github.com/phoenixpereira/Lecture-Master/assets/47909638/6741768c-8b48-4ab9-b752-4968c06e5e86">

## Features

- **Silence Skipping:** Automatically switches between normal and silent playback rates depending on the silence threshold.
- **Customizable Settings:** You can configure normal and silent playback rates, silence threshold, and enable/disable the extension.
- **Wide Playback Range:** Offers an extended playback speed range from 0.1x to 5x.

## Installation
You can install Lecture Master by downloading it through the releases tab or by building it yourself.

**How to load the extension into Chrome:**

Open Chrome and navigate to `chrome://extensions`.
- Enable "Developer mode".
- Click "Load unpacked".
- Select the `build` folder from the cloned repository or the `Lecture-Master` folder if you downloaded it from releases.
- The extension should now be loaded and running in your browser.
  
**How to load the extension into Firefox:**

Open Firefox and navigate to `about:addons`.
- Click on the settings cog, and select `Install Add-on From File...`
- Select the `Lecture-Master-firefox-vX.X.X.xpi` file you downloaded from releases.
- When prompted to `Add Lecture Master`, click `Add`
- The extension should now be loaded and running in your browser.
  
## Known Issues
- Doesn't currently support lectures with multiple video sources.
- Doesn't currently support local videos.

## Development
To get started, clone the repository and install the dependencies:

```bash
git clone https://github.com/phoenixpereira/Lecture-Master.git
cd Lecture-Master
yarn install
```

Next, build the extension using vite:

```bash
yarn build
```

The optimised and bundled extension will be placed in the build folder.

## Contributing
If you find any issues with Lecture Master, please open an issue or create a pull request that fixes the issue. Any suggestions or feature requests may also be added to the issues.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
