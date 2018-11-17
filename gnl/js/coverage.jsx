import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import ReactTable from "react-table";
import matchSorter from 'match-sorter';
import {
  withScreenSize,
} from '@data-ui/histogram';


export default class Coverage extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      setted:false,
    }
  }
  componentDidMount(){
    fetch('/api/coverage/', { credentials: 'same-origin' })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
          console.log('multi coverage get data');
          this.setState({
            mups:data.mups,
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
    console.log("multi mups render");
    let data = this.state.mups.map((item) =>{
        return(
          {cola:item}
        );
      }
    );
    let columns = [{
      Header: "uncovered patterns",
             id: "cola",
             accessor: d => d.cola,
             filterMethod: (filter, rows) =>
               matchSorter(rows, filter.value, { keys: ["cola"] }),
             filterAll: true
     },
   ];

   return(
     <div className="entry">
       <div><strong> Coverage </strong>: </div>
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
