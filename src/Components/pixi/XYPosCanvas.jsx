import React, { Component } from 'react';
import * as PIXI from 'pixi.js';
import GAME_FIELD_IMG from '../../assets/game_field.jpeg';
import { RootContext } from '../../rootContext';
import { DATA_TYPE_ENUM, GAMEFIELD_ENUM } from '../../API/data_type';
import { WB_INFO } from '../../API/wb_info';
import { Button } from '@material-ui/core';
import { CLEAR_POS } from '../../API/packet_helper';

const SUB_CMD_ENUM = Object.freeze({
    GO_TO: 0,
    CLEAR_MAP: 1,
    SET_COLOR: 2,
    ADD_PATHING: 3,
    SET_DISPLAY_PATH: 4,
    SHOULD_SHOW_PATH: 5
});

const deepClone = (arr) => {
    const clone = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] instanceof Array) {
            clone.push(deepClone(arr[i]));
        } else {
            clone.push(arr[i]);
        }
    }

    return clone;
}

const toGameFieldPos = (x, y, type) => {
    switch (type) {
        case GAMEFIELD_ENUM.BLUE:
            return {
                x: 1000 - Math.abs(x),
                y: 665 - y
            }
        case GAMEFIELD_ENUM.RED:
            return {
                x: 150 + x,
                y: 665 - y
            };
        default: return null;
    }

}

class XYPosCanvas extends Component {
    app;
    canvas;
    rootState;
    drawer;
    pathDrawer;
    gameField;
    pathing = {};
    currentPath = "";
    last_pos = { x: 1000000, y: 1000000, a: 100000 };

    constructor(props) {
        super(props);

    }

    componentDidMount() {
        this.app = new PIXI.Application(1150, 665);
        this.canvas.appendChild(this.app.view);
        this.app.start();
        this.gameField = PIXI.Sprite.fromImage(GAME_FIELD_IMG);
        this.app.stage.addChild(this.gameField);
        this.drawer = new PIXI.Graphics();
        this.pathDrawer = new PIXI.Graphics();
        this.app.stage.addChild(this.drawer);
        this.app.stage.addChild(this.pathDrawer);

        // window.onresize = this.windowSizeChange;

        // this.windowSizeChange(null);
    }

    componentDidUpdate() {
        const state = this.context;
        if (state.port && !state.xyPosRegistered) {
            state.port.on(DATA_TYPE_ENUM.POSITIONING_N_PATHING, this.decodedHandler);
            state.update({
                xyPosRegistered: true,
                drawPosColor: 0xFFFF00
            });
        }
    }

    windowSizeChange = e => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        var ratio = Math.min(width / this.app.renderer.width, height / this.app.renderer.height);

        this.app.renderer.resize(Math.ceil(1150 * ratio), Math.ceil(665 * ratio));
    }

    decodedHandler = (decoded) => {
        const state = this.context;
        console.log('pos cmd decode');

        switch (decoded.sub_id) {
            case SUB_CMD_ENUM.GO_TO: {
                const pos = toGameFieldPos(decoded.x * 100, decoded.y * 100, GAMEFIELD_ENUM.RED);
                if (Math.abs(pos.x - this.last_pos.x) > 0.02 || Math.abs(pos.y - this.last_pos.y) > 0.02 || Math.abs(pos.a + this.last_pos.a) > 0.03) {
                    this.drawWheelbase(pos.x, pos.y, -decoded.a);
                    console.log('draw');
                    console.log(pos);

                    this.last_pos = {
                        x: pos.x,
                        y: pos.y,
                        a: -decoded.a
                    }

                }
            } break;
            case SUB_CMD_ENUM.CLEAR_MAP: {
                console.log('clear');
                this.drawer.clear();
            } break;
            case SUB_CMD_ENUM.SET_COLOR: {
                state.update({
                    drawPosColor: decoded.color
                });
            } break;
            case SUB_CMD_ENUM.ADD_PATHING: {
                console.log(deepClone(decoded.pts));
                this.pathing[decoded.id] = deepClone(decoded.pts);
                this.drawPath(decoded.id, 0xFF00FF);
            } break;
            case SUB_CMD_ENUM.SET_DISPLAY_PATH: {
                this.currentPath = decoded.id;
            } break;
            case SUB_CMD_ENUM.SHOULD_SHOW_PATH: {
                if (decoded.should == 0) {
                    this.pathDrawer.clear();
                } else {
                    this.drawPath(decoded.id, state.color);
                }
            } break;

            default: break;
        }

    }

    rotatePoint = (x, y, a) => {
        return {
            x: Math.cos(a) * x - Math.sin(a) * y,
            y: Math.sin(a) * x + Math.cos(a) * y
        };
    }

    drawPoints = (points, color) => {
        this.drawer.lineStyle(2, color, 0.5, 0.5, false);
        this.drawer.moveTo(points[0].x, points[0].y);
        points.concat(points[0]).forEach((p) => {
            this.drawer.lineTo(p.x, p.y);
        });
    }

    drawDot = (drawer, x, y, r, color) => {
        drawer.beginFill(color, 0.7);
        drawer.drawCircle(x, y, r);
        drawer.endFill();
    }

    drawWheelbase = (x, y, a) => {
        const state = this.context;
        let corners = [
            [-WB_INFO.WIDTH, -WB_INFO.HEIGHT],
            [WB_INFO.WIDTH, -WB_INFO.HEIGHT],
            [WB_INFO.WIDTH, WB_INFO.HEIGHT],
            [-WB_INFO.WIDTH, WB_INFO.HEIGHT],
        ];

        let rotated = [];

        for (let p of corners) {
            const pos = this.rotatePoint(p[0], p[1], -a);
            rotated.push({
                x: pos.x + x,
                y: pos.y + y
            });
        }

        // this.drawPoints(rotated, state.color);
        this.drawDot(this.drawer, x, y, 2, 0x00FF00);
    }

    drawPath = (path_id, color) => {
        const state = this.context;
        this.pathing[path_id].forEach(pt => {
            const p = toGameFieldPos(pt[0] * 100, pt[1] * 100, GAMEFIELD_ENUM.RED);
            this.drawDot(this.pathDrawer, p.x, p.y, 3, color);
        });
    }

    componentWillUnmount() {
        const state = this.context;
        if (state.port)
            state.port.off(DATA_TYPE_ENUM.POSITIONING_N_PATHING, this.decodedHandler);
        state.update({
            xyPosRegistered: false
        });
        this.app.stop();

    }

    render() {
        const component = this;
        const state = this.context;
        return (
            <div>
                <Button disabled={state.port ? false : true} style={{ margin: '10px 10px 10px 10px' }} variant="contained" color="primary" onClick={() => {
                    window.sp.rawMsg += CLEAR_POS;
                }}>Clear Pos Records</Button>
                <div ref={(thisDiv) => { component.canvas = thisDiv }} />
            </div>
        );
    }
}

XYPosCanvas.contextType = RootContext;

export default XYPosCanvas;