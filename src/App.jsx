import React from 'react';
import './App.css';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Setting from './Components/Setting';
import { RootContext } from './rootContext';
import { Button, Box } from '@material-ui/core';
import XYPosCanvas from './Components/pixi/XYPosCanvas';
import ChartBrowser from './Components/ChartBrowser';
import * as SP from './API/serial';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box>
      <div
        className={value === index ? "page-container" : "none"}
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
    </Box>
  );
}

function App() {
  const state = React.useContext(RootContext);

  const requestSerialPanel = (state) => {
    SP.accessSerialPort().then(port => {
      state.update({ port: port });
    });
  }

  const disconnectSP = (state) => {
    state.port.disconnect().then(() => {
      state.update({ port: undefined });
    });
  }

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography>HKUST Robotics Team Data Plot</Typography>
          <div style={{ flexGrow: 1 }} />{
            state.port ? <Button variant="contained" color="secondary" onClick={() => {
              disconnectSP(state);
            }}>Click to Disconnect</Button> : <Button variant="contained" color="secondary" onClick={() => {
              requestSerialPanel(state);
            }}>Open Serial Panel</Button>
          }
          <div style={{ marginRight: '10px' }} ></div>
          <Button variant="contained" color="secondary" onClick={() => {
            document.getElementById("config-input").click();
          }}>Read Config</Button>
        </Toolbar>

        <Tabs value={state.currentPage} variant="fullWidth" onChange={(e, i) => {
          state.update({
            currentPage: i
          });
        }}>
          <Tab label="General" />
          <Tab label="Positioning & Pathing" />
          <Tab label="Chart" />
        </Tabs>
      </AppBar>
      <TabPanel index={0} value={state.currentPage}>
        <Setting />
      </TabPanel>
      <TabPanel index={1} value={state.currentPage}>
        <XYPosCanvas />
      </TabPanel>
      <TabPanel index={2} value={state.currentPage}>
        <ChartBrowser />
      </TabPanel>
    </div >
  );
}

export default App;