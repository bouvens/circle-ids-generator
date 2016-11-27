import React from 'react';
import BigNumber from 'bignumber.js';
import './App.css';

const LabeledInput = props => (
    <div className="labeled-input">
        <label htmlFor={props.id}>{props.label}: </label>
        <input
            id={props.id}
            value={props.value}
            onChange={props.onChange}
        />
    </div>
);

const ValueRow = props => (
    <div className="value-row">{props.value}</div>
);

const Output = props => {
    const startTime = performance.now();
    let values = [];
    let repeats = {};
    let timeLimit = false;
    let hasRepeats = false;
    let i = 1;

    for (; i < props.module; i += 1) {
        const next = new BigNumber(props.generator)
            .pow(i)
            .mod(props.module)
            .toNumber();

        if (repeats[next]) {
            hasRepeats = true;
        }
        repeats[next] = true;

        if (i < props.limit) {
            values.push(next);
        }
        else {
            break;
        }

        if ((performance.now() - startTime) / 1000 > props.time) {
            timeLimit = true;
            break;
        }
    }

    const rows = values.map((value, i) => {
        const converted = value.toString(props.base);

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
};

const Setter = props => (
    <div className="setter" onClick={props.onClick(props.module, props.generator)}>
        <span>Set module={props.module} and generator={props.generator}</span>
    </div>
);

class CircleIDsGenerator extends React.Component {
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

const App = () => (
    <CircleIDsGenerator />
);

export default App;
