import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { RootContext } from '../rootContext';
import Button from '@material-ui/core/Button';
import XYPosCanvas from './pixi/XYPosCanvas';
import ChartBrowser from './ChartBrowser';

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

    render() {
        return (
            <RootContext.Consumer>
                {
                    state => (
                        <div>
                            <div className="title=bar">
                                <Typography variant="h6" noWrap={true}>
                                    Game field type:
                                    <div style={{ marginLeft: '10px' }} />
                                </Typography>
                            </div>
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