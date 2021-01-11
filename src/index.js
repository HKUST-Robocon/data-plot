import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as SP from './API/serial';
import NoWebAPI from './components/NoWebAPI.jsx';
import * as DP_CMD from './API/packet_helper';
import RootStateProvider from './rootContext';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

window.DP_CMD = DP_CMD;

window.userConfig = null;

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#212121'
    },
    secondary: {
      main: '#1976d2'
    }
  }
});

document.getElementById('config-input').addEventListener('change', e => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = e => {
    try {
      window.userConfig = e.target.result;
    } catch (error) {
      console.log('the input file is not a valid JSON.');
    }
  }
  reader.readAsText(file);
});

ReactDOM.render(
  <React.StrictMode>
    {
      SP.isAPIAvailable() ? <RootStateProvider><ThemeProvider theme={theme}><App /></ThemeProvider></RootStateProvider> : <NoWebAPI />
    }
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
