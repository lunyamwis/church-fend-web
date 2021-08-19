import React, { Component } from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import Layout from './components/common/layout';
import { AuthProvider } from './context/auth';

class App extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <AuthProvider>

                  <Router>
                    <Layout  {...this.props} />
                  </Router>
        </AuthProvider>
      </div>
    );
  }
}

export default App;
