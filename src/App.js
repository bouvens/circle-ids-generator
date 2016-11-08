import React, {Component} from 'react';
import './App.css';

const PARAMS = {
    module: 7,
    generator: 3,
};

class LabeledInput extends Component {
    render() {
        return (
            <div className="labeled-input">
                <label htmlFor={this.props.id}>{this.props.label}: </label>
                <input
                    id={this.props.id}
                    value={this.props.value}
                    onChange={this.props.onChange}
                />
            </div>
        );
    }
}

class ValueRow extends Component {
    render() {
        return <div className="value-row">{this.props.value}</div>;
    }
}

class Output extends Component {
    render() {
        const rows = this.props.values.map(function (value, i) {
            return <ValueRow value={value} key={i}/>
        });

        return (
            <div>
                {rows}
            </div>
        );
    }
}

class CircleIDsGenerator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            module: this.props.params.module,
            generator: this.props.params.generator
        };
    }

    getValues = () => {
        let values = [];
        let repeats = {};

        for (let i = 1; i < this.state.module; i += 1) {
            const next = Math.pow(this.state.generator, i) % this.state.module;

            if (repeats[next]) {
                values.push('repeat: ' + next);
            }
            else {
                values.push(next);
            }
            repeats[next] = true;
        }

        return values;
    };

    changeHandler = (event) => {
        this.setState({
            [event.target.id]: event.target.value,
        });
    };

    render() {
        return (
            <form className="generator">
                <LabeledInput id="module" label="Module" value={this.state.module} onChange={this.changeHandler}/>
                <LabeledInput id="generator" label="Generator" value={this.state.generator} onChange={this.changeHandler}/>
                <Output values={this.getValues()}/>
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
