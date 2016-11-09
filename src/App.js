import React, {Component} from 'react';
import BigNumber from 'bignumber.js';
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
        const startTime = performance.now();
        let values = [];
        let repeats = {};
        let timeLimit = false;
        let hasRepeats = false;
        let i = 1;

        for (; i < this.props.module; i += 1) {
            const next = new BigNumber(this.props.generator)
                .pow(i)
                .mod(this.props.module)
                .toNumber();

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

            if ((performance.now() - startTime) / 1000 > this.props.time) {
                timeLimit = true;
                break;
            }
        }

        const rows = values.map((value, i) => {
            const converted = value.toString(this.props.base);

            return <ValueRow value={converted} key={i}/>
        });

        return (
            <div className="output">
                {
                    timeLimit &&
                    <div className="warning">Time limit on {i}th.</div>
                }
                {
                    hasRepeats &&
                    <div className="warning">Has repeats.</div>
                }
                {rows}
            </div>
        );
    }
}

class Setter extends Component {
    render() {
        return (
            <div className="setter" onClick={this.props.onClick(this.props.module, this.props.generator)}>
                <span>Set module={this.props.module} and generator={this.props.generator}</span>
            </div>
        )
    }
}

class CircleIDsGenerator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            module: 7,
            generator: 3,
            idsLimit: 1000,
            base: 36,
            timeLimit: 3,
        };
    }

    changeHandler = (event) => {
        this.setState({
            [event.target.id]: event.target.value,
        });
    };

    setHandler = (module, generator) => () => {
        this.setState({
            module,
            generator,
        });
    };

    render() {
        return (
            <form className="generator">
                <Setter module="7" generator="3" onClick={this.setHandler}/>
                <Setter module="2176782317" generator="3" onClick={this.setHandler}/>
                <Setter module="365615844006241" generator="3" onClick={this.setHandler}/>
                <Setter module="365615844006241" generator="365615844002993" onClick={this.setHandler}/>
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
                    id="idsLimit"
                    label="ID's limit"
                    value={this.state.idsLimit}
                    onChange={this.changeHandler}
                />
                <LabeledInput
                    id="base"
                    label="Base"
                    value={this.state.base}
                    onChange={this.changeHandler}
                />
                <LabeledInput
                    id="timeLimit"
                    label="Time limit"
                    value={this.state.timeLimit}
                    onChange={this.changeHandler}
                />
                <Output
                    module={this.state.module}
                    generator={this.state.generator}
                    limit={this.state.idsLimit}
                    base={this.state.base}
                    time={this.state.timeLimit}
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
