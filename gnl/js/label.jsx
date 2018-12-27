import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import MultiBasic from './multi_basic';
import Correlation from './correlation';
import FunctionalDependency from './functional_dependency';
import AssociationRule from './association_rule';
import SingleColumn from './single_column';
import Coverage from './coverage';
import Select from 'react-select';
import ReactTooltip from 'react-tooltip';

// import Entry from './entry';
// import InfiniteScroll from 'react-infinite-scroll-component'

export default class Label extends React.Component {
  constructor(props) {
  // Runs when an instance is creazted.
  // Initialize mutable state here
  // Initialize mutable state
    super(props);
    console.log("Label ctor");
    this.handleClick = this.handleClick.bind(this);

    // let widget_currentValues=this.props["location"]["state"]['widget_currentValues'];
    // let protected_currentValues=this.props["location"]["state"]['protected_currentValues'];
    //
    this.state={
      widget_options:[
        {label:"Top-K Correlations", value:1},
        {label:"Functional Dependencies", value:2},
        {label:"Association Rules", value:3},
        {label:"Maximal Uncovered Patterns", value:4},
      ],
      additional:[],
        // has_Correlation:false,
        // has_FunctionalDependency:false,
        // has_AssociationRule:false,
        // has_Coverage:false,
        // has_SingleColumn: this.props["location"]["state"]['is_single_column'],
    }
    // for (let i=0;i<widget_currentValues.length;++i){
    //   if(widget_currentValues[i]['value']==1) {
    //     this.state['has_Correlation']=true;
    //   } else if(widget_currentValues[i]['value']==2) {
    //     this.state['has_FunctionalDependency']=true;
    //   } else if(widget_currentValues[i]['value']==3) {
    //     this.state['has_AssociationRule']=true;
    //   } else if(widget_currentValues[i]['value']==4) {
    //     this.state['has_Coverage']=true;
    //   }
    // }
    //
    // if(!this.props["location"]["state"]["is_manually_widgets"]){
    //   this.state={
    //       has_Correlation:true,
    //       has_FunctionalDependency:true,
    //       has_AssociationRule:true,
    //       has_Coverage:true,
    //       has_SingleColumn:this.props["location"]["state"]['is_single_column'],
    //   }
    // }
    // if(protected_currentValues.length==0){
    //   this.state['has_Correlation']=false;
    // }

  }

  handleClick(e){
    e.preventDefault();
    let tmp=this.state;
    let i=0;
    for(;i<tmp["widget_currentValues"].length;i++){
      if(tmp["widget_currentValues"][i]["label"]=="Top-K Correlations"){
        tmp.additional.push(
          <div id="correlation" className="vis">
            <h1><strong>Correlations</strong></h1>
            <p>Here you can see all the columns in the dataset, and you can select
              columns you need to see more analysis about them</p>
            <div className="frame">
              <div id="diagramCorrelations" className='diagram'> </div>
              <h4 id="diagramScatterPlotName" className='diagram'></h4>
              <div id="diagramScatterPlot" className='diagram'> </div>
            </div>
          </div>
        );
      }
      else if(tmp["widget_currentValues"][i]["label"]=="Functional Dependencies"){
        tmp.additional.push(
          <div id="fds" className="vis">
            <h1><strong>Functional Dependencies</strong></h1>
            <p>Functional dependency is a relationship that exists when one attribute uniquely determines another attribute.</p>
            <p>Here you can see all functional dependencies observed in the dataset. You can drag the nodes apart to see relationships and patterns.</p>
            <div id="visFunctionalDep" className="frame">
            </div>
          </div>
        );
      }
      else if(tmp["widget_currentValues"][i]["label"]=="Association Rules"){
        tmp.additional.push(
          <div id="ars" className="vis">
            <h1><strong>Association Rules</strong></h1>
            <p>Here you can see all the columns in the dataset, and you can select
              columns you need to see more analysis about them</p>
            <div id="ars_vis" className="frame">
                <div>
                  <AssociationRule key={3}   />
                  <hr/>
                </div>
              <div><img src="/static/img/association-rules.png"/></div>
            </div>
          </div>
        );
      }
      else {
        tmp.additional.push(
          <div id="mups" className="vis">
            <h1><strong>Uncovered Patterns</strong></h1>
            <p>Here you can see all the columns in the dataset, and you can select
              columns you need to see more analysis about them</p>
            <div className="frame">
              <div id="mups_vis"></div>
            </div>
          </div>
        );
      }
    }
    this.setState(tmp)
    console.log("set new widgets");

    $(this.refs.reference).html(
      loadRawData()
    );
     // loadRawData();
  }
  // componentDidMount(){
  //   // loadRawData();
  //   $(this.refs.reference).html(
  //     loadRawData()
  //   );
  // }


