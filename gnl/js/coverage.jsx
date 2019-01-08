import React from 'react';
// import PropTypes from 'prop-types';
// import ReactDOM from 'react-dom';
// import ReactTable from "react-table";
// import matchSorter from 'match-sorter';
// import {
//   withScreenSize,
// } from '@data-ui/histogram';
// import Tree from 'react-d3-tree';
import Tree from 'react-tree-graph';

import 'react-tree-graph/dist/style.css'
// import * as d3 from "d3";
// import scaleBand from "d3-scale";

export default class Coverage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      setted: false,
      tree: { "name": "None", "children": [] }
    }
  }
  componentDidMount() {
    console.log("send request");
    fetch('/api/coverage/', { credentials: 'same-origin' })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        console.log("cov received data")
        this.setState({
          tree: data.tree,
          setted: true,
        });
      }
      )
      .catch(error => console.log(error));// eslint-disable-line no-console
  }
  render() {
    console.log("cov render")
    return (
      <div className="frame">
        <Tree data={this.state.tree} height={400}
          width={400} />
      </div>
    )
  }
}
