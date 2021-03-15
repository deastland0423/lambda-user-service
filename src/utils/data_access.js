/**
 * Safely get a deeply-nested property from an object, when it (or any part of the path hierarchy) may not exist.
 * @link: https://medium.com/javascript-inside/safely-accessing-deeply-nested-values-in-javascript-99bf72a0855a
 * @param object obj The object to be traversed.
 * @param array path Sequence of property names defining the path to the desired property.
 * @return mixed|null Return the value or NULL if not found.
 */
const safeGetProp = (obj, path) =>
  path.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, obj)

module.exports = { safeGetProp };