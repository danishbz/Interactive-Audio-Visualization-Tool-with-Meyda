# Interactive Audio Visualization Tool

## Overview

This project is a creative coding endeavor aimed at exploring audio manipulation and visualization using JavaScript. The primary library used is **p5.js**, supplemented by the **Meyda** audio feature extraction library. Users can control audio playback and visualize sound characteristics in real-time through an interactive canvas, making it a fun and engaging way to delve into creative coding.

## Features

- **Play/Pause Button**: Toggle audio playback seamlessly.
- **Sliders**: Adjust volume, playback rate, and stereo panning.
- **Spectrum Visualizer**: Displays audio characteristics such as RMS, spectral centroid, and more.
- **Speech Recognition**: Dynamically change the background color based on voice commands.
- **Jump Button**: Hop to a random point in the track for varied playback experience.

## Setup

1. **Load the Sound**: The project uses an MP3 file, `sounds/Kalte_Ohren_(_Remix_).mp3`.
2. **Canvas Initialization**: Define a 420x500 canvas for visual outputs.
3. **Component Initialization**: Set up buttons, sliders, FFT, and speech recognition.

## Usage

- **Playback Controls**: Use the Play/Pause button and adjust with sliders for a customized audio experience.
- **Interactive Visualization**: Watch the audio features transform in real-time on the canvas.
- **Voice Commands**: Speak color names like 'red', 'green', or 'blue' to change the canvas background.

## Installation

Clone the repository and ensure all dependencies such as p5.js are included in your project environment. Run the provided HTML/JavaScript files in a browser to start the tool.

## Libraries and Frameworks

- **p5.js**: Handles canvas creation, audio playback, and interaction.
- **Meyda**: Extracts and analyzes various audio features.

## How Speech Recognition Enhances Experience

By allowing background color changes through voice commands, the project introduces a hands-free method of interaction, adding an extra layer of engagement and accessibility.

## Audio Features Visualized

- **Amplitude Spectrum**
- **Loudness**
- **Spectral Centroid**
- **Spectral Rolloff**
- **Spectral Flatness**
- **Spectral Spread**
- **Spectral Crest**

## Future Enhancements

- Expand the range of voice commands for more interactive control options.
- Introduce additional visualization styles for a richer user experience.

## Contributing

We welcome contributions! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.

---
