import React from 'react';
// import PropTypes from 'prop-types';
// import ReactDOM from 'react-dom';
import ReactTable from "react-table";
import matchSorter from 'match-sorter';
import {
  withScreenSize,
} from '@data-ui/histogram';


export default class Representatives extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      setted: false,
    }
  }
  componentDidMount() {
    fetch('/api/repr/', { credentials: 'same-origin' })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        console.log('correlations get data');
        this.setState({
          correlations: data.correlations,
          setted: true,
        });
      }
      )
      .catch(error => console.log(error));// eslint-disable-line no-console
  }
  render() {
    if (!this.state.setted) {
      return ("");
    }
    console.log("correlations render");
    let data = this.state.correlations.map((item) => {
      let sp = item.split("=>");
      return (
        { cola: sp[0], colb: sp[1] }
      );
    }
    );
    let columns = [{
      Header: "attribute --- protected attribute",
      id: "cola",
      accessor: d => d.cola,
      filterMethod: (filter, rows) =>
        matchSorter(rows, filter.value, { keys: ["cola"] }),
      filterAll: true
    },
    {
      Header: "Correlation coefficient",
      id: "colb",
      accessor: d => d.colb,
      filterMethod: (filter, rows) =>
        matchSorter(rows, filter.value, { keys: ["colb"] }),
      filterAll: true
    },
    ];
    return (
      <div className="entry">
        <div><strong> Top-k correlations to protected attributes (Other --- Protected)</strong>: </div>

        Representatives
        <div></div>
        <ReactTable
          data={data}
          columns={columns}
          defaultPageSize={5}
          filterable
          defaultFilterMethod={(filter, row) =>
            String(row[filter.id]) === filter.value}

          className="-striped -highlight"
        />
      </div>
    )

  }
}