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
        <div>
          <div className="ov_row_head">
            <span className="ov_cell attr">Cardinality</span>
            <span className="ov_cell attr">Feature Dimension</span>
            <span className="ov_cell attr"># Missing Entries</span>
            <span className="ov_cell mean">Keywords (sorted descendingly by frequency)</span>
          </div>
          <div className="ov_row">
            <span className="ov_cell attr">{this.state.num_rows}</span>
            <span className="ov_cell attr">{this.state.num_cols}</span>
            <span className="ov_cell attr">{this.state.num_missing}</span>
            <span className="ov_cell mean">{this.state.keywords.map((keyword,i) =>{
                if(i==this.state.keywords.length-1){
                  return (`${keyword}`)
                } else{
                  return (`${keyword}, `)
                }
              })}</span>
          </div>
        </div>
    );

    }
    return("")


  }
}
