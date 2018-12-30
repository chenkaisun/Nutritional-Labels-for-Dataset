import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import ReactTable from "react-table";
import matchSorter from 'match-sorter';
import { Graph } from 'react-d3-graph';
import {
  withScreenSize,
} from '@data-ui/histogram';


export default class FunctionalDependency extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      setted:false,
    }
  }
  componentDidMount(){
    fetch('/api/multi_fd/', { credentials: 'same-origin' })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
          console.log('multi fd get data');
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
    console.log("multi fd render");
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
     <div>
       <Graph
           id="graph-id2" // id is mandatory, if no id is defined rd3g will throw an error
           data={dat}
           config={myConfig}
       />;
     </div>
   )


  }
}
