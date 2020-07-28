import React, { Component } from 'react';
import * as PIXI from 'pixi.js';
import GAME_FIELD_IMG from '../../assets/game_field.jpeg';
import { RootContext } from '../../rootContext';
import { DATA_TYPE_ENUM } from '../../API/data_type';
import { WB_INFO } from '../../API/wb_info';

const SUB_CMD_ENUM = Object.freeze({
    GO_TO: 0,
    CLEAR_MAP: 1,
    SET_COLOR: 2
});

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
        this.app.stage.addChild(this.drawer);
    }

    componentDidUpdate() {
        const state = this.context;
        if (state.port && !state.xyPosRegistered) {
            console.log('registered');
            state.port.on(DATA_TYPE_ENUM.XY_POSITIONING, this.decodedHandler);
            state.update({
                xyPosRegistered: true,
                drawPosColor: 0xFFFF00
            });
        }
    }

    decodedHandler = (decoded) => {
        const state = this.context;
        switch (decoded.sub_id) {
            case SUB_CMD_ENUM.GO_TO: {
                this.drawer.beginFill(state.drawPosColor, 0.7);
                this.drawer.drawCircle(decoded.pos_x * 100, 620 - decoded.pos_y * 100, 10);
                this.drawer.endFill();
            } break;
            case SUB_CMD_ENUM.CLEAR_MAP: {
                this.drawer.clear();
            } break;
            case SUB_CMD_ENUM.SET_COLOR: {
                state.update({
                    drawPosColor: decoded.color
                });
            } break;
        }

    }

    rotatePoint = (x, y, a) => {
        return {
            x: Math.cos(a) * x - Math.sin(a) * y,
            y: Math.sin(a) * x + Math.cos(a) * y
        };
    }

    drawWheelbase = (x, y, a) => {
        let corners = [
            [-WB_INFO.WIDTH, -WB_INFO.HEIGHT],
            [WB_INFO.WIDTH, -WB_INFO.HEIGHT],
            [WB_INFO.WIDTH, WB_INFO.HEIGHT],
            [-WB_INFO.WIDTH, WB_INFO.HEIGHT],
        ];

        let rotatedCorners = [];

        for (let p of corners) {
            const pos = this.rotatePoint(p[0], p[1], a);
            rotatedCorners.push(new PIXI.Point(pos.x + x,
                pos.y + y));
        }
    }

    componentWillUnmount() {
        const state = this.context;
        state.port.off(DATA_TYPE_ENUM.XY_POSITIONING, this.decodedHandler);
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