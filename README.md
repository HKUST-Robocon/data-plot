# HKUST Robotics Team Data Plot

App link: to be released

This is an experiment project - using Chrome Web Serial API to read UART data.

To use this app, please use the least Google Chrome and enable the <code>#enable-experimental-web-platform-features</code> flag in <code>chrome://flags</code>.

## Important Message

Since I'm the only developer who in charge of this project, there should many unexpected bugs :), so if you find any bug, press <code>F12</code>, go to Console, take a screenshot, and report it to me, thx!

Also, It's recommended that sending those import packets for several times (e.g. register motors). It's because on receiving side, some packets will be ignored due to noises and loses of segments.

## Debug this project

1. Install <a src="https://nodejs.org/en/">Node.js and npm</a>. (Usually npm SDK is attached with Node.js installer)

2. Clone this project

3. In terminal, enter <code>npm install</code> to install used dependencies.

4. Enter <code>npm start</code> to start debugging.

Please note that it will open the default browser for debugging, so if your default browser is not Google Chrome, you may need explicitly state the browser you want to use.

Here is an example of a packet:
```javascript
{
    "type": 1, // 1 = sending positioning info
    "sub_id": 0,
    "pos_x": .0,
    "pos_y": .0
}
```

## Data structure

All data packets should be in <a src="https://www.w3schools.com/js/js_json_intro.asp">JSON</a> format, and in order to avoid stack overflow, transfer frequency should be greater 30ms (40ms is suggested).

For a data packet, member <code>type</code> must be included, it tells Data Plot how to decode the message, and visualize it.

You may also include other members in packets. However, Data Plot will only handle necessary information.

### CONIFG (ID: 0)

to set any configuration (e.g. game field, wheelbase, laser), send packets with type <code>0</code>.

### XY_POSITIONING (ID: 1)

to update wheelbase position, send packets with type <code>1</code>.

Sub commands:
<table>
    <tr>
        <th>ID</th>
        <th>ENUM</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>0</td>
        <td>GO_TO</td>
        <td>Print position on map.</td>
    </tr>
        <tr>
        <td>1</td>
        <td>CLEAR_MAP</td>
        <td>Clear all positioning records.</td>
    </tr>
    </tr>
        <tr>
        <td>2</td>
        <td>SET_COLOR</td>
        <td>the color of dots will be changed, please note that the color format is <code>RGB888</code>.</td>
    </tr>
</table>

```javascript
{
    "type": 1,
    "sub_id": 0,
    "pos_x": .0,
    "pos_y": .0
}
```

```javascript
{
    "type": 1,
    "sub_id": 1
}
```

```javascript
{
    "type": 1,
    "sub_id": 2,
    "color":0xFFFFFF
}
```
### MOTOR STATE (ID: 3)

Motor State Page allows you to print anything about motor - rpm, velocity target, position target, etc.

Sub commands:

<table>
    <tr>
        <th>ID</th>
        <th>ENUM</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>0</td>
        <td>REGISTER</td>
        <td>Register a motor. After the registration, a line chart for that motor will be created.</td>
    </tr>
        <tr>
        <td>1</td>
        <td>STATE_UPDATE</td>
        <td>Update a motor state.</td>
    </tr>
</table>

Example:
```javascript
// Register a motor
{
    "type": 3,
    "sub_id": 0,
    "id": "test_motor",
    "yunit": "m/s",
    "ydisplay": "speed",
    "xunit": "s",
    "xdisplay": "time",
    "title": "Test Motor Speed Chart"
}
```

```javascript
// update motor state
{
    "type": 3,
    "sub_id": 1,
    "id": "test_motor",
    "x": 0.1,
    "y": 1000.0
}
```