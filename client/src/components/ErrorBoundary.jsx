import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="page">
          <div className="panel">
            <p className="eyebrow">Startup error</p>
            <h1>Something blocked the app from loading.</h1>
            <p className="notice error">{this.state.error.message}</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
