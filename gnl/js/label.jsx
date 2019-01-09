import React from 'react';
// import PropTypes from 'prop-types';
// import ReactDOM from 'react-dom';
import MultiBasic from './multi_basic';
// import Correlation from './correlation';
import FunctionalDependency from './functional_dependency';
import AssociationRule from './association_rule';
// import SingleColumn from './single_column';
// import Coverage from './coverage';
import Select from 'react-select';
import { HashLink as Link } from 'react-router-hash-link';
import $ from 'jquery';
export default class Label extends React.Component {
  constructor(props) {
    super(props);
    console.log("label ctor");
    this.handleClick = this.handleClick.bind(this);
    // this.handleRemove = this.handleRemove.bind(this);
    let widget_currentValues = this.props["location"]["state"]['widget_currentValues'];
    let protected_currentValues = this.props["location"]["state"]['protected_currentValues'];
    // let added_widgets=[];
    this.state = {
      setted: false,
      widget_currentValues: this.props["location"]["state"]['widget_currentValues'],
      widget_options: [
        { label: "Top-K Correlations", value: 1 },
        { label: "Functional Dependencies", value: 2 },
        { label: "Association Rules", value: 3 },
        { label: "Maximal Uncovered Patterns", value: 4 },
      ],
      // cur_widget_names=["Top-K Correlations","Association Rules"],
      // cur_widgets=[],
      additional: [],
      chose_numeric: this.props["location"]["state"]['chose_numeric'],
      has_Correlation: false,
      has_FunctionalDependency: false,
      has_AssociationRule: false,
      has_Coverage: false,
      has_SingleColumn: this.props["location"]["state"]['is_single_column'],
      //this.props["location"]["state"]['is_single_column']
    }
    console.log("chose is ");
    console.log(this.state['chose_numeric']);
    console.log("single is ", this.props["location"]["state"]['is_single_column']);




    for (let i = 0; i < widget_currentValues.length; ++i) {
      if (widget_currentValues[i]['value'] == 1) {
        this.state['has_Correlation'] = true;
      } else if (widget_currentValues[i]['value'] == 2) {
        this.state['has_FunctionalDependency'] = true;
      } else if (widget_currentValues[i]['value'] == 3) {
        this.state['has_AssociationRule'] = true;
      } else if (widget_currentValues[i]['value'] == 4) {
        this.state['has_Coverage'] = true;
      }
    }

    if (!this.props["location"]["state"]["is_manually_widgets"]) {
      this.state = {
        setted: false,
        widget_currentValues: [{ label: "Top-K Correlations", value: 1 },
        { label: "Functional Dependencies", value: 2 },
        { label: "Association Rules", value: 3 },
        { label: "Maximal Uncovered Patterns", value: 4 }],
        widget_options: [
          { label: "Top-K Correlations", value: 1 },
          { label: "Functional Dependencies", value: 2 },
          { label: "Association Rules", value: 3 },
          { label: "Maximal Uncovered Patterns", value: 4 },
        ],
        additional: [],
        chose_numeric: this.props["location"]["state"]['chose_numeric'],
        has_Correlation: true,
        has_FunctionalDependency: true,
        has_AssociationRule: true,
        has_Coverage: true,
        has_SingleColumn: this.props["location"]["state"]['is_single_column'],
      }
    }


    // if (protected_currentValues.length == 0) {
    //   console.log("here");
    //   this.state['has_Correlation'] = false;
    // }
    if (this.state['has_SingleColumn']) {
      this.state['widget_options'] = [
        
        { label: "Functional Dependencies", value: 2 }
      ]
      if (protected_currentValues.length != 0) this.state["widget_options"].push({ label: "Top-K Correlations", value: 1 })
    }
  }

