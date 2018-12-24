import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
export default class Redirection extends React.Component {
  constructor(props) {
    super(props);
    console.log("redirection ctor");

  }
  componentDidMount(){
    console.log("here mount");
    fetch('/redirection/', { credentials: 'same-origin' })
  }
  render(){
    return(
      <div>hello</div>
    )
  }


}
