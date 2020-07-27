import React, { Component } from 'react';
import * as PIXI from 'pixi.js';
import GAME_FIELD_IMG from '../../assets/game_field.jpeg';
import { RootContext } from '../../rootContext';
import { DATA_TYPE_ENUM } from '../../API/data_type';

class XYPosCanvas extends Component {
    app;
    gameCanvas;
    rootState;
    drawer;
    gameField;

    constructor(props) {
        super(props);

    }

    componentDidMount() {
        this.app = new PIXI.Application(1000, 620);
        this.gameCanvas.appendChild(this.app.view);
        this.app.start();
        this.gameField = PIXI.Sprite.fromImage(GAME_FIELD_IMG);
        this.app.stage.addChild(this.gameField);
        this.drawer = new PIXI.Graphics();
        this.drawer.beginFill(0xFFFFFF);
        this.drawer.drawRect(0, 0, 100, 100);
        this.drawer.endFill();
        this.app.stage.addChild(this.drawer);
    }

    componentDidUpdate() {
        const state = this.context;
        if (state.port && !state.xyPosRegistered) {
            console.log('registered');
            state.port.on(DATA_TYPE_ENUM.XY_POSITIONING, this.decodedHandler);
            state.update({
                xyPosRegistered: true
            });
        }
    }

    decodedHandler = (decoded) => {
        // console.log('x:' + decoded.pos_x * 100 + ' y: ' + window.innerHeight - this.gameField.height - decoded.pos_y * 100);
        this.drawer.beginFill(0xFFFF00, 1);
        this.drawer.drawCircle(decoded.pos_x * 100, 620 - decoded.pos_y * 100, 10);
        this.drawer.endFill();
    }

    componentWillUnmount() {
        const state = this.context;
        state.port.off(DATA_TYPE_ENUM.XY_POSITIONING, this.decoderMsg);
        state.update({
            xyPosRegistered: false
        });
        this.app.stop();

    }

    render() {
        let component = this;
        return (
            <RootContext.Consumer>
                {
                    state => <div ref={(thisDiv) => { component.gameCanvas = thisDiv }} />
                }
            </RootContext.Consumer>

        );
    }
}

XYPosCanvas.contextType = RootContext;

export default XYPosCanvas;