  render() {
    const CustomClearText = () => 'clear all';
    const ClearIndicator = (props) => {
      const { children = <CustomClearText/>, getStyles, innerProps: { ref, ...restInnerProps } } = props;
      return (
        <div {...restInnerProps} ref={ref} style={getStyles('clearIndicator', props)}>
          <div style={{ padding: '0px 5px' }}>
            {children}
          </div>
        </div>
      );
    };
    const ClearIndicatorStyles = (base, state) => ({
      ...base,
      cursor: 'pointer',
      color: state.isFocused ? 'blue' : 'black',
    });
    // loadRawData();
    // $(this.refs.reference).html(
    //   loadRawData()
    // );
    return(
      <div ref="reference">
        <div className="left_column">
          <div className="column_filter" id="filters">
              <div className="filtertitle">Columns</div>
              <p className="filename">RecidivismData_Original.csv</p>
              <div id="nominal_group">
                <div className="groupname">Nominal</div>
                <a id="nominal_change" className="change">-</a>
                <div id="nominal" style={{display:'block'}}></div>
              </div>
              <div id="ordinal_group">
                <div className="groupname">Ordinal</div>
                <a id="ordinal_change" className="change">-</a>
                <div id="ordinal" style={{display:'block'}}></div>
              </div>
              <div id="quantitative_group">
                <div className="groupname">Quantitative</div>
                <a id="quantitative_change" className="change">-</a>
                <div id="quantitative" style={{display:'block'}}></div>
              </div>

          </div>
          <div><a href="#overview" className="tab">Data Overview</a></div>
          <div><a href="#correlation" className="tab">Correlations</a></div>
          <div><a href="#fds" className="tab">Functional Dependences</a></div>
          <div><a href="#mups" className="tab">Uncovered Patterns</a></div>
          <div><a href="#ars" className="tab">Association Rules</a></div>
        </div>

        <div className="right_column">
          <div id="overview" className="vis">
            <h1><strong>Data Overview</strong></h1>
            <p>Here you can see all the columns in the dataset, and you can select
              columns you need to see more analysis about them</p>
            <div className="frame" id="ov">
              <div className="ov_label_title">
                <h2>Quantitative Data Distribution</h2>
                <p>Quantitative Attributes: 17</p>
              </div>

              <div className="ov_row_head">
                <span className="ov_cell attr">Attribute Name</span>
                <span className="ov_cell hg">Histogram</span>
                <span className="ov_cell max">Max</span>
                <span className="ov_cell min">Min</span>
                <span className="ov_cell mean">Mean</span>
                <span className="ov_cell nul">Null Entries</span>
                <span className="ov_cell uniq">Unique Entries</span>
              </div>
            </div>
          </div>

          <div id="fds" className="vis">
            <h1><strong>Functional Dependencies</strong></h1>
            <p>Functional dependency is a relationship that exists when one attribute uniquely determines another attribute.</p>
            <p>Here you can see all functional dependencies observed in the dataset. You can drag the nodes apart to see relationships and patterns.</p>
            <div id="visFunctionalDep" className="frame">
            </div>
          </div>
          <div id="mups" className="vis">
            <h1><strong>Uncovered Patterns</strong></h1>
            <p>Here you can see all the columns in the dataset, and you can select
              columns you need to see more analysis about them</p>
            <div className="frame">
              <div id="mups_vis"></div>
            </div>
          </div>
          <div id="ars" className="vis">
            <h1><strong>Association Rules</strong></h1>
            <p>Here you can see all the columns in the dataset, and you can select
              columns you need to see more analysis about them</p>
            <div id="ars_vis" className="frame">
                <div>
                  <AssociationRule key={3}   />
                  <hr/>
                </div>
              <div><img src="/static/img/association-rules.png"/></div>
            </div>
          </div>

          {this.state.additional.length>0?
            <div>{this.state.additional}</div>:""
          }

          <div id="additional_widgets" className="vis">
            <h1><strong>Add More widgets</strong></h1>
            <p>Add another widget</p>
            <div className="frame">
              <div id="mups_vis">
                <span>
                  <button onClick={this.handleClick}> + </button>
                    <Select
                      required
                      closeMenuOnSelect={false}
                      components={{ ClearIndicator }}
                      styles={{ clearIndicator: ClearIndicatorStyles }}
                      defaultValue={[]}
                      isMulti
                      onChange={(opt)=>{
                          let tmp=this.state;
                          tmp["widget_currentValues"]=opt
                          console.log("widget_currentValues");
                          this.setState(tmp);
                        }
                      }
                      simpleValue
                      options={this.state.widget_options} />

                </span>


              </div>
            </div>
          </div>
        </div>

      </div>

    )
    // return (
    //   <div>
    //   <div className="scontainer"></div>
    //   <div className="container">
    //     <div className="label">
    //       {this.state.has_SingleColumn?
    //         (<div>
    //           <SingleColumn key={4}  />
    //           <hr/>
    //         </div>):""
    //       }
    //
    //       {!this.state.has_SingleColumn?
    //         (<div>
    //           <MultiBasic key={0}  />
    //           <hr/>
    //         </div>):""
    //       }
    //       {!this.state.has_SingleColumn&&this.state.has_Correlation?
    //         (<div>
    //           <Correlation key={1}   />
    //           <hr/>
    //         </div>):""
    //       }
    //
    //       {!this.state.has_SingleColumn&&this.state.has_FunctionalDependency?
    //         (<div>
    //           <FunctionalDependency key={2}   />
    //           <hr/>
    //         </div>):""
    //       }
    //       {!this.state.has_SingleColumn&&this.state.has_AssociationRule?
    //         (<div>
    //           <AssociationRule key={3}   />
    //           <hr/>
    //         </div>):""
    //       }
    //
    //
    //     </div>
    //   </div>
    //   <div className="scontainer"></div>
    //   </div>
    // );
  }
}
// Label.propTypes = {
//   url: PropTypes.string.isRequired,
// };

// {!this.state.has_SingleColumn&&this.state.has_Coverage?
//   (<div>
//     <Coverage key={4}   />
//     <hr/>
//   </div>):""
// }
