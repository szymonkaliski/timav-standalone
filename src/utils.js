import formatCurrency from 'format-currency';
import moment from 'moment';

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

export const clamp = (v, min, max) => Math.min(max, Math.max(v, min));

export const isArray = Array.isArray;
export const flatten = xs => xs.reduce((acc, x) => acc.concat(isArray(x) ? x : [x]), []);

export const minDate = (a, b) => (a < b ? a : b);
export const maxDate = (a, b) => (a > b ? a : b);

export const stringifyMilliseconds = milliseconds => `${(milliseconds / (1000 * 60 * 60)).toFixed(1)}h`;

export const stringifyDate = date => moment(date).format('YYYY-MM-DD');
export const stringifyDateShort = date => moment(date).format('YY/MM/DD');

export const comparator = prop => (a, b) => b[prop] - a[prop];

export const stringifyTag = tag => `${tag.tag}${tag.subTag ? `: ${tag.subTag}` : ''}`;

export const stringifyCash = num => formatCurrency(num);
