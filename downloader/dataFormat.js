import { regexMap } from './utillib.js'
import titleCase from 'better-title-case'
import { getOpeningHours } from '../src/openingHoursPool.js'
import { layer } from '../src/mapLayersModel.js'
import { isObject, isNumber } from '@turf/turf'
// import tag from '@turf/tag'

/**
 * Fix up tags of incoming geoJson to simplifiy post processing
 * @param {Object} tags OSM properties
 * @return Object
 */
export function tidyTags (tags) {
  if (tags.Opening) { tags.opening_hours = tags.Opening }
  if (tags.Name) {
    tags.name = tags.Name
  }
  if (tags.Address) { tags['addr:street'] = tags.Address }

  if (tags.amenity && (tags.amenity === 'telephone' || tags.amenity === 'recycling')) {
    tags.opening_hours = '24/7'
  }
  return tags
}

/**
 * Nicely format any contact details for the feature
 * @param {Object} tags OSM attributes for the feature
 * @returns {string} html of the feature's contact details
 */
export function contacts (tags) {
  let ret = ''
  if (tags.email) {
    ret += `<a href='mailtto:${tags.email}'> <i class="fas fa-envelope"></i> Email ${tags.email}</a>`
  }
  let website = tags.website || tags.url
  if (website) {
    ret += (ret ? '<br/>' : '') + `<a href='${website}'> <i class="fas fa-globe"></i> Visit Website</a>`
  }
  if (tags.phone) {
    ret += (ret ? '<br/>' : '') + `<a href='phone:${tags.phone}'> <i class="fas fa-phone"></i> Phone ${tags.phone.replace('+44 ', '0')}</a>`
  }

  if (tags.operator) {
    ret += (ret ? '<br/>' : '') + `<strong>Operated By:</strong> ${tags.operator}`
  }

  // TODO: handle facebook etc, inc when facebook is in the website/url field
  return ret
}

/**
 * Get a caption  for the feature (used as the tool tip and the info window caption)
 * @param {Object} tags OSM attributes for the feature
 * @returns {string} caption of the feature
 */
export function caption (tags) {
  // TODO: report if caption is a node
  // TODO: improve some entity types
  return tags.name || tags['addr:housename'] || prettyTitleCase(tags.amenity) || prettyTitleCase(tags.building) || tags['id'] || ''
}

/**
 * Return a pretty shop type description, replacing _ with space and either adding 'shop' suffice or mapping to appropriate UK form
 * @param {string} shop shop type code
 * @returns {string} pretty description
 */
function prettyShopType (shop) {
  const shopMap = {
    alcohol: 'Off licence',
    bakery: 'Bakery',
    bookmaker: 'Bookmaker',
    books: 'Bookshop',
    builder: 'Building Services',
    butcher: 'Butcher',
    cash_and_carry: 'Cash and Carry',
    car: 'Car Showroom',
    chemist: 'Chemist',
    convenience: 'Convenience store',
    copyshop: 'Copyshop',
    deli: 'Delicatessen',
    department_store: 'Department store',
    doityourself: 'Do It Yourself store',
    dry_cleaning: 'Dry Cleaning',
    estate_agent: 'Estate Agent',
    florist: 'Florist',
    funeral_directors: 'Funeral Director',
    funeral_home: 'Funeral Director',
    greengrocer: 'Greengrocer',
    grocer: 'Grocer',
    hairdresser: 'Hairdresser',
    ironmonger: 'Ironmonger',
    jewelry: 'Jewellery shop',
    key_cutting: 'Key Cutting',
    kiosk: 'Kiosk',
    mall: 'Mall',
    money_lender: 'Money Lender',
    newsagent: 'Newsagent',
    optician: 'Optician',
    patisserie: 'Patisserie',
    pawnbroker: 'Pawnbroker',
    perfumery: 'Pefumery',
    pet_grooming: 'Pet Grooming',
    photo_studio: 'Photographic Studio',
    photographer: 'Photographer',
    shoes: 'Shoe shop',
    storage_rental: 'Storage Rental',
    tailor: 'Tailor',
    tattoo: 'Tattoo Parlour',
    travel_agency: 'Travel Agent'
  }

  let mappedShop = shopMap[shop]

  return mappedShop || prettyTitleCase(shop) + ' shop'
}

