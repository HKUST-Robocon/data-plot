import React, { Component } from 'react';

export const RootContext = React.createContext({
});

class RootStateProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 0,
            port: 0,
            update: this.updateContext
        };

    }

    updateContext = (state) => {
        this.setState({
            ...this.state,
            ...state
        });

    }

    render() {
        return (
            <RootContext.Provider value={this.state}>
                {this.props.children}
            </RootContext.Provider>
        );
    }
}

export default RootStateProvider;