import React, { Component } from 'react';
import NoMatch from './NoMatch';
import NavBar from './NavBar';
import Login from './Login';
import Register from './Register';
import Flash from './Flash';
import AuthRoute from './AuthRoute';
import FetchUser from './FetchUser';
import { Switch, Route } from 'react-router-dom';
import Courses from './Courses';
import { Dimmer, Loader, Segment } from 'semantic-ui-react';

class App extends Component {
  state = { loading: false };

  setLoading = (loading = false) => {
    this.setState({ loading });
  }

  render() {
    const { loading } = this.state;

    return (
      <Segment basic style={{ height: '100vh' }}>
        <Dimmer active={loading}>
          <Loader>Please Wait...</Loader>
        </Dimmer>
        <NavBar />
        <Flash />
        <FetchUser>
          <Switch>
            <Route exact path='/' render={(props) => (
              <Courses {...props} loading={loading} setLoading={this.setLoading} />
            )}/>
            <Route exact path='/courses' render={(props) => (
              <Courses {...props} loading={loading} setLoading={this.setLoading} />
            )}/>
            <AuthRoute exact path='/login' component={Login} />
            <AuthRoute exact path='/register' component={Register} />
            <Route component={NoMatch} />
          </Switch>
        </FetchUser>
      </Segment>
    );
  }
}

export default App;