/**
 * Return a pretty amenity type description, replacing _ with space and either adding 'shop' suffice or mapping to appropriate UK form
 * @param {string} amenity shop type code
 * @returns {string} pretty description
 */
function prettyAmenityType (amenity) {
  const amenityMap = {
    taxi: 'Taxi Rank',
    recycling: 'Recycling Bin',
    fuel: 'Petrol Station',
    bus_depot: 'Bus Station',
    ice_cream: 'Ice Cream Seller'
  }

  let mappedAmenity = amenityMap[amenity]

  return mappedAmenity || prettyTitleCase(amenity)
}

/**
 * Create some sort of description for the feature
 * @param {Object} tags OSM attributes for the feature
 * @returns {string} description of the feature
 */
export function description (tags) {
  let ret = ''
  if (tags.shop) ret = prettyShopType(tags.shop)
  if (tags.amenity) {
    ret += prettyAmenityType(tags.amenity)

    if (tags.cuisine) {
      ret += ` serving ${tags.cuisine} cuisine`
    }
  }

  ret += '. '
  if (tags.description) ret += tags.description
  return ret
}

/**
 * Return the facilities of the feature as icons and bullet points
 * @param {Object} tags OSM attributes for the feature
 * @returns {string} facilities of the feature
 */
export function facilities (tags) {
  return describeParking(tags) +
    describeToilets(tags)
}

/**
 * Return the meta of the feature as icons and bullet points
 * @param {Object} tags OSM attributes for the feature
 * @returns {string} meta of the feature
 */
export function meta (tags) {
  let supplier = 'Unknown'; let lastUpdated = 'Unknown'
  if (tags['id']) {
    let id = tags['id'].replace('/', '=')
    supplier = `<a href='http://www.openstreetmap.org/edit?${id}&comment=TCSM' target='_blank' data-toggle='tooltip' title='Edit on OSM'>Open Street Map</a>`
  }
  lastUpdated = tags.dataLastUpdated

  return `<strong>Data From:</strong> ${supplier} <strong>on:</strong> ${lastUpdated}`
}

/**
 * Describe the availability of the feature, including any opening times
 * @param {Object} tags OSM attributes for the feature
 * @returns {string} availability of the feature (html)
 */
export function availability (tags) {
  let ret = []

  // TODO: pushIf function
  if (tags.opening_hours) {
    ret.push(prettyOpeningHours('Opening Hours', tags.opening_hours, tags.id))
  }
  if (tags['opening_hours:kitchen'] || tags.kitchen_hours) {
    ret.push(prettyOpeningHours('Food Served', (tags['opening_hours:kitchen'] || tags.kitchen_hours), tags.id))
  }

  let features = []
  if (tags.wheelchair && tags.wheelchair === 'yes') {
    features.push('Wheelchair Accessible.')
    if (tags['wheelchair:description']) features.push(tags['wheelchair:description'])
  }
  if (tags['toilets:wheelchair'] && tags['toilets:wheelchair'] === 'yes') features.push('Wheelchair Accessible Toilets')
  if (tags.centralkey) features.push('RADAR key required')
  if (tags.outdoor_seating && tags.outdoor_seating === 'yes') features.push('Outdoor Seating')

  return ret.join('') + features.join(', ')
}

/* *
 * Push a value to an array, only if the value is tuthy
 * @param {Array} arr
 * @param {Array} value
 *
function pushIfTruthy (arr, value) {
  if (value) arr.push(value)
  return arr
}
*/

/**
 * Return a human readable string describing the opening hours
 * @param {string} label label to use when displaying these hours
 * @param {string} hours string formatted in OSM opening_hours format.
 * @param {*} id
 * @return {string} html opening hours
 */
