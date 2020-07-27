import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { RootContext } from '../rootContext';
import Button from '@material-ui/core/Button';
import * as SP from '../API/serial';
import XYPosCanvas from './pixi/XYPosCanvas';

const Title = (props) => {
    const { children, title, variant, ...other } = props;

    return (<div>
        <Typography variant={variant}>{title}</Typography>
        <div style={{ marginLeft: '10px' }} />
        {children}
    </div>);
};


class Setting extends Component {
    constructor(props) {
        super(props);
    }

    requestSerialPanel = (state) => {
        SP.accessSerialPort().then(port => {
            state.update({ port: port });
        });
    }

    disconnectSP = (state) => {
        state.port.disconnect().then(() => {
            state.update({ port: undefined });
        });
    }

    render() {
        return (
            <RootContext.Consumer>
                {
                    state => (
                        <div>
                            <div className="title-bar">
                                <Typography variant="h6" noWrap={true}>
                                    Serial Port Connection & Info:
                                </Typography>
                                <div style={{ marginLeft: '10px' }} />{
                                    state.port ? <Button variant="contained" color="secondary" onClick={() => {
                                        this.disconnectSP(state);
                                    }}>Click to Disconnect</Button> : <Button variant="contained" color="primary" onClick={() => {
                                        this.requestSerialPanel(state);
                                    }}>Open Serial Panel</Button>
                                }
                            </div>
                            <div className="title=bar">
                                <Typography variant="h6" noWrap={true}>
                                    Game field type:
                                    <div style={{ marginLeft: '10px' }} />
                                </Typography>
                            </div>
                            <XYPosCanvas />
                        </div>
                    )
                }

            </RootContext.Consumer>

        );
    }
}

Setting.propTypes = {

};

export default Setting;