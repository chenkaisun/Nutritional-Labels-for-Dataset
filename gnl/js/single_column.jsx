import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Bplot from './bplot';
import Hgram from './hist';
import {
  withScreenSize,
} from '@data-ui/histogram';
import ReactTable from "react-table";


export default class SingleColumn extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      setted:false,
      isnumeric:true,
      uniqueness:0,
      basic_type:'',
      number_of_nulls:0,
      max:100,
      min:0,
      q1:0,
      Median:0,
      q1:0,
      column:[0,1],
      // options: { fillColor: '#4d78bc', strokeColor: '#4d78bc' },
    }
  }
  componentDidMount(){
    fetch('/api/single_column/', { credentials: 'same-origin' })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
          console.log('single basic get data');
          let temp_dict;
          if(data.isnumeric){
            temp_dict={
              uniqueness:data.uniqueness.toFixed(2),
              basic_type:data.basic_type,
              number_of_nulls:data.number_of_nulls,
              setted:true,
              isnumeric:data.isnumeric,
              max:data.max.toFixed(3),
              min:data.min.toFixed(3),
              mean:data.mean.toFixed(3),
              q1:data.Q1.toFixed(3),
              Median:data.Median.toFixed(3),
              q3:data.Q3.toFixed(3),
              column:data.column,
            };
          } else{
            temp_dict={
              uniqueness:data.uniqueness.toFixed(2),
              basic_type:data.basic_type,
              number_of_nulls:data.number_of_nulls,
              isnumeric:data.isnumeric,
              column:data.column,
              setted:true,
            };
          }
          this.setState(temp_dict);

        }
      )
      .catch(error => console.log(error));// eslint-disable-line no-console
  }
  render(){
    if(this.state.setted){
      console.log("single render");
      // for numeric
      let all_same=true;
      if(this.state.isnumeric){
        for (let i of this.state.column){
          if (i != this.state.column[0]){
            all_same=false;
          }
        }
      }
      return(
        <div>
          <div className="entry">
            <strong>Number of null entries</strong> : {this.state.number_of_nulls} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              { this.state.isnumeric ? (
                <span>
                  <strong>Max</strong>: {this.state.max} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <strong>Min</strong>: {this.state.min} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <strong>Mean</strong>: {this.state.mean} &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                  </span>
              ):('')
              }
            <strong>Basic type</strong>: {this.state.basic_type} &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <strong>Uniqueness (number of distinct value divided by num rows)</strong>: {this.state.uniqueness} &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
          </div>



          { !this.state.isnumeric?(
            <div className="entry">
              <hr/>
              <div> <p></p></div>
              <strong>Histogram</strong>
              <Hgram data={this.state.column} isnumeric={this.state.isnumeric}/>
            </div>
          ):  (<div>{!all_same ? (
            <div className="entry">
              <hr/>
              <strong>Histogram</strong>
              <Hgram data={this.state.column} isnumeric={this.state.isnumeric}/>
            </div>
          ):(<div><h2>All entries have the value {this.state.column[0]}</h2></div>)
        }</div>) }
        </div>
      );
    }
    return("")


  }
}