export function prettyOpeningHours (label, hours, id) {
  const dayExpand = { su: 'Sunday', mo: 'Monday', tu: 'Tueday', we: 'Wednesday', th: 'Thursday', fr: 'Friday', sa: 'Saturday', ph: 'Bank Holiday' }

  if (hours) {
    let hoursObj = getOpeningHours(hours, id)

    if (hoursObj) {
      let openingHours = hoursObj.prettifyValue({
        conf: {
          rule_sep_string: '<br/>',
          print_semicolon: false
        } })

      let evenPrettierHours = regexMap(openingHours, dayExpand)
      return String.prototype.concat(
        (label) ? `<strong>${label}:</strong><br/>` : '',
        evenPrettierHours,
        '<br/>')
    }
  }
  return ''
}

/**
 * Return a suitable icon for a set of tags
 * @param {Object} tags OSM attributes for the feature
 * @returns {string} name of the icon to use
 */
export function icon (tags) {
  if (tags.shop && tags.shop !== 'yes') return tags.shop
  if (tags.amenity) return tags.amenity
  if (tags.leisure) return [tags.sport, tags.leisure].join(' ')
  return 'UNKNOWN'
}
// TODO: handle multiple (; seperated entries)
// Mapping table for shops to layers
const shopLayerMap = {
  accessories: layer.service.fashion,
  agrarian: layer.service.agricultural,
  agricultural: layer.service.agricultural,
  alcohol: layer.service.food,
  antiques: layer.service.hobbies,
  aquatics: layer.service.hobbies,
  art: layer.service.hobbies,
  art_supply: layer.service.hobbies,
  auction_house: layer.service.hobbies,
  baby_goods: layer.service.children,
  bag: layer.service.fashion,
  bakery: layer.service.food,
  bathroom: layer.service.hardware,
  beauty: layer.service.fashion,
  bed: layer.service.hardware,
  beverage: layer.service.food,
  beverages: layer.service.food,
  bicycle: layer.service.transport,
  bookmaker: layer.enjoy.adult,
  books: [layer.service.hobbies, layer.service.learn],
  builder: layer.service.hardware,
  builders_merchant: layer.service.hardware,
  business: layer.service.business,
  butcher: layer.service.food,
  camera: layer.service.hobbies,
  car: layer.service.transport,
  car_parts: layer.service.transport,
  car_recovery: layer.service.transport,
  car_repair: layer.service.transport,
  caravan_repair: layer.service.transport,
  carpet: layer.service.home,
  cash_and_carry: layer.service.business,
  catalogue: layer.service.variety,
  catering: layer.service.business,
  charity: layer.service.ethical,
  cheese: layer.service.food,
  chemist: layer.service.health,
  chinese_medicine: layer.service.health,
  clothes: layer.service.fashion,
  // clothes;interior_decoration:layer ,
  coffee: layer.service.food,
  collector: layer.service.hobbies,
  comics: layer.service.hobbies,
  computer: layer.service.business,
  computer_repair: layer.service.business,
  confectionery: layer.service.food,
  convenience: layer.service.food,
  cooling: layer.service.business,
  copyshop: layer.service.business,
  cosmetics: layer.service.fashion,
  courier: layer.service.communications,
  craft: layer.service.hobbies,
  curtain: layer.service.home,
  decorating_supplies: layer.service.hardware,
  decoration: layer.service.home,
  deli: layer.service.food,
  department_store: layer.service.variety,
  design: layer.service.home,
  discount: layer.service.variety,
  doityourself: layer.service.hardware,
  drainage: layer.service.hardware,
  dry_cleaning: layer.service.home,
  // e-cigarette:layer ,
  education: layer.service.learn,
  electronics: layer.service.electricals,
  erotic: layer.enjoy.adult,
  estate_agent: layer.service.life,
  events: layer.enjoy.events,
  fabric: layer.service.home,
  farm: layer.service.agricultural,
  fashion_accessories: layer.service.fashion,
  finance: layer.service.finance,
  financial_advisor: layer.service.finance,
  fishing: layer.enjoy.sport,
  fitness: layer.service.hobbies,
  flooring: layer.service.hardware,
  florist: layer.service.home,
  foam: layer.service.home,
  food: layer.service.food,
  frame: layer.service.home,
  frozen_food: layer.service.food,
  funeral_directors: layer.service.life,
  funeral_home: layer.service.life,
  furniture: layer.service.home,
  garage: layer.service.transport,
  garage_door: layer.service.hardware,
  garden_centre: layer.service.home,
  gas: layer,
  gift: layer.service.event,
  gilding: layer,
  glass: layer.service.hardware,
  glazing: layer.service.hardware,
  greengrocer: layer.service.food,
  greeting_cards: layer.service.event,
  greetings_cards: layer.service.event,
  grocer: layer.service.food,
  grocery: layer.service.food,
  haberdashery: layer.service.home,
  hairdresser: layer.service.beauty,
  hairdresser_supply: layer.service.business,
  hardware: layer.service.hardware,
  hardware_rental: layer.service.hardware,
  headshop: layer.service.other,
  health_and_beauty: layer.service.beauty,
  health_food: layer.food,
  hearing_aids: layer.service.health,
  hifi: layer.service.electricals,
  home_leisure: layer.service.home,
  homeware: layer.service.home,
  hot_tub: layer.service.home,
  houseplant: layer.service.home,
  houseware: layer.service.home,
  ice_cream: layer.food,
  instrument: layer.service.hobbies,
  interior_decoration: layer.service.home,
  ironmonger: layer.service.home,
  jewelry: layer.service.fashion,
  key_cutting: layer.service.home,
  kiosk: layer.service.variety,
  kitchen: layer.service.hardware,
  kitchenware: layer.service.home,
  knitting: layer.service.hobbies,
  lamps: layer.service.home,
  langerie: layer.service.fashion,
  laundry: layer.service.home,
  leather: layer.service.fashion,
  leatherware: layer.service.fashion,
  magic: layer.service.hobbies,
  mall: layer.service.variety,
  memorabilia: layer.service.hobbies,
  metal: layer.service.hardware,
  mobile_phone: layer.service.communications,
  mobile_repair: layer.service.communications,
  mobility: layer.around.wheelchair,
  model: layer.service.hobbies,
  money_lender: layer.service.finance,
  motorcycle: layer.service.transport,
  motorcycle_repair: layer.service.transport,
  music: layer.enjoy.arts,
  musical_instrument: layer.enjoy.arts,
  newsagent: layer.service.other,
  // no: layer,
  optician: layer.service.health,
  outdoor: layer.service.hobbies,
  packaging: layer.service.business,
  paint: layer.service.hardware,
  paint_stripping: layer.service.hardware,
  patisserie: layer.service.food,
  pawnbroker: layer.service.finance,
  perfumery: layer.service.beauty,
  pet: layer.service.pet,
  pet_grooming: layer.service.pet,
  photo: layer.service.electricals,
  photo_studio: layer.service.family,
  photographer: layer.service.family,
  photography: layer.service.electricals,
  plant_hire: layer.service.hardware,
  plastic: layer.service.hardware,
  plumbing: layer.service.hardware,
  pottery: layer.service.other,
  printing: layer.service.business,
  radiotechnics: layer.service.other,
  refreshments: layer.service.food,
  seafood: layer.service.food,
  second_hand: layer.service.ethical,
  security: layer.service.home,
  shoe_repair: layer.service.fashion,
  shoes: layer.service.fashion,
  signage: layer.service.business,
  signs: layer.service.business,
  software: layer.service.business,
  specialist: layer.service.other,
  spices: layer.service.food,
  sports: layer.service.hobbies,
  stationery: layer.service.business,
  // stationery;art_supplies:layer ,
  stonemason: layer.service.life,
  storage_rental: layer.service.business,
  stove: layer.service.home,
  sunglasses: layer.service.beauty,
  supermarket: layer.service.food,
  tailor: layer.service.fashion,
  tattoo: layer.service.beauty,
  tea: layer.service.food,
  ticket: layer.enjoy,
  tiles: layer.service.hardware,
  tobacco: layer.service.other,
  toys: layer.service.children,
  trade: layer.service.business,
  travel_agency: layer.service.travel,
  tyres: layer.service.transport,
  vape: layer.service.other,
  variety_store: layer.service.variety,
  vehicle: layer.service.transport,
  video_games: layer.service.electricals,
  watch: layer.service.fashion,
  watch_repair: layer.service.fashion,
  watches: layer.service.fashion,
  wholefoods: layer.service.food,
  windows: layer.service.hardware,
  wine: layer.service.food
  // yes: layer

}

