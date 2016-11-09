import React, {Component} from 'react';
import './App.css';

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
        let values = [];
        let repeats = {};
        let hasRepeats = false;

        for (let i = 1; i < this.props.module; i += 1) {
            const next = Math.pow(this.props.generator, i) % this.props.module;

            if (repeats[next]) {
                hasRepeats = true;
            }
            repeats[next] = true;

            if (i < this.props.limit) {
                values.push(next);
            }
            else {
                break;
            }
        }

        const rows = values.map(function (value, i) {
            return <ValueRow value={value} key={i}/>
        });

        return (
            <div>
                {hasRepeats &&
                    <div>Has repeats.</div>}
                {rows}
            </div>
        );
    }
}

class CircleIDsGenerator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            module: 7,
            generator: 3,
            limit: 1000,
        };
    }

    changeHandler = (event) => {
        this.setState({
            [event.target.id]: event.target.value,
        });
    };

    render() {
        return (
            <form className="generator">
                <LabeledInput
                    id="module"
                    label="Module"
                    value={this.state.module}
                    onChange={this.changeHandler}
                />
                <LabeledInput
                    id="generator"
                    label="Generator"
                    value={this.state.generator}
                    onChange={this.changeHandler}
                />
                <LabeledInput
                    id="limit"
                    label="Limit"
                    value={this.state.limit}
                    onChange={this.changeHandler}
                />
                <Output
                    module={this.state.module}
                    generator={this.state.generator}
                    limit={this.state.limit}
                />
            </form>
        );
    }
}

class App extends Component {
    render() {
        return (
            <CircleIDsGenerator />
        );
    }
}

export default App;
