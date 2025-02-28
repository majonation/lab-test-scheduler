import React, { Component } from "react";

interface CounterState {
  count: number;
}

class Counter extends Component<Record<never, never>, CounterState> {
  constructor(props: Record<never, never>) {
    super(props);
    this.state = { count: 0 };
  }

  increment = () => {
    this.setState((prevState) => ({ count: prevState.count + 1 }));
  };

  render() {
    return (
      <div>
        <h1>{this.state.count}</h1>
        <button onClick={this.increment}>Increment</button>
      </div>
    );
  }
}

export default Counter;
