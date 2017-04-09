import React from 'react';
import { connect } from 'react-redux';

import { routeTo } from '../../actions/app';

const Nav = ({ routeTo }) => (
  <div>
    <div onClick={() => routeTo('projects')}>Projects</div>
    <div onClick={() => routeTo('settings')}>Settings</div>
    <hr />
  </div>
);

export default connect(null, { routeTo })(Nav);
