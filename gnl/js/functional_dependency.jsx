import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import ReactTable from "react-table";
import matchSorter from 'match-sorter';
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
            fds:data.fds,
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
    let data = this.state.fds.map((item) =>{
        let sp=item.split("=>");
        return(
          {cola:sp[0],non:"", colb:sp[1]}
        );
      }
    );
    let columns = [{
      Header: "Column A",
             id: "cola",
             accessor: d => d.cola,
             filterMethod: (filter, rows) =>
               matchSorter(rows, filter.value, { keys: ["cola"] }),
             filterAll: true
     },
     {
       Header: "=>",
              id: "non",
              accessor: d => d.non,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["non"] }),
              filterAll: true
     },
     {
       Header: "Column B",
              id: "colb",
              accessor: d => d.colb,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["colb"] }),
              filterAll: true
     },
   ];

   ///just pick1
   return(
     <div className="entry">
       <div><strong> Functional Dependencies</strong>: </div>
         <ReactTable
             data={data}
             columns={columns}
             defaultPageSize={2}
             filterable
             defaultFilterMethod={(filter, row) =>
                 String(row[filter.id]) === filter.value}

             className="-striped -highlight"
           />
     </div>
   )


  }
}
