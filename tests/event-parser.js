const TEST_EVENTS = [
  'Timav @personal @language(js)',
  '@research',
  '@work @research',
  '@personal @language(js,glsl)',
  '@health(gym)',
  'Test Project Name @work',
  'Test Project Name'
];

const { isArray } = Array;
const flatten = xs => xs.reduce((acc, x) => acc.concat(isArray(x) ? x : [x]), []);

const parseTitle = title => {
  const project = title.split('@')[0].trim();
  const tags = flatten(
    title.split('@').slice(1).map(tag => {
      if (tag.indexOf('(') >= 0) {
        const tagName = tag.match(/(.+)\(/)[1];
        const subTags = tag.match(/\((.+)(,|\))/)[1];

        return subTags.split(',').map(subTag => ({ tag: tagName, subTag }));
      } else {
        return { tag: tag.trim() };
      }
    })
  );

  return { project, tags };
};

const parsed = TEST_EVENTS.map(parseTitle);

console.log('\n', JSON.stringify(parsed, null, 2), '\n');
