import React from 'react';
import './App.css';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Setting from './Components/Setting';
import RootStateProvider from './rootContext';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      className="page-container"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        props.children
      )}
    </div>
  );
}

function App() {
  return (
    <RootStateProvider>
      <div className="App">
        <AppBar position="static">
          <Toolbar><Typography>HKUST Robotics Team Data Plot</Typography></Toolbar>

          <Tabs value={0} variant="fullWidth" aria-label="simple tabs example">
            <Tab label="Setting" />
            <Tab label="Pathing" />
            <Tab label="XY Positioning" />
            <Tab label="Motor State" />
          </Tabs>
        </AppBar>
        <TabPanel index={0} value={0}>
          <Setting />
        </TabPanel>
      </div>
    </RootStateProvider>

  );
}

export default App;

          // navigator.serial.requestPort().then((port) => {
          //   port.open({ baudrate: 115200 }).then(() => {
          //     let decoder = new window.TextDecoderStream();
          //     let inputDone = port.readable.pipeTo(decoder.writable);
          //     let inputStream = decoder.readable;
          //     let reader = inputStream.getReader();
          //     setInterval(() => {
          //       reader.read().then((v, d) => {
          //         console.log(v);
          //       });
          //     }, 1000);
          //   })
          // });