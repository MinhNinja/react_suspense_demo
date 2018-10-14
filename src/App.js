import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import { createCache, createResource } from 'simple-cache-provider';
import List from './components/List';

/**
 * Prepare a placeholder
 */
function Placeholder(props) {
  return (
    <React.Timeout>
      {loading => loading ? props.placeholder : props.children}
    </React.Timeout>
  )
}
/**
 * fetch detail page by Fetcher, in Kid-garden mode
 */
const cache = createCache(Symbol('CacheDemo'));

function createFetcher(fetch) {
  const res = createResource(fetch);
  return (...args) => res(cache, ...args);
}

const fetchDetailPage = createFetcher(
  () => import('./components/Detail'),
);

function DetailPageLoader(props) {
  const SinglePage = fetchDetailPage().default;
  return (
    <SinglePage {...props} />
  );
}


/**
 *  Our main actor here ;)))
 */
class App extends Component {

  state = {
    currentId: null,
    showDetail: false,
  };

  /**
   * well, fix bug `An update was suspended for longer than the timeout, but no fallback UI was provided.`
   */
  deferSetState(state) {
    ReactDOM.unstable_deferredUpdates(() => {
      this.setState(state);
    });
  }

  clickDetail = (id) =>{
    this.setState({
        currentId: id
    });
    this.deferSetState({
      showDetail: true,
    });
  }
  
  clickBack = () =>{
    this.setState({
        currentId: null,
        showDetail: false,
    });
  }

  renderDetail(id) {
    return (
      <Placeholder
        placeholder={<div>Loading planet page component</div>}
      >
        <DetailPageLoader
          id={id}
          onBackClick={this.onBackClick}
        />
      </Placeholder>
    );
  }

  renderList() {
    return (
      <Placeholder
        placeholder={<div>Loading planets...</div>}
      >
        <List onClick={this.onPlanetClick} />
      </Placeholder>
    );
  }

  render() {
    const { showDetail, currentId } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <h1>Demo for Suspense feature of React</h1>
          <img src={logo} className="App-logo" alt="logo" /> 
        </header>

        { showDetail ? this.renderDetail(currentId) : this.renderList() }

        <div className="container">
          <div className="row">
            <div className="col">
              <p>Okie sth here</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
