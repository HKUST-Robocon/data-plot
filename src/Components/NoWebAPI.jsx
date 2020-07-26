import React, { Component } from 'react';
import Teamlogo from '../assets/robotics_team.png';
import './noWebAPI.css';

class NoWebAPI extends Component {
    render() {
        return (
            <div className="center-content">
                <img src={Teamlogo} />
                To use Data Plot, use Google Chrome and enable Chrome Web API.
            </div>
        );
    }
}

export default NoWebAPI;
