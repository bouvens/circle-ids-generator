import React, {Component} from 'react';
import './App.css';

const PARAMS = {
    module: 7,
    generator: 3,
    values: [3, 2, 6, 4, 5, 1],
};

class LabeledInput extends Component {
    render() {
        return (
            <div>
                <label htmlFor={this.props.label}>{this.props.label}</label>
                <input id={this.props.label} value={this.props.value}/>
            </div>
        );
    }
}

class ValueRow extends Component {
    render() {
        return <p>{this.props.value}</p>;
    }
}

class Output extends Component {
    render() {
        const rows = this.props.values.map(function (value, i) {
            return <ValueRow value={value} key={i}/>
        });

        return (
            <p>
                {rows}
            </p>
        );
    }
}

class CircleIDsGenerator extends Component {
    render() {
        return (
            <form>
                <LabeledInput label="module" value={this.props.params.module}/>
                <LabeledInput label="generator" value={this.props.params.generator}/>
                <Output values={this.props.params.values}/>
            </form>
        );
    }
}

class App extends Component {
    render() {
        return (
            <CircleIDsGenerator params={PARAMS}/>
        );
    }
}

export default App;
