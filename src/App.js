import React, { PropTypes } from 'react'
import BigNumber from 'bignumber.js'
import './App.css'

const DEFAULTS = {
    module: 7,
    generator: 3,
    idsLimit: 1000,
    base: 36,
    timeLimit: 3,
}

const SETTERS = [
    {
        module: 7,
        generator: 3,
    },
    {
        module: 11,
        generator: 7,
    },
    {
        module: 2176782317,
        generator: 3,
    },
    {
        module: 365615844006241,
        generator: 3,
    },
    {
        module: 365615844006241,
        generator: 365615844002993,
    },
]

const IDS = {
    module: 'module',
    generator: 'generator',
    idsLimit: 'idsLimit',
    base: 'base',
    timeLimit: 'timeLimit',
}

const LabeledInput = (props) => (
    <div className="labeled-input">
        <label htmlFor={props.id}>{props.label}: </label>
        <input
            id={props.id}
            value={props.value || null}
            onChange={props.onChange}
        />
    </div>
)

LabeledInput.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
}

const ValueRow = (props) => (
    <div className="value-row">{props.value}</div>
)

ValueRow.propTypes = {
    value: PropTypes.string.isRequired
}

const Output = (props) => {
    /* global performance */
    const startTime = performance.now()
    const values = []
    const repeats = {}
    let timeLimit = false
    let hasRepeats = false
    let i = 1

    while (i < props.module) {
        const next = new BigNumber(props.generator)
            .pow(i)
            .mod(props.module)
            .toNumber()

        if (repeats[next]) {
            hasRepeats = true
        }
        repeats[next] = true

        if (i <= props.idsLimit) {
            values.push(next)
        } else {
            break
        }

        if ((performance.now() - startTime) / 1000 > props.timeLimit) {
            timeLimit = true
            break
        }

        i += 1
    }

    const rows = values.map((value, index) => {
        const converted = value.toString(Math.max(props.base, 2))

        return <ValueRow value={converted} key={index}/>
    })

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
    )
}

Output.propTypes = {
    module: PropTypes.number,
    generator: PropTypes.number,
    idsLimit: PropTypes.number,
    base: PropTypes.number,
    timeLimit: PropTypes.number,
}

const Setter = (props) => (
    <a tabIndex={props.key + 1} className="setter" onClick={props.onClick(props.module, props.generator)}>
        <span>Set module={props.module} and generator={props.generator}</span>
    </a>
)

Setter.propTypes = {
    module: PropTypes.number,
    generator: PropTypes.number,
    key: PropTypes.number,
    onClick: PropTypes.func,
}

class CircleIdsGenerator extends React.Component {
    constructor (props) {
        super(props)
        this.state = DEFAULTS
        this.setters = SETTERS.map((setter, index) => <Setter
            module={setter.module}
            generator={setter.generator}
            onClick={this.setHandler}
            key={index}
        />)
    }

    static validate (id, value) {
        function range (number, min = number, max = number) {
            let ranged = number

            ranged = Math.max(ranged, min)
            ranged = Math.min(ranged, max)

            return ranged
        }

        let validated = parseInt(value, 10) || 1

        while (validated[0] === '0') {
            validated = String(validated).slice(1)
        }
        switch (id) {
            case IDS.base:
                validated = range(validated, 1, 36)
                break
            default:
                validated = range(validated, 1)
        }

        return String(validated).slice(0, 15) || '1'
    }

    changeHandler = (event) => {
        this.setState({
            [event.target.id]: CircleIdsGenerator.validate(event.target.id, event.target.value),
        })
    }

    setHandler = (module, generator) => () => {
        this.setState({
            module,
            generator,
        })
    }

    render () {
        return (
            <form className="generator">
                {this.setters}
                <LabeledInput
                    id={IDS.module}
                    label="Module"
                    value={this.state.module}
                    onChange={this.changeHandler}
                />
                <LabeledInput
                    id={IDS.generator}
                    label="Generator"
                    value={this.state.generator}
                    onChange={this.changeHandler}
                />
                <LabeledInput
                    id={IDS.base}
                    label="Base"
                    value={this.state.base}
                    onChange={this.changeHandler}
                />
                <LabeledInput
                    id={IDS.idsLimit}
                    label="ID's limit"
                    value={this.state.idsLimit}
                    onChange={this.changeHandler}
                />
                <LabeledInput
                    id={IDS.timeLimit}
                    label="Time limit"
                    value={this.state.timeLimit}
                    onChange={this.changeHandler}
                />
                <Output
                    module={+this.state.module}
                    generator={+this.state.generator}
                    idsLimit={+this.state.idsLimit}
                    base={+this.state.base}
                    timeLimit={+this.state.timeLimit}
                />
            </form>
        )
    }
}

const App = () => (
    <CircleIdsGenerator/>
)

export default App
