
/**
 * Perform a regex based mapping on a string
 * @param {*} str the string that needs to be expanded
 * @param {*} mapObj an object where each element returns the string that should replace it
 * @return {string} the expanded string
 */
export function regexMap (str, mapObj) {
  var re = new RegExp(Object.keys(mapObj).join('|'), 'gi')
  return str.replace(re, function (matched) {
    return mapObj[matched.toLowerCase()]
  })
}
