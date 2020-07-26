import React from 'react';
import './App.css';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';

function App() {
  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar><Typography>HKUST Robotics Team Data Plot</Typography></Toolbar>

        <Tabs value={0} variant="fullWidth" aria-label="simple tabs example">
          <Tab label="Setting" />
          <Tab label="Pathing" />
          <Tab label="XY Positioning" />
          <Tab label="Motor State" />
        </Tabs>
        <Button variant="outlined" onClick={() => {
          navigator.serial.requestPort().then((port) => {
            port.open({ baudrate: 115200 }).then(() => {
              let decoder = new window.TextDecoderStream();
              let inputDone = port.readable.pipeTo(decoder.writable);
              let inputStream = decoder.readable;
              let reader = inputStream.getReader();
              setInterval(() => {
                reader.read().then((v, d) => {
                  console.log(v);
                });
              }, 1000);
            })
          });
        }}>Click me</Button>
      </AppBar>


    </div>
  );
}

export default App;
