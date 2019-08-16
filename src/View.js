import React, {Component} from 'react';

class  View extends Component {

  render(){

    var {className, children, viewName, activeView} = this.props;

    var newClassName = (viewName == activeView) ? 'view active '+className : 'view '+className;

    return (

      <div className={newClassName}>
        {children}
      </div>
    );
  }
}

export default View;
