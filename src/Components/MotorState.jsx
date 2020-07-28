import CanvasJSReact from '../library/CanvasJS/canvasjs.react';
import React, { Component } from 'react';
import { DATA_TYPE_ENUM } from '../API/data_type';
import { RootContext } from '../rootContext';
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

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
                motors: {
                    '0': []
                }
            });
        }
    }

    decodedHandler = (decoded) => {
        switch (decoded.sub_id) {
            case SUB_CMD_ENUM.REGISTER:
                break;
            case SUB_CMD_ENUM.STATE_UPDATE: {
                this.motorStateUpdate(decoded);
            } break;
            default: break;
        }
    }

    motorStateUpdate(decoded) {
        const state = this.context;
        const point = {
            x: decoded.time * 1e-3,
            y: decoded.mv
        };
        let toUpdate = state.motors ? state.motors[0].concat(point) : [point];
        console.log(toUpdate.length);
        if (toUpdate.length > 100) {
            toUpdate.shift();
        }

        state.update({
            motors: {
                ...state.motors,
                '0': toUpdate
            }
        });
    }

    componentWillUnmount() {
        console.log('unmount');
        const state = this.context;
        state.port.off(DATA_TYPE_ENUM.MOTOR_STATE, this.decodedHandler);
        state.update({
            motorState: false,
            motors: {}
        });
    }

    render() {
        const state = this.context;
        const options = {
            animationEnabled: false,
            exportEnabled: true,
            theme: "light2", // "light1", "dark1", "dark2"
            title: {
                text: "Driving Motor RPS"
            },
            axisY: {
                title: "RPS",
                suffix: " rev/s"
            },
            axisX: {
                title: "Time",
                suffix: "s"
            },
            data: [{
                type: "line",
                dataPoints: state.motors ? state.motors[0] : []
            }]
        }
        return (
            <div>
                <CanvasJSChart options={options} onRef={ref => this.chart = ref} />
            </div>
        );
    }
}

MotorState.propTypes = {

};

MotorState.contextType = RootContext;

export default MotorState;