import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        return (<Square
            key={i}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}/>);
    }

    renderCells(rowIndex) {
        const cells = [];
        for (let cellIndex = rowIndex * 3; cellIndex < (rowIndex * 3 + 3); cellIndex++) {
            cells.push(this.renderSquare(cellIndex));
            console.log("cellIndex ", cellIndex);
        }
        return cells;
    }

    renderRows() {
        const rows = [];
        for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
            rows.push(
                <div key={rowIndex} className="board-row">{this.renderCells(rowIndex)}</div>
            );
        }
        return rows;
    }

    render() {
        return (
            <div>{this.renderRows()}</div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                    postion: null
                }
            ],
            stepNumber: 0,
            xIsNext: true,
            postionChanged: false
        };
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
            postionChanged: true
        });
    }

    setActive(clickedStep, postionChanged) {
        return `btn ${ (postionChanged && clickedStep === this.state.stepNumber)
            ? 'active'
            : ''}`;
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const postionChanged = this.state.postionChanged;

        const moves = history.map((step, move) => {
            let position = '';
            position = (step.position)
                ? (`position - row: ${step.position.row}, column: ${step.position.column}`)
                : '';
            const desc = move
                ? `Go to move # ${move} ${position}`
                : 'Go to game start';
            return (
                <li key={move}>
                    <button
                        onClick={() => this.jumpTo(move)}
                        className={this.setActive(move, postionChanged)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext
                ? 'X'
                : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} onClick={(i) => this.handleClick(i)}/>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
    handleClick(i) {
        const history = this
            .state
            .history
            .slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current
            .squares
            .slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext
            ? 'X'
            : 'O';
        this.setState({
            history: history.concat([
                {
                    squares: squares,
                    position: calculatePosition(i)
                }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            postionChanged: false
        });
    }
}

function calculateWinner(squares) {
    const lines = [
        [
            0, 1, 2
        ],
        [
            3, 4, 5
        ],
        [
            6, 7, 8
        ],
        [
            0, 3, 6
        ],
        [
            1, 4, 7
        ],
        [
            2, 5, 8
        ],
        [
            0, 4, 8
        ],
        [2, 4, 6]
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a,
            b,
            c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

function calculatePosition(i) {
    const totalColums = 3;
    const row = Math.floor(i / totalColums);
    const column = i % totalColums;
    return {row: row, column: column};
}

// ========================================

ReactDOM.render(
    <Game/>, document.getElementById('root'));
