import CanvasJSReact from '../library/CanvasJS/canvasjs.react';
import React, { Component } from 'react';
import { DATA_TYPE_ENUM } from '../API/data_type';
import { RootContext } from '../rootContext';
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const motors = {};

const SUB_CMD_ENUM = Object.freeze({
    REGISTER: 0,
    STATE_UPDATE: 1,
});

class MotorState extends Component {
    chart;

    componentDidUpdate() {
        const state = this.context;
        if (state.port && !state.motorState) {
            state.port.on(DATA_TYPE_ENUM.MOTOR_STATE, this.decodedHandler);
            state.update({
                motorState: true,
            });
        }
    }

    decodedHandler = (decoded) => {
        switch (decoded.sub_id) {
            case SUB_CMD_ENUM.REGISTER:
                this.registerMotor(decoded);
                break;
            case SUB_CMD_ENUM.STATE_UPDATE: {
                this.motorStateUpdate(decoded);
            } break;
            default: break;
        }
    }

    registerMotor = (decoded) => {
        /**
         * id: string,
         * yunit: string,
         * ydisplay: string,
         * xunit: string,
         * xdisplay: string,
         * title: string
         */ 
        if (motors[decoded.id]) return;
        console.log('register motor');
        motors[decoded.id] = {
            id: decoded.id,
            chart: null,
            pts: [],
        };

        motors[decoded.id].options = {
            animationEnabled: false,
            exportEnabled: true,
            theme: "light2",
            title: {
                text: decoded.title
            },
            axisY: {
                title: decoded.ydisplay,
                suffix: decoded.yunit
            },
            axisX: {
                title: decoded.xdisplay,
                suffix: decoded.xunit
            },
            data: [{
                type: "line",
                dataPoints: motors[decoded.id].pts
            }]
        };

        this.forceUpdate();
    }

    motorStateUpdate = (decoded) => {
        console.log('update state');
        motors[decoded.id].pts.push({
            x: decoded.x,
            y: decoded.y
        });

        while (motors[decoded.id].pts.length > 100) {
            motors[decoded.id].pts.shift();
        }

        motors[decoded.id].chart.render();
    }

    componentWillUnmount() {
        console.log('unmount');
        const state = this.context;
        state.port.off(DATA_TYPE_ENUM.MOTOR_STATE, this.decodedHandler);
        state.update({
            motorState: false,
        });
    }

    render() {
        if (Object.keys(motors).length) {
                    return (
            <div>
                {
                    Object.values(motors).map(m => <CanvasJSChart options={m.options} onRef={ref => m.chart = ref} />)
                }
            </div>
        );
        } else {
            return (<div>To view motors' state, register a motor.</div>)
        }

    }
}

MotorState.propTypes = {

};

MotorState.contextType = RootContext;

export default MotorState;