  handleClick(e) {
    e.preventDefault();
    let tmp = this.state;
    let i = 0;
    let added_topk = false;
    let added_coverage = false;
    let added_fd = false;
    let added_ar = false;
    for (; i < tmp["widget_currentValues"].length; i++) {
      if (tmp["widget_currentValues"][i]["label"] == "Top-K Correlations") {
        if (!tmp['has_Correlation']) added_topk = true;
        tmp['has_Correlation'] = true;
      }
      else if (tmp["widget_currentValues"][i]["label"] == "Functional Dependencies") {
        if (!tmp['has_FunctionalDependency']) added_fd = true;
        tmp['has_FunctionalDependency'] = true;
      }
      else if (tmp["widget_currentValues"][i]["label"] == "Association Rules") {
        if (!tmp['has_AssociationRule']) added_ar = true;
        tmp['has_AssociationRule'] = true;
      }
      else {
        if (!tmp['has_Coverage']) added_coverage = true;
        tmp['has_Coverage'] = true;
      }
    }
    console.log("set new widgets");
    // if (!tmp["has_SingleColumn"] && added_coverage) {
    //   $(this.refs.reference).html(
    //     loadJson("mups.json")
    //   );
    // }
    // if (tmp["has_SingleColumn"]) {
    //   console.log("in mount single col");
    //   $(this.refs.reference).html(
    //     load_single_meta()
    //   );
    // }
    if (added_fd || added_topk) {
      console.log("added cor");
      $(this.refs.reference).html(
        load_correlation()
      );
    }
    if (added_coverage) {
      console.log("added cor");
      $(this.refs.reference).html(
        load_mups()
      );
    }
    this.setState(tmp)
  }
  componentDidMount() {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    console.log("label mount", today.getMinutes() + ":" + today.getSeconds() + ":" + today.getMilliseconds())
    let tmp = this.state;
    // if(tmp["has_Coverage"]){
    //   fetch('/api/coverage/', { credentials: 'same-origin' })
    //     .then((response) => {
    //       if (!response.ok) throw Error(response.statusText);
    //       return response.json();
    //     })
    //     .then((data) => {
    //       console.log("setting cov");
    //       // $(this.refs.reference).html(
    //       //   loadJson("mups.json")
    //       // );
    //         this.setState(tmp);
    //         $(this.refs.reference).html(
    //           loadJson("mups.json")
    //         );
    //           console.log("cov jq complete");
    //       }
    //     )
    //     .catch(error => console.log(error));// eslint-disable-line no-console
    // }
    if (tmp["has_SingleColumn"]) {
      console.log("in mount single col");
      $(this.refs.reference).html(
        load_single_meta()
      );
    }
    if (tmp["has_Correlation"]) {
      console.log("in mount cor");
      $(this.refs.reference).html(
        load_correlation()
      );
    }
    if (tmp["has_Coverage"]) {
      console.log("in mount cor");
      $(this.refs.reference).html(
        load_mups()
      );
    }
    // tmp["setted"] = true;
    this.setState(tmp);
    console.log("e label mount", today.getMinutes() + ":" + today.getSeconds() + ":" + today.getMilliseconds());
  }
  render() {
    var today = new Date();
    console.log("label render", today.getMinutes() + ":" + today.getSeconds() + ":" + today.getMilliseconds())
    const CustomClearText = () => 'clear all';
    const ClearIndicator = (props) => {
      const { children = <CustomClearText />, getStyles, innerProps: { ref, ...restInnerProps } } = props;
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
    return (
      <div ref="reference">
        <div className="left_column">

          <div className="tab"><Link to="label#overview">Data Overview</Link></div>
          {this.state.has_Correlation ? <div className="tab"><Link to="label#correlation">Correlation</Link></div> : ""}
          {!this.state.has_SingleColumn && this.state.has_Coverage ? <div className="tab"><Link to="label#mups">Uncovered Patterns</Link></div> : ""}
          {this.state.has_FunctionalDependency ? <div className="tab"><Link to="label#fds">Functional Dependences</Link></div> : ""}
          {!this.state.has_SingleColumn && this.state.has_AssociationRule ? <div className="tab"><Link to="label#ars">Association Rules</Link></div> : ""}
        </div>

        <div className="right_column">
          <div id="overview" className="vis">

            <div style={{ display: "inline-block", fontSize: "32px" }}><strong>Data Overview </strong></div><div style={{ display: "inline-block", fontSize: "16px" }}>(Please wait while the widgets are rendering)</div><br />
            {this.state.has_SingleColumn && this.state.chose_numeric ?
              <div className="frame" id="ov">
                <div className="ov_row_head">
                  <span className="ov_cell attr">Attribute Name</span>
                  <span className="ov_cell hg">Histogram</span>
                  <span className="ov_cell max">Max</span>
                  <span className="ov_cell min">Min</span>
                  <span className="ov_cell mean">Mean</span>
                  <span className="ov_cell nul">Null Entries</span>
                  <span className="ov_cell uniq">Unique Entries</span>
                </div>
              </div> :
              ""
            }
            {this.state.has_SingleColumn && !this.state.chose_numeric ?
              <div><i>Histogram not provided because a non-numeric column was chosen</i></div> : ""
            }
            {!this.state.has_SingleColumn ?
              <div className="frame">
                <div className="ov_label_title">
                  <MultiBasic key={0} />
                </div>
              </div>
              : ""
            }
          </div>
          {this.state.has_Correlation ?
            (<div id="correlation" className="vis">
              <div><div style={{ display: "inline-block", fontSize: "32px" }}><strong>Correlations</strong></div>&nbsp;&nbsp;&nbsp;
              <div style={{ display: "inline-block" }}><button className="rmv_button" onClick={(e) => {
                  e.preventDefault();
                  let tmp = this.state;
                  tmp["has_Correlation"] = false;
                  this.setState(tmp);
                }}>Remove</button></div></div>
              <p>This shows correlation between selected attributes. Click to see scatterplot.</p>
              <div className="frame">
                <div id="diagramCorrelations" className='diagram'> </div>
                <h4 id="diagramScatterPlotName" className='diagram'></h4>
                <div id="diagramScatterPlot" className='diagram'> </div>
              </div>
            </div>) : ""
          }
          {!this.state.has_SingleColumn && this.state.has_Coverage ?
            (<div id="mups" className="vis">
              <div><div style={{ display: "inline-block", fontSize: "32px" }}><strong>Uncovered Patterns</strong></div>&nbsp;&nbsp;&nbsp;
              <div style={{ display: "inline-block" }}><button className="rmv_button" onClick={(e) => {
                  e.preventDefault();
                  let tmp = this.state;
                  tmp["has_Coverage"] = false;
                  this.setState(tmp);
                }}>Remove</button></div></div>
              <p>Uncovered patterns shows the combination of values that are undersampled in the dataset</p>
              <div className="frame"><div id="mups_vis"></div></div>
            </div>) : ""
          }
          {!this.state.has_SingleColumn && this.state.has_AssociationRule ?
            (<div id="ars" className="vis">
              <div><div style={{ display: "inline-block", fontSize: "32px" }}><strong>Association Rules </strong></div>&nbsp;&nbsp;&nbsp;
              <div style={{ display: "inline-block" }}><button className="rmv_button" onClick={(e) => {
                  e.preventDefault();
                  let tmp = this.state;
                  tmp["has_AssociationRule"] = false;
                  this.setState(tmp);
                }}>Remove</button></div></div>
              <div id="ars_vis" className="frame">
                <div>
                  <AssociationRule key={3} />
                  <hr />
                </div>
              </div>
            </div>) : ""
          }
          {this.state.has_FunctionalDependency ?
          
              (<div id="fds" className="vis">
                <div><div style={{ display: "inline-block", fontSize: "32px" }}><strong>Functional Dependency </strong></div>&nbsp;&nbsp;&nbsp;
              <div style={{ display: "inline-block" }}><button className="rmv_button" onClick={(e) => {
                    e.preventDefault();
                    let tmp = this.state;
                    tmp["has_FunctionalDependency"] = false;
                    this.setState(tmp);
                  }}>Remove</button></div>
                </div>
                <p>Functional dependency is a relationship that exists when combinaton of attributes uniquely determines another attribute.</p>
                <p>Here you can see all functional dependencies observed in the dataset. You can drag the nodes apart to see relationships and patterns.</p>
                <div id="visFunctionalDep" className="frame">
                  <div>
                  <FunctionalDependency key={2} />
                    <hr />
                  </div>
                </div>
              </div>) 
            :""
          }
          <div id="additional_widgets" className="vis">
            <div style={{ fontSize: "32px" }}><strong>Add More widgets</strong></div>
            <div className="frame" >
              <div style={{ display: "inline-block", width: "95%" }}>
                {this.state.has_SingleColumn ? <div>
                  <Select
                    required
                    closeMenuOnSelect={false}
                    components={{ ClearIndicator }}
                    styles={{ clearIndicator: ClearIndicatorStyles }}
                    defaultValue={[]}
                    isMulti
                    onChange={(opt) => {
                      let tmp = this.state;
                      tmp.widget_currentValues = opt
                      this.setState(tmp);
                    }
                    }
                    simpleValue
                    options={[
                      { label: "Top-K Correlations", value: 1 },
                      { label: "Functional Dependencies", value: 2 },
                    ]} />
                </div> : <div>
                    <Select
                      required
                      closeMenuOnSelect={false}
                      components={{ ClearIndicator }}
                      styles={{ clearIndicator: ClearIndicatorStyles }}
                      defaultValue={[]}
                      isMulti
                      onChange={(opt) => {
                        let tmp = this.state;
                        tmp.widget_currentValues = opt
                        this.setState(tmp);
                      }
                      }
                      simpleValue
                      options={[
                        { label: "Top-K Correlations", value: 1 },
                        { label: "Functional Dependencies", value: 2 },
                        { label: "Association Rules", value: 3 },
                        { label: "Maximal Uncovered Patterns", value: 4 },
                      ]} />
                  </div>}

              </div>
              <div style={{ display: "inline-block", width: "5%" }}><button className="add_button" onClick={this.handleClick}>+</button></div>

            </div>
          </div>
        </div>

      </div>
    )
  }
}
// Label.propTypes = {
//   url: PropTypes.string.isRequired,
// };
