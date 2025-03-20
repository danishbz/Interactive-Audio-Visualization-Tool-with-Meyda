// START of code personally written without assistance

var mySound; // Variable to load and store the sound file
var playStopButton; // Button to control play/pause functionality
var jumpButton; // Button to jump to a random part of the track
var sliderVolume; // Slider to control the audio volume
var sliderRate; // Slider to adjust the playback rate of the audio
var sliderPan; // Slider to manage stereo panning of the audio

var fft; // Fast Fourier Transform object for audio analysis

var analyzer; // MeydaAnalyzer object for extracting audio features

// Variables to store features for visual representation
var rms_Length = 0;  
var spectralCentroid_Size = 0;  
var spectralRolloff_Color = 0;  
var zcr_Color = 0;  
var spectralFlatness_Width = 0;  
var spectralSpread_Alpha = 0;

var myRec; // Object for speech recognition
var set_bgcolor; // Dictionary to hold available background colors
var bgcolor = 0; // Current background color

function preload() {
  // Load the audio file in mp3 format
  soundFormats('mp3');
  mySound = loadSound('sounds/Kalte_Ohren_(_Remix_).mp3');
}

function setup() {
  // Setup function to initialize the canvas and various components
  createCanvas(420, 500);
  textFont('Merriweather'); // Set the text font
  bgcolor = 'white'; // Default background color
  textSize(11); // Set text size

  setupButtons(); // Initialize control buttons
  setupSliders(); // Initialize control sliders
  initializeFFT(); // Initialize FFT for audio analysis
  initializeMeydaAnalyzer(); // Initialize audio feature extraction
  initializeSpeechRecognition(); // Setup speech recognition functionality
}

function setupButtons() {  
  // Create a button to toggle play/pause state of the sound
  playStopButton = createButton('Play');  
  // Position the play/stop button on the canvas
  playStopButton.position(230, 20);  
  // Assign the togglePlayback function to execute on button press
  playStopButton.mousePressed(togglePlayback);  
  
  // Create a button to jump to a random time within the audio track
  jumpButton = createButton('Hop');  
  // Position the jump button next to the play/stop button
  jumpButton.position(300, 20);  
  // Assign the jumpToRandomTime function to execute on button press
  jumpButton.mousePressed(jumpToRandomTime);  
}  
  
function setupSliders() {  
  let sliderBaseX = 210; // X-coordinate base position for sliders
  let sliderBaseY = 80;  // Y-coordinate base position for the first slider
  let sliderSpacingY = 45; // Vertical space between sliders
  
  // Create a slider to control volume, range from 0 to 1
  sliderVolume = createSlider(0, 1, 1, 0.01);  
  // Position the volume slider on the canvas
  sliderVolume.position(sliderBaseX, sliderBaseY);  
  
  // Create a slider to adjust playback rate, range from -2 to 2
  sliderRate = createSlider(-2, 2, 1, 0.01);  
  // Position the rate slider below the volume slider
  sliderRate.position(sliderBaseX, sliderBaseY + sliderSpacingY);  
  
  // Create a slider for stereo panning, range from -1 (left) to 1 (right)
  sliderPan = createSlider(-1, 1, 0, 0.01);  
  // Position the pan slider below the rate slider
  sliderPan.position(sliderBaseX, sliderBaseY + 2 * sliderSpacingY);  
}  
function initializeFFT() {  
  // Initializes the Fast Fourier Transform for audio analysis
  fft = new p5.FFT(0.2, 2048);  // Sets the smoothing and bin size for the FFT
}  
  
function initializeMeydaAnalyzer() {  
  if (typeof Meyda === "undefined") {  
    console.log("Meyda could not be found!");  // Logs a message if Meyda library isn't available
  } else {  
    // Creates a Meyda analyzer with specified audio context, source, and features
    analyzer = Meyda.createMeydaAnalyzer({  
      "audioContext": getAudioContext(),  // Audio context to be used for analysis
      "source": mySound,  // Audio source being analyzed
      "bufferSize": 512,  // Size of audio buffer for analysis
      "featureExtractors": [  // List of audio features to be extracted
        "rms",   
        "zcr",  
        "amplitudeSpectrum",  
        "loudness",  
        "spectralCentroid",  
        "spectralRolloff",  
        "spectralFlatness",  
        "spectralSpread",  
        "spectralCrest"  
      ],  
      // Callback function to handle the extracted features
      "callback": features => {  
        rms_Length = features.rms * 3000;  // Scales RMS feature for visual representation
        spectralCentroid_Size = map(features.spectralCentroid, 0, 44100 / 500, 0, 200);  // Maps spectral centroid to visual size
        spectralRolloff_Color = map(features.spectralRolloff, 0, 44100 / 2, 0, 255);  // Maps spectral rolloff to a color value
        zcr_Color = map(features.zcr, 0, 255, 0, 255);  // Maps zero-crossing rate to a color value
        spectralFlatness_Width = map(features.spectralFlatness, 0, 1, 1, 100);  // Maps spectral flatness to a width value
        spectralSpread_Alpha = (features.spectralSpread * 4) % 256;  // Maps spectral spread to an alpha value (opacity)
      }  
    });  
  }  
}  

