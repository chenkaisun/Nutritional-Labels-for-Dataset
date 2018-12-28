import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import ReactTable from "react-table";
import matchSorter from 'match-sorter';
import { Graph } from 'react-d3-graph';
import {
  withScreenSize,
} from '@data-ui/histogram';


export default class AssociationRule extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      setted:false,
    }
  }
  componentDidMount(){
    fetch('/api/multi_ar/', { credentials: 'same-origin' })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
          console.log('multi ar get data');
          this.setState({
            nodes:data.nodes,
            links:data.links,
            setted:true,
          });
        }
      )
      .catch(error => console.log(error));// eslint-disable-line no-console
  }
  render(){
    if(!this.state.setted) {
      return("");
    }


   //  console.log("multi ar render");
   //  let data=[];
   //  for(let item of this.state.ars){
   //    let sp=item.split("=>");
   //    if (typeof sp[0] != 'undefined' && typeof sp[1] != 'undefined' &&sp[0]&&sp[1] && sp[0].trim()!="" && sp[1].trim()!="") {
   //      console.log("pushed in");
   //      data.push({cola:sp[0],non:"", colb:sp[1]})
   //    }
   //  }
   //  let columns = [{
   //    Header: "Entry A",
   //           id: "cola",
   //           accessor: d => d.cola,
   //           filterMethod: (filter, rows) =>
   //             matchSorter(rows, filter.value, { keys: ["cola"] }),
   //           filterAll: true
   //   },
   //   {
   //     Header: "=>",
   //            id: "non",
   //            accessor: d => d.non,
   //            filterMethod: (filter, rows) =>
   //              matchSorter(rows, filter.value, { keys: ["non"] }),
   //            filterAll: true
   //   },
   //   {
   //     Header: "Entry B",
   //            id: "colb",
   //            accessor: d => d.colb,
   //            filterMethod: (filter, rows) =>
   //              matchSorter(rows, filter.value, { keys: ["colb"] }),
   //            filterAll: true
   //   },
   // ];
   const myConfig = {
        nodeHighlightBehavior: true,
        directed: true,
        node: {
            color: 'lightgreen',
            size: 120,
            highlightStrokeColor: 'blue'
        },
        link: {
            highlightColor: 'lightblue'
        }
    };
    const dat = {
      nodes: this.state.nodes,
  links: this.state.links
    };
   return(
     <div className="entry">
       <div><strong> Association Rules</strong>: </div>
        <Graph
            id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
            data={dat}
            config={myConfig}
        />;


     </div>
   );

  }
}
//ars:data.ars,
