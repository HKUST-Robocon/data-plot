import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { RootContext } from '../rootContext';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';

const Title = (props) => {
    const { children, title, variant, ...other } = props;

    return (<div>
        <Typography variant={variant}>{title}</Typography>
        <div style={{ marginLeft: '10px' }} />
        {children}
    </div>);
};


class General extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const state = this.context;
        return (
            <div>
                <div className="title=bar">
                    Using blue field:
                <Switch
                        checked={state.fieldType ? true : false}
                        onChange={e => {
                            state.update({
                                gameField: e.target.checked
                            });
                        }}
                        color="secondary"
                    />
                </div>
            </div>

        );
    }
}

General.contextType = RootContext;

General.propTypes = {

};

export default General;