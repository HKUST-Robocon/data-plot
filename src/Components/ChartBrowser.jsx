import CanvasJSReact from '../library/CanvasJS/canvasjs.react';
import React, { Component } from 'react';
import { DATA_TYPE_ENUM } from '../API/data_type';
import { RootContext } from '../rootContext';
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const charts = {};

const SUB_CMD_ENUM = Object.freeze({
    REGISTER: 0,
    STATE_UPDATE: 1,
});

class ChartBrowser extends Component {
    chart;

    componentDidUpdate() {
        const state = this.context;
        if (state.port && !state.chartState) {
            state.port.on(DATA_TYPE_ENUM.MOTOR_STATE, this.decodedHandler);
            state.update({
                chartState: true,
            });
        }
    }

    decodedHandler = (decoded) => {
        switch (decoded.sub_id) {
            case SUB_CMD_ENUM.REGISTER:
                this.registerChart(decoded);
                break;
            case SUB_CMD_ENUM.STATE_UPDATE: {
                this.chartStateUpdate(decoded);
            } break;
            default: break;
        }
    }

    registerChart = (decoded) => {
        /**
         * id: string,
         * yunit: string,
         * ydisplay: string,
         * xunit: string,
         * xdisplay: string,
         * title: string
         */
        if (charts[decoded.id]) return;
        charts[decoded.id] = {
            id: decoded.id,
            chart: null,
            pts: [],
        };

        charts[decoded.id].options = {
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
                dataPoints: charts[decoded.id].pts
            }]
        };

        this.forceUpdate();
    }

    chartStateUpdate = (decoded) => {
        console.log('update state');
        charts[decoded.id].pts.push({
            x: decoded.x,
            y: decoded.y
        });

        while (charts[decoded.id].pts.length > 100) {
            charts[decoded.id].pts.shift();
        }

        charts[decoded.id].chart.render();
    }

    componentWillUnmount() {
        console.log('unmount');
        const state = this.context;
        if (state.port)
            state.port.off(DATA_TYPE_ENUM.MOTOR_STATE, this.decodedHandler);
        state.update({
            chartState: false,
        });
    }

    render() {
        if (Object.keys(charts).length) {
            return (
                <div>
                    {
                        Object.values(charts).map(c => <CanvasJSChart key={c.id} options={c.options} onRef={ref => c.chart = ref} />)
                    }
                </div>
            );
        } else {
            return (<div>No charts are available. Please register your chart.</div>)
        }

    }
}

ChartBrowser.propTypes = {

};

ChartBrowser.contextType = RootContext;

export default ChartBrowser;