const amenityLayerMap =
{
  animal_boarding: layer.service.pet,
  animal_shelter: layer.service.pet,
  arts_centre: layer.enjoy.arts,
  bank: layer.service.finance,
  bar: layer.food,
  beauty_salon: layer.service.beauty,
  bicycle_rental: layer.around.cycle,
  bureau_de_change: layer.service.finance,
  bus_depot: layer.here.bus,
  bus_station: layer.here.bus,
  cafe: layer.food,
  car_rental: layer.here.car,
  casino: layer.enjoy.adult,
  charity: layer.service.ethical,
  childcare: layer.service.children,
  cinema: [layer.enjoy.adult, layer.enjoy.children],
  clinic: layer.service.health,
  college: layer.service.learn,
  community_centre: layer.service.community,
  community_hall: layer.service.community,
  conference_centre: layer.service,
  counselling: layer.service.health,
  courthouse: layer.service.life,
  crematorium: layer.service.life,
  dentist: layer.service.health,
  doctors: layer.service.health,
  drink: layer.food,
  events_venue: layer.enjoy.arts,
  fast_food: layer.food,
  financial_advice: layer.service.finance,
  fuel: layer.here.car,
  gambling: layer.enjoy.adult,
  hospital: layer.service.health,
  ice_cream: layer.food,
  internet_cafe: layer.service.comms,
  kindergarten: [layer.service.learn, layer.service.children],
  language_school: layer.service.learn,
  library: layer.service.learn,
  lift: layer.around.wheelchair,
  marketplace: layer.service.department,
  music_school: layer.service.learn,
  music_venue: layer.enjoy.arts,
  nightclub: layer.enjoy.adult,
  nursing_home: layer.service.health,
  parking: layer.here.car,
  pharmacy: layer.service.health,
  place_of_worship: layer.service.spiritual,
  police: layer.help,
  post_depot: layer.service.communications,
  post_office: layer.service.communications,
  prison: layer.service.life,
  pub: layer.food,
  recycling: layer.service.ethical,
  research_institute: layer.service.learn,
  restaurant: layer.food,
  school: layer.service.learn,
  science_park: layer.service.learn,
  scout_hut: layer.service.children,
  shelter: layer.around.rest,
  social_facility: layer.service.community,
  studio: layer.enjoy.arts,
  taxi: [layer.here.taxi, layer.around.wheelchair],
  telephone: layer.help,
  theatre: layer.enjoy.arts,
  toilets: layer.toilets,
  townhall: layer.service.community,
  university: layer.service.learn,
  vehicle_inspection: layer.here.car,
  vending_machine: layer.here.car,
  veterinary: layer.service.pet,
  village_hall: layer.service.community
}

