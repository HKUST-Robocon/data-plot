import React, { Component } from 'react';
import * as PIXI from 'pixi.js';
import GAME_FIELD_IMG from '../../assets/game_field.jpeg';
import { RootContext } from '../../rootContext';

class XYPosCanvas extends Component {
    app;
    gameCanvas;

    constructor(props) {
        super(props);

    }

    componentDidMount() {
        this.app = new PIXI.Application(window.innerWidth, window.innerHeight);
        this.gameCanvas.appendChild(this.app.view);
        this.app.start();
        this.app.stage.addChild(PIXI.Sprite.fromImage(GAME_FIELD_IMG));
    }

    componentWillUnmount() {
        this.app.stop();
    }

    render() {
        let component = this;
        return (
            <RootContext.Consumer>
                {
                    state => {
                        this.state = state;
                        return (<div ref={(thisDiv) => { component.gameCanvas = thisDiv }} />);
                    }
                }
            </RootContext.Consumer>

        );
    }
}

XYPosCanvas.propTypes = {

};

export default XYPosCanvas;