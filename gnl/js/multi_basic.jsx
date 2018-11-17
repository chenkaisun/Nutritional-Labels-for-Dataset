import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';


export default class MultiBasic extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      setted:false,
    }
  }
  componentDidMount(){
    fetch('/api/multi_basic/', { credentials: 'same-origin' })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        console.log('multi basic get data');
        console.log();
        this.setState({
          keywords:data.keywords,
          num_rows:data.num_rows,
          num_cols:data.num_cols,
          num_missing:data.num_missing,
          setted:true,
        });

        }
      )
      .catch(error => console.log(error));// eslint-disable-line no-console
  }
  render(){
    if(this.state.setted){
      return(
        <div className="entry">
          <strong>Number of rows</strong>: {this.state.num_rows} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <strong>Number of columns</strong>: {this.state.num_cols} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <strong>Number of missing entries</strong>: {this.state.num_missing}
          <div></div>
          <strong>  Keywords  (sorted descendingly by frequency)</strong>: {this.state.keywords.map((keyword,i) =>
            {
              if(i==this.state.keywords.length-1){
                return (`${keyword}`)
              } else{
                return (`${keyword}, `)
              }
            }
          )}
        </div>
    );

    }
    return("")


  }
}
