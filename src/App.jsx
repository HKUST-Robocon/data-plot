import React from 'react';
import './App.css';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Setting from './Components/Setting';
import RootStateProvider, { RootContext } from './rootContext';
import { Button } from '@material-ui/core';
import XYPosCanvas from './Components/pixi/XYPosCanvas';
import ChartBrowser from './Components/ChartBrowser';

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
  const state = React.useContext(RootContext);
  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography>HKUST Robotics Team Data Plot</Typography>
          <div style={{ flexGrow: 1 }} />
          <Button variant="contained" color="secondary" onClick={() => {
            document.getElementById("config-input").click();
          }}>Read Config</Button>
        </Toolbar>

        <Tabs value={state.currentPage} variant="fullWidth" aria-label="simple tabs example" onChange={(e, i) => {
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
    </div>
  );
}

export default App;