# Lecture Master

Makes watching lectures more efficient!

## Features

## Quick Start
To get started, clone the repository and install the dependencies:

```bash
git clone https://github.com/phoenixpereira/Lecture-Master.git
cd Lecture-Master
yarn
yarn install
```

Next, build the extension using vite:

```bash
yarn build
```

Finally, load the extension into Chrome:

Open Chrome and navigate to `chrome://extensions/`.
- Enable "Developer mode".
- Click "Load unpacked".
- Select the `build` folder from the cloned repository.
- The extension should now be loaded and running in your browser.

## Development
To start a development server with hot reloading, run the following command:

```bash
yarn dev
```

This will automatically compile the extension whenever changes are made to the code.

## Deployment
To build the extension for production, run the following command:

```bash
yarn build
```

The optimised and bundled extension will be placed in the dist folder, ready for deployment.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.