import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import MultiBasic from './multi_basic';
import Correlation from './correlation';
import FunctionalDependency from './functional_dependency';
import AssociationRule from './association_rule';
import SingleColumn from './single_column';
import Coverage from './coverage';
// import Entry from './entry';
// import InfiniteScroll from 'react-infinite-scroll-component'

export default class Label extends React.Component {
  constructor(props) {
  // Runs when an instance is creazted.
  // Initialize mutable state here
  // Initialize mutable state
    super(props);
    console.log("Label ctor");
    let widget_currentValues=this.props["location"]["state"]['widget_currentValues'];
    let protected_currentValues=this.props["location"]["state"]['protected_currentValues'];

    this.state={
        has_Correlation:false,
        has_FunctionalDependency:false,
        has_AssociationRule:false,
        has_Coverage:false,
        has_SingleColumn: this.props["location"]["state"]['is_single_column'],
    }
    for (let i=0;i<widget_currentValues.length;++i){
      if(widget_currentValues[i]['value']==1) {
        this.state['has_Correlation']=true;
      } else if(widget_currentValues[i]['value']==2) {
        this.state['has_FunctionalDependency']=true;
      } else if(widget_currentValues[i]['value']==3) {
        this.state['has_AssociationRule']=true;
      } else if(widget_currentValues[i]['value']==4) {
        this.state['has_Coverage']=true;
      }
    }

    if(!this.props["location"]["state"]["is_manually_widgets"]){
      this.state={
          has_Correlation:true,
          has_FunctionalDependency:true,
          has_AssociationRule:true,
          has_Coverage:true,
          has_SingleColumn:this.props["location"]["state"]['is_single_column'],
      }
    }
    if(protected_currentValues.length==0){
      this.state['has_Correlation']=false;
    }

  }
  render() {
    return (
      <div>
      <div className="scontainer"></div>
      <div className="container">
        <div className="label">
          {this.state.has_SingleColumn?
            (<div>
              <SingleColumn key={4}  />
              <hr/>
            </div>):""
          }
          {!this.state.has_SingleColumn?
            (<div>
              <MultiBasic key={0}  />
              <hr/>
            </div>):""
          }
          {!this.state.has_SingleColumn&&this.state.has_Correlation?
            (<div>
              <Correlation key={1}   />
              <hr/>
            </div>):""
          }
          {!this.state.has_SingleColumn&&this.state.has_Coverage?
            (<div>
              <Coverage key={4}   />
              <hr/>
            </div>):""
          }
          {!this.state.has_SingleColumn&&this.state.has_FunctionalDependency?
            (<div>
              <FunctionalDependency key={2}   />
              <hr/>
            </div>):""
          }
          {!this.state.has_SingleColumn&&this.state.has_AssociationRule?
            (<div>
              <AssociationRule key={3}   />
              <hr/>
            </div>):""
          }


        </div>
      </div>
      <div className="scontainer"></div>
      </div>
    );
  }
}
// Label.propTypes = {
//   url: PropTypes.string.isRequired,
// };
