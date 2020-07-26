import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as WebSerialPort from './API/serial';
import NoWebAPI from './Components/NoWebAPI.jsx';

ReactDOM.render(
  <React.StrictMode>
    {
      WebSerialPort.isAPIAvailable() ? <App /> : <NoWebAPI />
    }
  </React.StrictMode>,
  document.getElementById('root')
);

// navigator.serial.requestPort().then((port) => {
//   port.open({ baudrate: 115200 }).then(() => {
//     console.log(port);
//     // while (true) {
//     //   const { value, done } = reader.read();
//     //   if (value) {
//     //     console.log(value);
//     //   }
//     //   if (done) {
//     //     console.log('[readLoop] DONE', done);
//     //     reader.releaseLock();
//     //     break;
//     //   }
//     // }
//   })
// });
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
