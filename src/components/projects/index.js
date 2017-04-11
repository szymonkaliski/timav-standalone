import React from 'react';
import { connect } from 'react-redux';

const Projects = ({ projects }) => {
  console.log({ projects });
  return <div>projects list</div>;
};

const mapStateToProps = state => {
  // collect projects and turn to plain JS at the same time
  // TODO: do calculations here, not in render
  // TODO: filter through the list, display markers only if we have some non-marker events, etc...
  const projects = state.get('events').reduce((acc, immutableEvent) => {
    const event = immutableEvent.toJS();

    if (!event.project) {
      return acc;
    }

    if (!acc[event.project]) {
      acc[event.project] = [];
    }

    acc[event.project].push(event);

    return acc;
  }, {});

  return { projects };
};

const areStatesEqual = (a, b) => a.get('events').equals(b.get('events'));

export default connect(mapStateToProps, null, null, { areStatesEqual })(Projects);