/**
 * Return a suitable layer(s) for a set of tags
 * @param {Object} tags OSM attributes for the feature
 * @returns {Array.<string>} name of the layer(s) to use
 */
export function layers (tags) {
  // TODO: handle multi attribute tags
  /** @type {Array.<string>} */
  let ret = []

  if (tags.shop) {
    let layerId = shopLayerMap[tags.shop] || layer.service.other
    let layers = (isObject(layerId)) ? layerId.id : layerId
    ret.push(layers)
  }
  if (tags.amenity) {
    tags.amenity.split(';').forEach((amenityTag) => {
      let layerIds = [amenityLayerMap[amenityTag] || layer.service.other].flat()
      layerIds.forEach((layerId) => {
        let layers = (isObject(layerId)) ? layerId.id : layerId
        ret.push(layers)
      })
    })
  }
  if (tags.leisure) ret.push(layer.enjoy.id)

  return ret.flat()
}

/**
 * Describe the location of the feature
 * @param {Object} tags OSM attributes for the feature
 * @returns {string} location of the feature
 */
export function location (tags) {
  const locationTags = [{ tag: 'addr:housenumber', suffix: ' ' }, 'addr:housename',
    { tag: 'level', prefix: 'Level ' }, 'addr:place', 'addr:street', { tag: 'addr:postcode', suffix: '' }]

  const defaultTagFormatter = { suffix: ', ' }

  let r = locationTags.reduce((acc, tag, idx) => {
    const tagFormatter = {
      ...defaultTagFormatter,
      ...((typeof (tag) === 'string') ? { tag: tag } : tag)
    }

    let value = tags[tagFormatter.tag]

    if (value) {
      acc.push({ ...tagFormatter, value: value })
    }
    return acc
  }, [])
  return r.reduce((acc, tag, idx) => {
    return acc.concat(
      (tag.prefix) ? tag.prefix : '',
      tag.value,
      ((idx < r.length - 1 && tag.suffix) ? tag.suffix : ''))
  }, '')
}

