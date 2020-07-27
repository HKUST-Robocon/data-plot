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

You may also include other members in packets. However, Data Plot will only handle necessary information.

### CONIFG (ID: 0)

to set any configuration (e.g. game field, wheelbase, laser), send packets with type <code>0</code>.

### XY_POSITIONING (ID: 1)

to update wheelbase position, send packets with type <code>0</code>.

```javascript
{
    "type_id": 1,
    "sub_id": 0,
    "pos_x": .0,
    "pos_y": .0,
}
```

There are some sub commands:

1. GO_TO (SUBID: 0): by sending this, Data Plot will consider the position is continuous.
2. JUMP_TO (SUBID: 1): by sending this, Data Plot will consider the position is discontinuous.