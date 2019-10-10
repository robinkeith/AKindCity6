const hours = `Monday:
9.00am - 5.30pm
Tuesday:
9.30am - 5.30pm
Wednesday:
9.00am - 5.30pm
Thursday:
9.00am - 7.00pm
Friday:
9.00am - 5.30pm
Saturday:
9.00am - 6.00pm
Sunday:
10.30am - 4.30pm`

console.log(parseOpeningHours(hours))

function parseOpeningHours (hours) {
  var mapReplace = {
    monday: 'Mo',
    tuesday: 'Tu',
    wednesday: 'We',
    thursday: 'Th',
    friday: 'Fr',
    saturday: 'Sa',
    sunday: 'Su',
    mon: 'Mo',
    tue: 'Tu',
    wed: 'We',
    thur: 'Th',
    fri: 'Fr',
    sat: 'Sa',
    sun: 'Su' }

  let ret = replaceAll(hours, mapReplace)
    .replace(/ - /gi, '-')
    .replace(/:/gi, '')
    .replace(/\./gi, ':')
    .replace(/ - /gi, '-')
    .replace(/[\n\r]/gi, ' ')
    /* .replace(/((?<hours>1[0-2]|0?[1-9]):(?<mins>[0-5][0-9]) ?(?<am>[AaPp][Mm]))/g,
      function (match, ...params) {
        // console.log('params')
        console.log(match)
        console.log(params)
        return match
      }) */
  // replace(/pm/gi,'pm;')

  return ret
}

function replaceAll (str, mapObj) {
  var re = new RegExp(Object.keys(mapObj).join('|'), 'gi')

  return str.replace(re, function (matched) {
    return mapObj[matched.toLowerCase()]
  })
}