function initializeSpeechRecognition() {  
  // Create a dictionary of possible background colors for voice commands
  set_bgcolor = createStringDict({  
    'black': true,  
    'white': true,  
    'red': true,  
    'green': true,  
    'blue': true  
  });  
  
  // Initialize speech recognition with English language and a callback for recognized words
  myRec = new p5.SpeechRec('en-US', parseWords);  
  myRec.continuous = true;  // Enables continuous listening for speech
  myRec.interimResults = true;  // Allows interim results during speech recognition
  myRec.start();  // Starts the speech recognition process
  console.log('Speech Recognition Start');  // Logs the start of speech recognition
}  


function parseWords() {
  if (myRec.resultString && myRec.resultString.trim() !== "") {
    // Extract the most recent word from the result string
    const recentWord = myRec.resultString.split(' ').pop().toLowerCase();
    console.log(recentWord);

    // Check if the recent word is a key in the set_bgcolor dictionary
    if (set_bgcolor.hasKey(recentWord)) {
      bgcolor = recentWord;
    }
  }
}

function draw() {  
  // Set the background color to the current background color  
  background(bgcolor);  
  // Call function to draw information about the background  
  drawBackgroundInfo();  
  // Call function to draw sound control interfaces  
  drawSoundControls();  
  // Call function to visualize the audio spectrum  
  drawSpectrumVisualizer();  
  
  // Disable stroke for text drawing  
  noStroke();  
  // Display text providing information about sound controls
  text('Sound Strength Controls', 280, 250);  
  text('Number of Rectangles', 285, 265);  
  // Set the fill color to blue for subsequent drawings
  fill('blue');  
  // Draw rectangles representing the RMS feature
  drawRMSRects();  
  
  // Call function to display spectral information  
  drawSpectralInfo();  
}  
  
function drawBackgroundInfo() {    
  fill('yellow');  // Set fill color to yellow
  // Draw a rectangle as a background for showing current color
  rect(250, 480, 150, 20);  
  
  // Change fill color to purple for text
  fill('purple');    
  // Display the current background color as text on the canvas
  text('Background Color: ' + bgcolor, 250, 492);    
}  
  
function drawSoundControls() {  
  // Set a translucent yellow fill for labels to improve visibility
  fill(255, 234, 0, 150); 
  
  // Set x and y base positions and a spacing for consistent layout  
  let baseX = 250;  
  let baseY = 60;  
  let spacingY = 45;  
    
  // Draw backgrounds for labels of 'volume', 'rate', and 'pan' settings
  rect(baseX, baseY, 60, 20);      
  rect(baseX, baseY + spacingY, 60, 20);  
  rect(baseX, baseY + 2 * spacingY, 60, 20); 
    
  fill('purple'); // Set fill color for text to purple  
  // Draw the text labels for sliders controlling audio properties
  text('Volume', baseX + 10, baseY + 15);  
  text('Rate', baseX + 10, baseY + spacingY + 15);  
  text('Pan', baseX + 10, baseY + 2 * spacingY + 15);  
  
  // Apply the slider control values: cube the volume for smoother control
  let vol = Math.pow(sliderVolume.value(), 3);  
  mySound.setVolume(vol);  
  // Set playback rate and panning according to slider values  
  mySound.rate(sliderRate.value());  
  mySound.pan(sliderPan.value());  
}  

function drawSpectrumVisualizer() {      
  let spectrum = fft.analyze();  // Get the current audio spectrum data
        
  push();      
  translate(50, 50);    // Shift the origin of drawing by 50 pixels on both axes
  scale(0.33, 0.20);    // Scale down the drawing for visual effect
  noStroke();           // Disable strokes for filled shapes
        
  // Create a green gradient background    
  for (let y = 0; y <= height; y++) {     
    stroke(lerpColor(color(0, 50, 0), color(150, 255, 150), y / height)); // Interpolated green color for gradient    
    line(0, y, width, y);  // Draw horizontal lines across the width for gradient
  }    
    
  for (let i = 0; i < spectrum.length; i++) {      
    let x = map(i, 0, spectrum.length, 0, width);  // Map spectrum index to x position
    let h = -height + map(spectrum[i], 0, 255, height, 0); // Map spectrum value to bar height
        
    // Dynamic bar colors with a focus on green shades    
    fill(map(spectrum[i], 0, 255, 50, 255), 200, map(spectrum[i], 0, 255, 50, 150));  // Set fill color based on spectrum value
        
    rect(x, height, width / spectrum.length, h);  // Draw rectangle representing spectrum data
  }      
  pop(); // Restore previous drawing settings
}