/* --------------- Tag specific descriptions ------ */
/**
 * Describe a car park
 * @param {Object} tags OSM properties
 * @return Object
 */
export function describeParking (tags) {
  let ret = []

  if (tags.amenity === 'parking') {
    if (tags.parking) ret.push(prettyTitleCase(tags.parking))
    ret.push((tags.park_ride === 'yes') ? 'Park and Ride' : 'Car Park')
    pushIfTruthyWithYes(tags, 'capacity', ret, 'spaces')
    pushIfTruthyWithYes(tags, 'capacity:disabled', ret, 'disabled spaces')
    pushIfTruthyWithYes(tags, 'capacity:parent', ret, 'parent and child spaces')
    pushIfTruthyWithYes(tags, 'capacity:', ret, 'spaces with electric charging')
    ret.push('. ')
    let charges = describeParkingCharges(tags)
    if (charges) {
      ret.push('Charges: ', charges)
    }
  } else {
    // TODO: None amenity parking, so part of another shop/service.

  }

  return ret.join(' ')
}

function pushIfTruthyWithYes (tags, tag, buffer, description, descriptionSingular) {
  let value = tags[tag]
  if (value) {
    if (value === 'yes') {
      buffer.push(' ', description)
    } else if (isNumber(value)) {
      buffer.push(' ', value, ' ', (value === '1' && descriptionSingular) ? descriptionSingular : description)
    }
  }
}

/**
 * Describe toilets
 * @param {Object} tags OSM properties
 * @return Object
 */
export function describeToilets (tags) {
  let ret = []

  if (tags.amenity === 'toilets') {
  } else {
    // TODO: None amenity, so part of shop/service.
    if (tags.toilets && tags.toilets === 'customers') {
      ret.push('Customer toilets')
      let wheelchairAccess = tags['toilets:wheelchair']
      if (wheelchairAccess && wheelchairAccess !== 'no') {
        if (wheelchairAccess === 'yes') {
          ret.push('with wheelchair access')
        } else {
          ret.push(wheelchairAccess)
        }
      }
    }
  }

  return ret.join(' ')
}

