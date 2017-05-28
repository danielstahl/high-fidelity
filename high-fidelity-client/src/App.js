import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import {
  Label
} from 'react-bootstrap';

class TreeTest extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onItemClick = this.onItemClick.bind(this);
  }

  componentDidMount() {
    this.onItemClick("genre", "classical");
  }

  onItemClick(type, slugs) {
    fetch('http://localhost:8080/composer/' + type + '/' + slugs)
    .then((result) => {
      return result.json();
    })
    .then((result) => {
      this.setState({item: result.currentItem, children: result.children, parent: result.parent})
    });
  }

  render() {
    return(
      <div className="container">
        <ParentItem parent={this.state.parent} item={this.state.item} onItemClick={this.onItemClick}/>
        <CurrentItem item={this.state.item} onItemClick={this.onItemClick}/>
        <ChildrenItem children={this.state.children} onItemClick={this.onItemClick}/>
      </div>
    );
  }
}

class CurrentItem extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    if(this.props.item) {
      this.props.onItemClick(this.props.item.tags.type[0], this.props.item.slugs);
    }
  }

  render() {
    let item;

    if(this.props.item) {
      item = (
        <h1><small>{this.props.item.tags.type[0]}</small> {this.props.item.name}</h1>
      );
    }

    return(
      <div className="row">
        {item}
      </div>
    );
  }
}

class ParentItem extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    if(this.props.item) {
      this.props.onItemClick(this.props.parent.tags.type[0], this.props.parent.slugs);
    }
  }

  render() {
    let parent;
    let currentItem;

    if(this.props.parent) {
      parent = (<li><a href="#" onClick={this.handleClick}>{this.props.parent.name}</a></li>);
    }

    if(this.props.item) {
      currentItem = (<li className="active">{this.props.item.name}</li>);
    }

    return (
      <div className="row">
        <ol className="breadcrumb">
          {parent}
          {currentItem}
        </ol>
      </div>
    );
  }
}

class ChildItem extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    if(this.props.item) {
      this.props.onItemClick(this.props.item.tags.type[0], this.props.item.slugs);
    }
  }

  render() {
    return(
      <div>
        <dt><a href="#" onClick={this.handleClick}>{this.props.item.name}</a></dt>
        <dd>{this.props.item.tags.type[0]}</dd>
      </div>
    );
  }
}

class ChildrenItem extends Component {
  
  render() {
    let childrenItems;
    if(this.props.children) {
      childrenItems = (this.props.children.map((childItem) =>
        <ChildItem item={childItem} onItemClick={this.props.onItemClick}/>
      ));
    }

    return(
      <div className="row">
        <dl>
          {childrenItems}
        </dl>
      </div>
    );
  }
}

class Home extends Component {
  render() {
    return (
        <div className="container">
          <div>
            <h2>Welcome to High Fidelity</h2>
            <div>Click the button to logg in</div>
            <button onClick={this.handlelogin}>login</button>
          </div>
        </div>
    );
  }

  handlelogin() {
    var ACCOUNTS_BASE_URL = 'https://accounts.spotify.com';
    var CLIENT_ID = '1b24de0b94324459b855aa136d301949';
    var REDIRECT_URI = 'http://localhost:8080/spotify-login-callback';

    var scopes = [];
    var url = ACCOUNTS_BASE_URL + '/authorize?client_id=' + CLIENT_ID
           + '&redirect_uri=' + encodeURIComponent(REDIRECT_URI)
           + '&scope=' + encodeURIComponent(scopes.join(' '))
           + '&response_type=code';

    var w = window.location.href = url;
    return false;
  };
}

const LoggedInHome = ({match}) => (
    <div className="container">
      <h2>Welcome to High Fidelity</h2>
      <div>You are logged in as {match.params.userid}</div>
    </div>
)

const MainRouter = () => (
  <Router>
    <div className="containter">
      <Route exact path="/" component={Home}/>
      <Route path="/logged-in/:userid" component={LoggedInHome}/>
      <Route path="/tree-test" component={TreeTest}/>
    </div>
  </Router>
)


export default MainRouter;
