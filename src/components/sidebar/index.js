import React from 'react';
import { connect } from 'react-redux';

import { routeTo } from '../../actions';

const SidebarItem = ({ active, onClick, icon }) => (
  <div onClick={onClick}>
    {active && <i className="sidebar__item-active-icon fa fa-caret-left" />}

    <div className="sidebar__item-content">
      <i className={`sidebar__item-icon fa fa-${icon}`} />
    </div>
  </div>
);

const Sidebar = ({ routeTo, currentRoute }) => (
  <div className="sidebar">
    <div className="sidebar__items">
      <SidebarItem active={currentRoute === 'projects'} onClick={() => routeTo('projects')} icon="bars" />
      <SidebarItem active={currentRoute === 'chains'} onClick={() => routeTo('chains')} icon="link" />
      <SidebarItem active={currentRoute === 'settings'} onClick={() => routeTo('settings')} icon="cog" />
    </div>
  </div>
);

const mapStateToProps = state => ({
  currentRoute: state.getIn(['route', 'path'])
});

export default connect(mapStateToProps, { routeTo })(Sidebar);