function describeParkingCharges (tags) {
  let tagsMap = new Map(Object.entries(tags))

  let hourlyCharges = []
  let otherCharges = []

  tagsMap
    .forEach(function (value, key, map) {
      let subTags = key.split(':')
      // @ts-ignore
      let prettyValue = value.replace(' GBP', '').replace('£', '&pound;')
      if (key.startsWith('fee:amount:')) {
        let match = subTags[2].match(/(\d)_hour/)
        if (match) {
          // console.log(match)
          hourlyCharges.push(`${match[1]} hour${match[1] === '1' ? '' : 's'}: ${prettyValue}`)
        } else {
          otherCharges.push(`${subTags[2]}: ${prettyValue}`)
        }
      }
    })

  return (hourlyCharges.join(', ') + ' ' + otherCharges.join('. ')).trim()
}

/**
 * Title case a string, replace underscore with spaces
 * @param {string} value string to prettify
 * @returns {string} pretry value
 */
function prettyTitleCase (value) {
  if (value) return titleCase(value.replace(/_/g, ' '))
}

/*
let tagToIgnore =
  '@id,name,NAME,NameS,addr:housename,addr:street,addr:city,addr:country,level,description,wheelchair,wheelchair:description,operator,' +
  'opening_hours,access,centralkey,fee,fee:ChannelMergerNode,amenity,toilets:wheelchair,mapFeature,Addr Interpolation,' +
  'OBJECTID,Opening,UPRN,lon,lat,Address,Y,X,altitudeMode,OBJECTI,key,addr:housenumber,addr:postcode,' +
  'website,email,phone,source:addr, park_ride, type, Maintenance, Maxheight, Salting Ref, ' +
  'brand,brand:wikidata,brand:wikipedia' +
  ',building,toilets:disposal,addr:city,addr:country,kitchen_hours,fhrs:id,layer,dataSupplier,dataLastUpdated'.split(',')
*
let dataImprover = {
  'capacity:disabled': 'Number of Blue Badge spaces',
  'capacity:parent': 'Number of Parent and Child spaces',
  'fee:amount:per_hour': 'Carpark Charge (per hour)',
  'fee:amount': 'Carpark Charge',
  'centralkey': 'RADAR Key Required',
  'access': 'Access',
  'kitchen_hours': 'Kitchen Opening Times',
  'opening_hours': 'Opening Times',
  'addr:housenumber': '',
  'addr:street': '',
  'addr:postcode': '',
  'level': 'Level',
  'description': '',
  'wheelchair:description': '',
  'wheelchair': { label: '',
    value: function (tagValue) {
      switch (tagValue) {
        case 'no':return 'NO WHEELCHAIR ACCESS'
        case 'yes':return 'Wheelchair accessible'
        case 'limited':return 'Limited wheelchair access'
        default:return ''
      }
    } },
  'toilets:wheelchair': 'Wheelchair Accessible Toilets',
  'fee:charge': 'Fee',
  'operator': 'Operated By'
} */

/*
  // return a labelled value if the value is valid, nothing otherwise
  label (valueName, postValue, postLabel) {
    let value = ''

    try {
      value = this.tags[valueName]
    } catch (error) {

    }

    if (!value) { return '' }
    // look for any overrides or improvements and apply them if found
    let dataImprovement = dataImprover[valueName]
    let prettyLabel, prettyValue
    // let improverType = typeof (dataImprovement)
    switch (typeof (dataImprovement)) {
      case 'string':
        prettyLabel = dataImprovement
        prettyValue = value
        break
      case 'object':
        prettyLabel = dataImprovement.label
        prettyValue = dataImprovement.value(value)
        break
      default:
        prettyLabel = titleCase(valueName.replace(/[:|-|_]/gi, ' '))
        prettyValue = value
    }

    // console.log(prettyLabel,prettyValue);
    let ret =
           ((prettyLabel) ? `<strong>${prettyLabel}:</strong>&nbsp;` + (postLabel || '') : '') +
           prettyValue +
           ((postValue) || '')

    return ret
  }
*/
