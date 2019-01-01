import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Bplot from './bplot';
import Hgram from './hist';
import {ScatterplotChart} from 'react-easy-chart';
import ReactTable from "react-table";
import matchSorter from 'match-sorter';
import { ScatterPlot  } from '@nivo/scatterplot';
import {
  withScreenSize,
} from '@data-ui/histogram';

export default class Entry extends React.Component {
  constructor(props) {
  // Runs when an instance is created.
  // Initialize mutable state here
  // Initialize mutable state
    console.log("Entry ctor");
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

      options: { fillColor: '#4d78bc', strokeColor: '#4d78bc' },

      num_rows:0,
      num_cols:0,
      num_missing:0,
      keywords:["Loading"],

      fds:["Loading=>..."],

      ars:["Loading=>..."],
      columns:[
        {
          "id": "Testing",
          "data": [
            {
              "id": 0,
              "x": 0,
              "y": 0
            },
          ]
        }
      ]
    }
  }

  componentDidMount() {
    // Runs when an instance is added to the DOM
    // Make your first AJAX call here
    // Call REST API to get number of likes

    console.log('Entry mounting');
    fetch(this.props.the_url, { credentials: 'same-origin' })
      .then((response) => {
        console.log("response");
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        if (false) {
          if (performance.navigation.type === 2) {
            this.setState({
              next: history.state.next,
              results: history.state.results,
              seted: true,
            });
          } else {
            this.setState({
              next: data.next,
              results: data.results,
              seted: true,
            });
            history.replaceState(this.state, null, '/');
          }
        } else {
          if (this.props.column_class=='single_column' && this.props.label_type=='basic'){

            console.log('single basic get data');
            let tempdict={
              isnumeric:data.isnumeric,
              uniqueness:data.uniqueness.toFixed(2),
              basic_type:data.basic_type,
              number_of_nulls:data.number_of_nulls,
              setted:true,
            }
            console.log('received:');
            if (data.isnumeric){
                tempdict["max"]=data.max.toFixed(3);
                tempdict["min"]=data.min.toFixed(3);
                tempdict["mean"]=data.mean.toFixed(3);
            }
            this.setState(
                tempdict
            );
          } else if(this.props.label_type=='graph'){


            console.log('single graph get data');
            console.log("received column");
            let temp_dict;
            if(data.isnumeric){
              temp_dict={
                isnumeric:data.isnumeric,
                max:data.max.toFixed(3),
                min:data.min.toFixed(3),
                q1:data.Q1.toFixed(3),
                Median:data.Median.toFixed(3),
                q3:data.Q3.toFixed(3),
                column:data.column,
                setted:true,
              };
            } else{
              temp_dict={
                isnumeric:data.isnumeric,
                column:data.column,
                setted:true,
              };
            }
            this.setState(temp_dict);
          } else if(this.props.column_class=='multi_column' && this.props.label_type=='basic'){

            console.log('multi basic get data');
            this.setState({
              keywords:data.keywords,
              num_rows:data.num_rows,
              num_cols:data.num_cols,
              num_missing:data.num_missing,
              setted:true,
            });
          } else if(this.props.column_class=='multi_column' && this.props.label_type=='fd'){

            console.log('multi fd get data');
            this.setState({
              fds:data.fds,
              setted:true,
            });
          } else if(this.props.column_class=='multi_column' && this.props.label_type=='ar'){

            console.log('multi ar get data');
            this.setState({
              ars:data.ars,
              setted:true,
            });
          }else if(this.props.column_class=='scatterplot'){
            console.log('scatterplot get data');
            let column0=data.column0;
            let column1=data.column1;
            let tmp_list=[{"id": " ","data": []}];
            for (let i=0;i<column0.length;i++){
              let tmp_dict={
                "id": i,
                  "x":column0[i],
                  "y":column1[i],
              };
              tmp_list[0]["data"].push(tmp_dict);
            }
            this.setState({
              setted:true,
              columns:tmp_list,
            });
          }
        }
      })
      .catch(error => console.log(error));// eslint-disable-line no-console
  }
  render() {
    if(!this.state.setted) return('');
    if (this.props.column_class=='single_column'){
      if (this.props.label_type=='basic'){
        console.log("single basic render");
        return (
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
        );
      } else if (this.props.label_type=='graph'){

        console.log("single graph render");
        // for numeric
        let all_same=true;
        if(this.state.isnumeric){
          for (let i of this.state.column){
            if (i != this.state.column[0]){
              all_same=false;
            }
          }
        }
        console.log(this.state);
        return(


          <div>
            { this.state.isnumeric ? (
              <div className="entry">
                <strong>Boxplot</strong>
                <div></div>
                <strong>  Q1</strong>: {this.state.q1} &nbsp;&nbsp;&nbsp;
                <strong>Median</strong>: {this.state.Median} &nbsp;&nbsp;&nbsp;
                <strong>Q3</strong>: {this.state.q3}
                <Bplot min={this.state.min} max={this.state.max} data={this.state.column}/>

              </div>
            ):('')
            }

            { !this.state.isnumeric?(
              <div className="entry">
                <strong>Histogram</strong>
                <Hgram data={this.state.column} isnumeric={this.state.isnumeric}/>
              </div>
            ):  (<div>{!all_same ? (
              <div className="entry">
                <strong>Histogram</strong>
                <Hgram data={this.state.column} isnumeric={this.state.isnumeric}/>
              </div>
            ):(<div><h2>All entries have the value {this.state.column[0]}</h2></div>)
          }</div>) }
          </div>
        );
    }
  }else if (this.props.column_class=='multi_column'){
    if (this.props.label_type=='basic'){

      console.log("multi basic render");
      return(
        <div className="entry">
        <strong>Number of rows</strong>: {this.state.num_rows} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <strong>Number of columns</strong>: {this.state.num_cols} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <strong>Number of missing entries</strong>: {this.state.num_missing}
          <div></div>
          <strong>  Keywords  (sorted descendingly by frequency)</strong>: {this.state.keywords.map((keyword,i) =>
            {
              if(i==this.state.keywords.length-1){
                return (`${keyword}`)
              } else{
                return (`${keyword}, `)
              }
            }
          )}
        </div>
    );
    } else if (this.props.label_type=='fd'){
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
        return(
          <div className="entry">
            <div><strong> Functional Dependencies</strong>: </div>
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
        );
    } else if (this.props.label_type=='ar'){

      console.log("multi ar render");
      let data=[];
      for(let item of this.state.ars){
        let sp=item.split("=>");
        if (typeof sp[0] != 'undefined' && typeof sp[1] != 'undefined' &&sp[0]&&sp[1] && sp[0].trim()!="" && sp[1].trim()!="") {
          console.log("pushed in");
          data.push({cola:sp[0],non:"", colb:sp[1]})
        }
      }
      
    //   let columns = [{
    //     Header: "Entry A",
    //            id: "cola",
    //            accessor: d => d.cola,
    //            filterMethod: (filter, rows) =>
    //              matchSorter(rows, filter.value, { keys: ["cola"] }),
    //            filterAll: true
    //    },
    //    {
    //      Header: "=>",
    //             id: "non",
    //             accessor: d => d.non,
    //             filterMethod: (filter, rows) =>
    //               matchSorter(rows, filter.value, { keys: ["non"] }),
    //             filterAll: true
    //    },
    //    {
    //      Header: "Entry B",
    //             id: "colb",
    //             accessor: d => d.colb,
    //             filterMethod: (filter, rows) =>
    //               matchSorter(rows, filter.value, { keys: ["colb"] }),
    //             filterAll: true
    //    },
    //  ];

      return(
        <div className="entry">
          <div><strong> Association Rules</strong>: </div>
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
      );

  }
} else if (this.props.column_class=='scatterplot'){
    const mydata=[
    {
      "id": " ",
      "data": [
        {
          "id": 0,
          "x": 0,
          "y": 1
        },
      ]
    },
    {
      "id": "group B",
      "data": [
        {
          "id": 1,
          "x": 1,
          "y": 1
        },
      ]
    },
    {
      "id": "group C",
      "data": [
        {
          "id": 21,
          "x": 66,
          "y":4
        },
      ]
    }
  ];
  const ResponsiveS = withScreenSize(({ screenWidth}) => (
    <ScatterPlot
      width={Math.min(1000, screenWidth / 2.2)}
       height={Math.min(1000 / 1.8, screenWidth /2 / 1.8)}
      data={this.state.columns}
      margin={{
              "top": 20,
              "right":130,
              "bottom": 20,
              "left": 30
          }}
      axisBottom={{
          "orient": "bottom",
          "tickSize": 5,
          "tickPadding": 5,
          "tickRotation": 0,
          "legend": "weight",
          "legendPosition": "center",
          "legendOffset": 46
      }}
      axisLeft={{
          "orient": "left",
          "tickSize": 5,
          "tickPadding": 5,
          "tickRotation": 0,
          "legend": "size",
          "legendPosition": "center",
          "legendOffset": -60
      }}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
      theme={{
              "tooltip": {
                  "container": {
                      "fontSize": "14px"
                  }
              },
              "labels": {
                  "textColor": "#555"
              },
              "grid": {
                  "stroke": "#ccc",
                  "strokeWidth": 1,
                  "strokeDasharray": "6 6"
              }
          }}
          onClick={()=>0}
          legends={[
              {
                  "anchor": "bottom-right",
                  "direction": "column",
                  "translateX": 145,
                  "itemWidth": 100,
                  "itemHeight": 12,
                  "itemsSpacing": 5,
                  "itemTextColor": "#999",
                  "symbolSize": 12,
                  "symbolShape": "circle",
                  "effects": [
                      {
                          "on": "hover",
                          "style": {
                              "itemTextColor": "#000"
                          }
                      }
                  ]
              }
          ]}
  />
  ));
          
    console.log("scatterplot render");
      return (
      
      <div className="entry">
        <div><strong>Scatterplot Chart:</strong></div>
        <ResponsiveS >
        </ResponsiveS>
      </div>);
  }
}
}
