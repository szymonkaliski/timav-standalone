import React from 'react';
import { connect } from 'react-redux';

import ProjectDetail from './detail';

import { routeTo } from '../../actions';
import {
  comparator,
  minDate,
  maxDate,
  stringifyMilliseconds,
  stringifyDate,
  stringifyCash,
  stringifyTag
} from '../../utils';

const ProjectItem = ({ project, onClick, isSelected, currencySymbol }) => {
  return (
    <div>
      {isSelected && <i className="project-item__selected-icon fa fa-caret-left" />}

      <div className="project-item" onClick={onClick}>
        <div className="project-item__duration">
          {stringifyMilliseconds(project.duration)}
        </div>

        <div className="project-item__name">
          {project.name}
        </div>

        {project.cash > 0 &&
          <div className="project-item__cash-h">
            {stringifyCash(project.cash / (project.duration / (1000 * 60 * 60)))}{currencySymbol}/h
          </div>}

        <div className="project-item__dates">
          <span className="project-item__date-start">
            {stringifyDate(project.start)}
          </span>
          —
          <span className="project-item__date-end">
            {stringifyDate(project.end)}
          </span>
        </div>

        <div className="project-item__tags">
          {project.tags.slice(0, 3).map(({ tag }) => <span key={tag} className="project-item__tag">{tag}</span>)}
        </div>
      </div>
    </div>
  );
};

const Projects = ({ projects, currencySymbol, routeTo, args }) => {
  const selectedProject = projects.find(({ name }) => name === (args && args.projectName));

  return (
    <div className="projects">
      <div className="project-list">
        {projects.map(project => (
          <ProjectItem
            isSelected={args && args.projectName === project.name}
            key={project.name}
            onClick={() => routeTo('projects', { projectName: project.name })}
            project={project}
            currencySymbol={currencySymbol}
          />
        ))}
      </div>
      <div className="project-detail">
        {selectedProject && <ProjectDetail project={selectedProject} currencySymbol={currencySymbol} />}
      </div>
    </div>
  );
};

// TODO: merge projects with cash leter on
const mapStateToProps = state => {
  const events = state.get('events') ? state.get('events').valueSeq().toJS() : [];

  const projectsByName = events.reduce((acc, event) => {
    if (!event.project) {
      return acc;
    }

    if (!acc[event.project]) {
      acc[event.project] = {
        name: event.project,
        start: event.start,
        end: event.end,
        duration: 0,
        cash: 0,
        events: [],
        tags: {}
      };
    }

    acc[event.project].events.push(event);
    acc[event.project].start = minDate(acc[event.project].start, event.start);
    acc[event.project].end = maxDate(acc[event.project].end, event.end);
    acc[event.project].duration += event.duration;

    event.tags.forEach(tag => {
      const tagName = stringifyTag(tag);

      acc[event.project].tags[tagName] = acc[event.project].tags[tagName] || 0 + event.duration;
      acc[event.project].cash += tag.cash || 0;
    });

    return acc;
  }, {});

  const projects = Object.keys(projectsByName)
    .map(key => {
      const project = projectsByName[key];

      project.tags = Object.keys(project.tags)
        .map(key => ({ duration: project.tags[key], tag: key }))
        .sort(comparator('duration'));

      return project;
    })
    .filter(({ duration }) => duration > 0)
    .sort(comparator('end'));

  return {
    projects,
    currencySymbol: state.get('currencySymbol')
  };
};

const areStatesEqual = (a, b) => a.get('events').equals(b.get('events'));

export default connect(mapStateToProps, { routeTo }, null, { areStatesEqual })(Projects);
