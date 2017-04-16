import dateformat from 'dateformat';

export const isDebug = process.env.NODE_ENV === 'debug';

export const prop = field => object => object[field];

export const pick = fields => obj => {
  return Object.keys(obj).reduce((acc, key) => {
    if (fields.indexOf(key) >= 0) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
};

export const isArray = Array.isArray;
export const flatten = xs => xs.reduce((acc, x) => acc.concat(isArray(x) ? x : [x]), []);

export const minDate = (a, b) => (a < b ? a : b);
export const maxDate = (a, b) => (a > b ? a : b);

export const stringifyMilliseconds = milliseconds => `${(milliseconds / (1000 * 60 * 60)).toFixed(1)}h`;

export const stringifyDate = date => dateformat(date, 'yyyy-mm-dd');
export const stringifyDateShort = date => dateformat(date, 'mm/dd');

export const comparator = prop => (a, b) => b[prop] - a[prop];

export const stringifyTag = tag => `${tag.tag}${tag.subTag ? `: ${tag.subTag}` : ''}`;
