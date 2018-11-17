import React from "react";
import Label from './label';
import { Link } from 'react-router-3';
import VirtualizedSelect from 'react-virtualized-select';
export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options_full : [
        { label: "Loading...", value: 0 },
      ],
      options_numeric : [
        { label: "Loading...", value: 0 },
      ],
      selectValue0: {label: "Loading...", value: 0},
      selectValue1: {label: "Loading...", value: 0},
      selectValue2: {label: "Loading...", value: 0},
      seted:false,
      selected0:false,
      selected1:false,
      selected2:false,
    }
  }
  componentWillMount(){
    fetch('/api/get_colnames/', { credentials: 'same-origin' })
      .then((response) => {
        console.log("home then");

        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        console.log("home data");
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
            console.log(`received colnames ${data.colnames}`);
            console.log(`received numeric_colnames ${data.numeric_colnames}`);
            let templist_colnames=[];
            let templist_numeric_colnames=[];

            for (let i = 0; i < data.colnames.length; i++) {
                let tempdict={};
                tempdict['label']=data.colnames[i];
                tempdict['value']=i;
                templist_colnames.push(tempdict);
            }
            for (let i = 0; i < data.numeric_colnames.length; i++) {
                let tempdict={};
                tempdict['label']=data.numeric_colnames[i];
                tempdict['value']=i;
                templist_numeric_colnames.push(tempdict);
            }
            this.setState({
              seted:true,
              options_full: templist_colnames,
              options_numeric: templist_numeric_colnames,
              selectValue0: {label: "Choose a variable", value: templist_colnames[0]['value']},
              selectValue1: {label: "Choose the 1st variable", value: templist_numeric_colnames[0]['value']},
              selectValue2: {label: "Choose the 2nd variable", value: templist_numeric_colnames[0]['value']},
            });
        }
      })
      .catch(error => console.log(error));// eslint-disable-line no-console
  }

  render() {
    if( false){
      console.log("seted not seted");
        return (<div></div>);
    } else{
    console.log("home render");
    return (<div>
      {this.state.seted?
      <div>
        <div className="inline">
        <div className="stitle">SingleColumn Analysis</div>

        <span className="sinline">
          <VirtualizedSelect
            options={this.state.options_full}
            onChange={(selectValue) => {
              let tmp=this.state;
              tmp['selectValue0']=selectValue;
              tmp['selected0']=true;
              console.log(`changed!!! now selectedValue is ${selectValue.label} ${selectValue.value}`);
              this.setState(tmp);
              }
            }
            value={this.state.selectValue0}
          />
        </span>

        { this.state.selected0 ? (
          <div>
            <Label column_class="single_column" url='/api/' colname={this.state.selectValue0.label} />
          </div>
        ):('')
        }
      </div>
      <div className="minline">
      </div>
    <div className="inline">
        <div className="stitle">MultiColumn Analysis</div>
        <span className="sinline">
          <VirtualizedSelect
            options={this.state.options_numeric}
            onChange={(selectValue) => {
              let tmp=this.state;
              tmp['selectValue1']=selectValue;
              tmp['selected1']=true;
              console.log(`changed!!! now selectedValue is ${selectValue.label} ${selectValue.value}`);
              this.setState(tmp);
              }
            }
            value={this.state.selectValue1}
          />
        </span>
        <span className="sinline">
          <VirtualizedSelect
            options={this.state.options_numeric}
            onChange={(selectValue) => {
              let tmp=this.state;
              tmp['selectValue2']=selectValue;
              tmp['selected2']=true;
              console.log(`changed!!! now selectedValue is ${selectValue.label} ${selectValue.value}`);
              this.setState(tmp);
              }
            }
            value={this.state.selectValue2}
          />
        </span>


        <div>
        { this.state.selected1 && this.state.selected2 ? (
          <div>
            <Label key={`${this.state.selectValue1.label}${this.state.selectValue2.label}`} column_class="scatterplot" url='/api/' colname0={this.state.selectValue1.label} colname1={this.state.selectValue2.label} />
            <p></p>
        </div>
        ):('')
        }
        </div>

        <Label column_class="multi_column" url='/api/'/>
  </div>
    </div>
  :<div> </div>}</div>
    );
  }
  }

}
