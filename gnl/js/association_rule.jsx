import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import ReactTable from "react-table";
import matchSorter from 'match-sorter';
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
            ars:data.ars,
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


    console.log("multi ar render");
    let data=[];
    for(let item of this.state.ars){
      let sp=item.split("=>");
      if (typeof sp[0] != 'undefined' && typeof sp[1] != 'undefined' &&sp[0]&&sp[1] && sp[0].trim()!="" && sp[1].trim()!="") {
        console.log("pushed in");
        data.push({cola:sp[0],non:"", colb:sp[1]})
      }
    }
    let columns = [{
      Header: "Entry A",
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
       Header: "Entry B",
              id: "colb",
              accessor: d => d.colb,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["colb"] }),
              filterAll: true
     },
   ];
   return(
     <div className="entry">
       <div><strong> Association Rules</strong>: </div>
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
   );

  }
}
