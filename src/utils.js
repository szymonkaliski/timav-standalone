export const isDebug = process.env.NODE_ENV === "debug";

export const pick = (fields, obj) => {
  return Object.keys(obj).reduce(
    (acc, key) => {
      if (fields.indexOf(key) >= 0) {
        acc[key] = obj[key];
      }
      return acc;
    },
    {}
  );
};

export const isArray = Array.isArray;

export const flatten = xs => xs.reduce((acc, x) => acc.concat(isArray(x) ? x : [x]), []);
