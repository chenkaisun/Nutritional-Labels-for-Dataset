import React from 'react';
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
