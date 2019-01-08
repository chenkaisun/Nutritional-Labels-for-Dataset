import React from "react";
// import PropTypes from 'prop-types';
// import Label from './label';
// import Redirection from './redirection';
import Select from 'react-select';
// import { Link } from 'react-router-3';
import { Redirect } from 'react-router';
import {history} from './routes';
import ReactTooltip from 'react-tooltip';
// import { withRouter } from 'react-router-dom'
// import VirtualizedSelect from 'react-virtualized-select';

export default class Selection extends React.Component {
  constructor(props) {
    super(props);
    console.log("select ctor");
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleCheckbox= this.toggleCheckbox.bind(this);
    this.state = {
      redirect:false,
      setted:false,
      attribute_options:[],
      widget_options:[
        {label:"Top-K Correlations", value:1},
        {label:"Functional Dependencies", value:2},
        {label:"Association Rules", value:3},
        {label:"Maximal Uncovered Patterns", value:4},
      ],

      str_colnames:{},

      protected_currentValues: [],
      label_currentValues: [],

      is_manually_widgets: false,
      widget_currentValues: [],

      chose_numeric:false,

      attribute_currentValues: [],
      is_single_column:false,
      is_multi_column:true,
      is_whole:true,
      is_choose_attributes:false,

      is_query:false,
      query_currentValues:[],
      query_rangeValues:{},

      has_fd:true,
    }
  }
  componentDidMount() {
    console.log("sel mount");
    
    fetch('/api/get_colnames/', { credentials: 'same-origin' })
      .then((response) => {
        // console.log("home then");
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        // console.log("home data");
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
              setted: true,
            });
            history.replaceState(this.state, null, '/');
          }
        } else {
            let tmp=this.state;
            tmp["setted"]=true;
            for (let i = 0; i < data.colnames.length; i++) {
                tmp.attribute_options.push({label:data.colnames[i], value:i});
            }
            for (let i = 0; i < data.str_colnames.length; i++){
              tmp["str_colnames"][data.str_colnames[i]]=0;
            }
            // console.log("didmount");
            // console.log(tmp);
            // console.log("setted");
            this.setState(tmp);
        }
      })
      .catch(error => console.log(error));// eslint-disable-line no-console
  }

  // handleChange (selectedOption) {
  //   let tmp=this.state;
  //   tmp.currentValues.push(selectedOption);
  //   this.setState(tmp);
  // }

  handleSubmit(e) {

    event.preventDefault();
    const name = e.target.name;
    const checked = e.target.checked;
    let tmp=this.state;
    if(tmp["is_single_column"] && tmp["protected_currentValues"].length<=0) {
      return (-1);
    }
    tmp[name]=!tmp[name]

    // str column_name
    if(tmp["is_single_column"]&&Object.keys(tmp["protected_currentValues"]).length>=1){
      if(Object.keys(tmp["str_colnames"]).length === 0 || !(tmp["protected_currentValues"]['label'] in tmp["str_colnames"])){
        tmp["chose_numeric"]=true;
      }
    }
    tmp["redirect"] = true;
    fetch('/api/form_submit/', {
      credentials: 'same-origin',
      headers: {'Content-Type': 'application/json'},
      method: ['POST'],
      body: JSON.stringify(this.state),
    }).then((res) => {
      
    })
    console.log("s fetch post");
    this.setState(tmp);
    // history.push('/label');
    history.push({
      pathname: '/label',
      state: this.state
    })
    console.log("e fetch post");
  }

  toggleCheckbox(e) {
    console.log("sel s toggle");
    const name = e.target.name;
    const checked = e.target.checked;
    let tmp=this.state;
    tmp[name]=!tmp[name]
    if(name=="is_whole"){
      tmp["is_choose_attributes"]=!tmp["is_choose_attributes"]
    }else if(name=="is_choose_attributes"){
      tmp["is_whole"]=!tmp["is_whole"]
    }else if(name=="is_single_column"){
      tmp["is_multi_column"]=!tmp["is_multi_column"]
    }else if(name=="is_multi_column"){
      tmp["is_single_column"]=!tmp["is_single_column"]
    }
    this.setState(tmp);
  }

  render() {
    if(this.state.redirect){
      const { from } = this.props.location.state || '/';
      return (
        <div>
          {this.state.redirect && (
            <Redirect to={'/label'}/>
          )}
        </div>
      )
    }
    if(!this.state.setted) {
      return("");
    }
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

    return (
      <div>
        <ReactTooltip />
        <form onSubmit={this.handleSubmit}>
          <div className="scontainer"></div>
          <div className="bcontainer">
            <h2 data-tip="Specify what to be included in the label">Selections</h2>

              <span>
              <label className="checkbox">
                <input type="radio" name="is_single_column" checked={this.state.is_single_column} onChange={this.toggleCheckbox} />
                <span className="checkbox-label" >Single Column Analysis</span>
              </label>
              &nbsp;
              <label className="checkbox">
    						<input type="radio" name="is_multi_column" checked={this.state.is_multi_column} onChange={this.toggleCheckbox} />
    						<span className="checkbox-label" data-tip="Causion: select too many columns can make column wise operation (i.e. Functional Dependency) take long time">Multi Column Analysis</span>
    					</label>
              </span>



              {this.state.is_single_column?
                <div>
                  <Select
                    required={this.state.is_single_column}
                    closeMenuOnSelect={false}
                    components={{ ClearIndicator }}
                    styles={{ clearIndicator: ClearIndicatorStyles }}
                    defaultValue={[]}
                    onChange={(opt)=>{
                        let tmp=this.state;
                        tmp.protected_currentValues=opt;
                        // console.log("protected_currentValues");
                        this.setState(tmp);
                      }
                    }
                    simpleValue
                    options={this.state.attribute_options} />
                  <hr/>
                </div> :""}
                {true?
                  <div>
                    <span>
                    <label className="checkbox">
                      <input type="radio" name="is_choose_attributes" checked={this.state.is_choose_attributes} onChange={this.toggleCheckbox} />
                      <span className="checkbox-label">Pick your non-protected attributes</span>
                    </label>
                    &nbsp;
                    <label className="checkbox" data-tip="Causion: select too many columns can make column wise operation (i.e. Functional Dependency) take long time">
          						<input type="radio" name="is_whole" checked={this.state.is_whole} onChange={this.toggleCheckbox} />
          						<span className="checkbox-label">Use the whole dataset</span>
          					</label>
                    </span>
                    {this.state.is_choose_attributes?<div>
                      <Select
                        required={this.state.is_multi_column&&this.state.is_choose_attributes}
                        closeMenuOnSelect={false}
                        components={{ ClearIndicator }}
                        styles={{ clearIndicator: ClearIndicatorStyles }}
                        defaultValue={[]}
                        isMulti
                        onChange={(opt)=>{
                            let tmp=this.state;
                            tmp.attribute_currentValues=opt
                            this.setState(tmp);
                          }
                        }
                        simpleValue
                        options={this.state.attribute_options} />
                    </div>:""
                  }
                  <hr/>
                  </div> :""}


              {!this.state.is_single_column?<div>
                <span data-tip="Only for correlation and functional dependency">Pick protected attributes</span>
                  <div>
                    <Select
                      required
                      closeMenuOnSelect={false}
                      components={{ ClearIndicator }}
                      styles={{ clearIndicator: ClearIndicatorStyles }}
                      defaultValue={[]}
                      isMulti
                      onChange={(opt)=>{
                          let tmp=this.state;
                          tmp.protected_currentValues=opt
                          this.setState(tmp)
                        }
                      }
                      simpleValue
                      options={this.state.attribute_options} />
                  </div>

                <hr/>
              </div>:""

              }



            {true?<div>
              <label className="checkbox">
    						<input type="checkbox" className="checkbox-control" name="is_manually_widgets" checked={this.state.is_manually_widgets} onChange={this.toggleCheckbox} />
    						<span className="checkbox-label"  data-tip="Leave this
                    unchecked if you would like the system to optimally
                    choose the widgets for your task">Pick your widgets</span>
    					</label>
            </div>:""
            }

            {!this.state.is_single_column&&this.state.is_manually_widgets?
              <div>
                <Select
                  required={!this.state.is_single_column&&this.state.is_manually_widgets}
                  closeMenuOnSelect={false}
                  components={{ ClearIndicator }}
                  styles={{ clearIndicator: ClearIndicatorStyles }}
                  defaultValue={[]}
                  isMulti
                  onChange={(opt)=>{
                      let tmp=this.state;
                      tmp.widget_currentValues=opt
                      // console.log("widget_currentValues");
                      for ( let i=0;i<opt.length;++i){
                        if(opt[i]['label']=="Functional Dependencies"){
                          tmp.has_fd=true;
                          break;
                        }
                      }
                      this.setState(tmp);
                    }
                  }
                  simpleValue
                  options={this.state.widget_options} />
              </div> :""}
              {this.state.is_single_column&&this.state.is_manually_widgets?
                <div>
                  <Select
                    required={this.state.is_single_column&&this.state.is_manually_widgets}
                    closeMenuOnSelect={false}
                    components={{ ClearIndicator }}
                    styles={{ clearIndicator: ClearIndicatorStyles }}
                    defaultValue={[]}
                    isMulti
                    onChange={(opt)=>{
                        let tmp=this.state;
                        tmp.widget_currentValues=opt
                        for ( let i=0;i<opt.length;++i){
                          if(opt[i]['label']=="Functional Dependencies"){
                            tmp.has_fd=true;
                            break;
                          }
                        }
                        this.setState(tmp);
                      }
                    }
                    simpleValue
                    options={[{label:"Top-K Correlations", value:1},
                    {label:"Functional Dependencies", value:2}]} />
                </div> :""}


              <hr/>
              <label className="checkbox">
    						<input type="checkbox" className="checkbox-control" name="is_query" checked={this.state.is_query} onChange={this.toggleCheckbox} />
    						<span className="checkbox-label" data-tip="Give ranges for attributes inclusively">Slice the dataset </span>
    					</label>
              {this.state.is_query?
                <div>
                  <Select
                    required={this.state.is_query}
                    closeMenuOnSelect={false}
                    components={{ ClearIndicator }}
                    styles={{ clearIndicator: ClearIndicatorStyles }}
                    defaultValue={[]}
                    isMulti
                    onChange={(opt)=>{
                        // console.log("query select");
                        let tmp=this.state;
                        let len_new=opt.length;
                        let len_old=tmp.query_currentValues.length;
                        if(len_new<len_old){
                          for (let i=0;i<len_old;++i) {
                            let found=false;
                            let val1=tmp.query_currentValues[i];
                            for (let val2 of opt) {
                              if(val2["label"] ==val1["label"]){
                                found=true;
                              }
                            }
                            if(!found){
                              delete tmp.query_rangeValues[val1["label"]];
                              tmp.query_currentValues.splice(i,1);
                              break;
                            }
                          }
                        }else if(len_new>len_old){
                          for (let i=0;i<len_new;++i) {
                            let found=false;
                            let val2=opt[i];
                            for (let val1 of tmp.query_currentValues) {
                              if(val2["label"] ==val1["label"]){
                                found=true;
                              }
                            }
                            if(!found){
                              if(val2["label"] in this.state.str_colnames){
                                tmp.query_rangeValues[val2["label"]]="";
                              }
                              else tmp.query_rangeValues[val2["label"]]=[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];
                              tmp.query_currentValues=opt;
                              break;
                            }
                          }
                        }
                        this.setState(tmp);
                      }
                    }
                    simpleValue
                    options={this.state.attribute_options} />
                  <div>
                  {
                    Object.entries(this.state.query_rangeValues).map(([key, value]) =>{
                      if(key in this.state.str_colnames){
                        return(<div key={key}>{key}:<input
                          type='text'
                          className='form-control'
                          value={value}
                          placeholder="put a string value"
                          onChange= {(evt) => {
                              let tmp=this.state;
                              this.state.query_rangeValues[key]=String(evt.target.value);
                              this.setState(tmp);
                            }
                          }
                        /></div>)
                      }
                      return(
                        <div>
                          {key}: [&nbsp;
                            <input
                              type='number'
                              step="0.1"
                              placeholder="lower bound (inclusive)"
                              className='form-control'
                              value={value[0]}
                              onChange= {(evt) => {
                                  let tmp=this.state;
                                  this.state.query_rangeValues[key][0]=evt.target.value;
                                  this.setState(tmp);
                                }
                              }
                            />
                          ,&nbsp;
                            <input
                              type='number'
                              step="0.1"
                              placeholder="upper bound (inclusive)"
                              className='form-control'
                              value={value[1]}
                              onChange= {(evt) => {
                                  let tmp=this.state;
                                  this.state.query_rangeValues[key][1]=evt.target.value;
                                  this.setState(tmp);
                                }
                              }
                            />
                        &nbsp;]
                        </div>
                      )
                    }
                  )}
                  </div>
                </div> :""}
              <br/>
              <br/>
              <br/>
              <br/>
               <button type="submit" className="registerbtn2"> Generate </button>
          <div className="scontainer"></div>
          </div>
        </form>

      </div>
    )
  }
}