function drawRMSRects() {    
  for (let i = 0; (70 * i) < rms_Length; ++i) {  // Loop to draw multiple rectangles based on RMS length
    // Change the gradient color to bright yellow  
    let gradientColor = color(255, 255, 0);   
    fill(gradientColor);  // Set fill color to yellow
  
    // Apply shadow effects    
    drawingContext.shadowOffsetX = 3;    // Horizontal shadow offset
    drawingContext.shadowOffsetY = 3;    // Vertical shadow offset
    drawingContext.shadowBlur = 5;       // Blur effect for shadow
    drawingContext.shadowColor = 'rgba(0, 0, 0, 0.5)';  // Shadow color with transparency
  
    // Draw rounded rectangles    
    rect(300, 280 + 10 * i, 50, 8, 5);  // Draw rectangle with rounded corners
  }    
  
  // Reset shadow settings    
  drawingContext.shadowOffsetX = 0; // Reset horizontal shadow offset
  drawingContext.shadowOffsetY = 0; // Reset vertical shadow offset
  drawingContext.shadowBlur = 0;    // Reset blur effect for shadow
}

function drawSpectralInfo() {    
  noStroke();  // Removes border from shapes
  fill('purple');  // Sets text fill color to purple
  
  // Display information about how certain audio features affect visuals
  text('Frequency Distribution Sets Colour', 20, 200);    
  text('Frequency Content Controls Rectangle Size', 20, 220);    
  text('Spectral Spread Changes', 130, 245);    
  text('Color Transparency', 145, 260);    
  
  // Calculate rolloffColor based on spectral rolloff value to represent frequency distribution
  let rolloffColor = lerpColor(
    color(spectralRolloff_Color, 255 - spectralRolloff_Color, (spectralRolloff_Color * 5) % 255),
    color(0, 255 - spectralRolloff_Color, spectralRolloff_Color),
    0.5
  );    
  rolloffColor.setAlpha(180);  // Set transparency for rolloff color
  fill(rolloffColor);  // Use rolloff color for subsequent shapes
  
  // Apply shadow effects for enhanced visual depth
  drawingContext.shadowOffsetX = 3;    
  drawingContext.shadowOffsetY = 3;    
  drawingContext.shadowBlur = 6;    
  drawingContext.shadowColor = 'rgba(0, 0, 0, 0.4)';    
  
  // Draw rectangle representing spectral centroid at specified position with dynamic height
  rect(20, 230, 50, spectralCentroid_Size, 5);    
    
  // Define color based on spectral spread for another rectangle
  let spreadColor = color(100, 50, 100, spectralSpread_Alpha);    
  fill(spreadColor);    
  rect(170, 265, 50, 50);  // Draw rectangle with spread color
  
  fill('purple');  // Reset fill to purple for text
  text('Sound Wave Changes Sets Border Color', 75, 350);    
  text('Sound Texture Adjusts Border Thickness', 75, 370);    

  // Configure border color using zero-crossing rate (ZCR) and thickness using spectral flatness
  stroke((zcr_Color * 10) % 255, (zcr_Color * 5) % 255, (zcr_Color * 2) % 255);    
  strokeWeight(spectralFlatness_Width);    
  fill(rolloffColor);  // Use rolloff color for fill    
  
  // Draw small rectangle to demonstrate ZCR and flatness effects
  rect(185, 410, 20, 20);    

  noStroke();  // Remove stroke for other shapes
  // Reset shadow effects to default
  drawingContext.shadowOffsetX = 0;    
  drawingContext.shadowOffsetY = 0;    
  drawingContext.shadowBlur = 0;    
}

function jumpToRandomTime() {  
  if (mySound.isLoaded()) {  // Check if the sound file is loaded
    const duration = mySound.duration();  // Get the duration of the sound
    const randomTime = random(duration);  // Generate a random time within the duration
    mySound.jump(randomTime);  // Jump to the randomly selected time in the audio
  } else {  
    console.error("Sound not loaded.");  // Log an error if the sound is not loaded
  }  
}

function togglePlayback() {  
  if (mySound.isPlaying()) {  // Check if the sound is currently playing
    mySound.stop();  // Stop the sound
    analyzer.stop();  // Stop the analysis 
    playStopButton.html('Play');  // Update button label to indicate the user can play the sound next
  } else {  
    mySound.loop();  // Start looping the sound
    analyzer.start();  // Start analyzing the sound 
    playStopButton.html('Stop');  // Update button label to indicate the user can stop the sound next
  }  
}

// END of code personally written without assistance