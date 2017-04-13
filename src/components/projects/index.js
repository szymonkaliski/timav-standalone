import React from 'react';
import { connect } from 'react-redux';

import { routeTo } from '../../actions/app';
import { comparator, minDate, maxDate, stringifyMilliseconds, stringifyDate, stringifyTag } from '../../utils';

const ProjectItem = ({ project, onClick }) => {
  return (
    <div className="project-item" onClick={onClick}>
      <div className="project-item__duration">
        {stringifyMilliseconds(project.duration)}
      </div>

      <div className="project-item__name">
        {project.name}
      </div>

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
  );
};

const Projects = ({ projects, routeTo, args }) => {
  const detailProject = projects.find(({ name }) => name === (args && args.projectName));

  return (
    <div className="projects">
      <div className="project-list">
        {projects.map(project => (
          <ProjectItem
            key={project.name}
            project={project}
            onClick={() => routeTo('projects', { projectName: project.name })}
          />
        ))}
      </div>
      <div className="project-detail">
        {detailProject && detailProject.name}
      </div>
    </div>
  );
};

// TODO: merge projects with cash leter on
const mapStateToProps = state => {
  const events = state.get('events') ? state.get('events').valueSeq().toJS() : [];

  const projectsByName = events.reduce(
    (acc, event) => {
      if (!event.project) {
        return acc;
      }

      if (!acc[event.project]) {
        acc[event.project] = {
          name: event.project,
          start: event.start,
          end: event.end,
          duration: 0,
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
      });

      return acc;
    },
    {}
  );

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

  return { projects };
};

const areStatesEqual = (a, b) => a.get('events').equals(b.get('events'));

export default connect(mapStateToProps, { routeTo }, null, { areStatesEqual })(Projects);
