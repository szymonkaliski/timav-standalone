import React from 'react';
import { connect } from 'react-redux';
import { histogram } from 'd3-array';
import { scaleTime } from 'd3-scale';
import { timeDay } from 'd3-time';

import { flatten, minDate, maxDate, prop } from '../../utils';

const Chains = ({ tags }) => {
  console.log(tags);

  return (
    <div className="chains">
      Chains
    </div>
  );
};

const mapStateToProps = state => {
  const events = state.get('events') ? state.get('events').valueSeq().toJS() : [];

  const allTags = flatten(
    events.reduce((acc, event) => {
      if (event.isMarker) {
        return acc;
      }

      return [
        ...acc,
        event.tags.map(tag => ({
          ...tag,
          start: event.start,
          end: event.end,
          duration: event.duration
        }))
      ];
    }, [])
  );

  const groupedTags = allTags.reduce((acc, tag) => {
    if (!acc[tag.tag]) {
      acc[tag.tag] = [];
    }

    acc[tag.tag].push(tag);

    return acc;
  }, {});

  const tags = Object.keys(groupedTags).reduce((acc, key) => {
    const tagsList = groupedTags[key];

    const start = tagsList.reduce((acc, { start }) => minDate(acc, start), new Date());
    const end = tagsList.reduce((acc, { start }) => maxDate(acc, start), new Date());

    const histogramScale = scaleTime().domain([start, end]).nice();
    const histogramTicks = histogramScale.ticks(timeDay, 1);
    const calculateHistogram = histogram()
      .value(prop('start'))
      .domain(histogramScale.domain())
      .thresholds(histogramTicks);

    return {
      ...acc,
      [key]: calculateHistogram(tagsList)
    };
  }, {});

  return { tags };
};

const areStatesEqual = (a, b) => a.get('events').equals(b.get('events'));

export default connect(mapStateToProps, null, null, { areStatesEqual })(Chains);
