const { fromJS } = require('immutable');

const A = fromJS({ 1: { id: 1, name: 'one' }, 2: { id: 2, name: 'two' } });

const B = fromJS({ 2: { id: 2, name: 'two-b' }, 3: { id: 3, name: 'three' } });

console.log(A.merge(B).toJS())
