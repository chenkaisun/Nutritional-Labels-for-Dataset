import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import ReactTable from "react-table";
import matchSorter from 'match-sorter';
import HeatMap from 'react-heatmap-grid';
import * as d3 from "d3";
import {
  withScreenSize,
} from '@data-ui/histogram';


export default class Correlation extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      setted:false,
    }
  }
  componentDidMount(){
    fetch('/api/correlation/', { credentials: 'same-origin' })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
          console.log('correlations get data');
          this.setState({
            xlabs:data.xlabs,
            ylabs:data.ylabs,
            correlations:data.correlations,

            setted:true,
          });
          console.log(data.correlations);
        }
      )
      .catch(error => console.log(error));// eslint-disable-line no-console
  }
  render(){
    if(!this.state.setted) {
      return("");
    }
    console.log("correlations render");
   //  let data = this.state.correlations.map((item) =>{
   //      let sp=item.split("=>");
   //      return(
   //        {cola:sp[0], colb:sp[1]}
   //      );
   //    }
   //  );
   //  let columns = [{
   //    Header: "attribute --- protected attribute",
   //           id: "cola",
   //           accessor: d => d.cola,
   //           filterMethod: (filter, rows) =>
   //             matchSorter(rows, filter.value, { keys: ["cola"] }),
   //           filterAll: true
   //   },
   //   {
   //     Header: "Correlation coefficient",
   //            id: "colb",
   //            accessor: d => d.colb,
   //            filterMethod: (filter, rows) =>
   //              matchSorter(rows, filter.value, { keys: ["colb"] }),
   //            filterAll: true
   //   },
   // ];
    return(
      <div className="entry">
        <HeatMap
    xLabels={this.state.xlabs}
    yLabels={this.state.ylabs}
     xLabelsLocation={"bottom"}
     xLabelWidth={10}
     squares
    data={this.state.correlations}
  />
      </div>
    )

  }
}
