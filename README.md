# HKUST Robotics Team Data Plot

App link: https://kkdlau.student.ust.hk/data_plot/

This is an experiment project - using Chrome Web Serial API to read UART data.

To use this app, please use the least Google Chrome and enable the <code>#enable-experimental-web-platform-features</code> flag in <code>chrome://flags</code>.

## Important Message

Since I'm the only developer who in charge of this project, there should many unexpected bugs :), so if you find any bug, press <code>F12</code>, go to Console, take a screenshot, and report it to me, thx!

## Debug this project

1. Install <a src="https://nodejs.org/en/">Node.js and npm</a>. (Usually npm SDK is attached with Node.js installer)

2. Clone this project

3. In terminal, enter <code>npm install</code> to install used dependencies.

4. Enter <code>npm start</code> to start debugging.

Please note that it will open the default browser for debugging, so if your default browser is not Google Chrome, you may need explicitly state the browser you want to use in terminal.

## Data structure

All data packets should be in <a src="https://www.w3schools.com/js/js_json_intro.asp">JSON</a> format, and in order to avoid stack overflow, transfer frequency should be greater 30ms (40ms is suggested).

For a data packet, member <code>type_id</code> must be included, it tells Data Plot how to decode the message, and visualize it.

You may also include other members in packets as well, however, Data Plot will only handle necessary information.

### Type and type ID

XY_POSITIONING: 0

PATHING: 1

MOTOR_STATE: 2