import React from 'react';
import styled from 'styled-components';
import { Boxplot, computeBoxplotStats } from 'react-boxplot';

export default class Bplot extends React.Component  {
  constructor(props) {
    super(props);
    console.log("box ctor");
  }

  render(){
    console.log("box render");
    const StyledMain = styled.main`
      background-color: #ddd
    `

    const StyledBoxplot = styled(Boxplot)`
      margin: 10px;
      border: solid 20px #ccc;
      border-radius: 3px;
      background-color: white;
    `

    const plotAttrs = [
      {
          width: 300,
          height: 25,
          orientation: 'horizontal',
          min: this.props.min,
          max: this.props.max,
          stats: computeBoxplotStats(
            this.props.data)
      }
    ]
    return(
      <StyledMain>
        {
          plotAttrs.map(attrs => [
            <StyledBoxplot { ...attrs } />,
            <br />,
          ])
        }
      </StyledMain>

    )
  }
}

// const Bplot = () => (
//
// )
// export default Bplot
