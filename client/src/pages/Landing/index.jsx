import React, { Component } from "react";
export class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = { hello: 1 };
  }

  increment = () => {
    console.log(Component);
    this.setState((state, _props) => ({ hello: state.hello + 1 }));
  };
  componentDidMount() {
    console.log("Component rendered");
  }
  render() {
    return (
      <>
        <h1>Landing</h1>
        <button onClick={this.increment}>INcr</button>
        <button onClick={() => console.log("click")}>
          {" "}
          Cklick {this.state.hello}{" "}
        </button>
      </>
    );
  }
}
