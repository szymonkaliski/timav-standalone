import React from 'react';
import { connect } from 'react-redux';

import { routeTo } from '../../actions/app';

const Sidebar = () => (
  <div className="sidebar">
    <div onClick={() => routeTo('projects')}>Projects</div>
    <div onClick={() => routeTo('settings')}>Settings</div>
  </div>
);

export default connect(null, { routeTo })(Sidebar);
