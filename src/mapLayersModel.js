/** This is the layer model. It's used by the backend as constants for the layers and sub layers and
 * by the frontend as constants for displaying the layers
 */
export const layer = {
  here: {
    toolbar: { tooltip: 'Get here', hint: 'Getting to and from the city', icon: 'fas fa-parking' },
    car: 'here_car',
    bus: 'here_bus',
    train: 'here_train',
    taxi: 'here_taxi' },
  around: {
    toolbar: { tooltip: 'Get around', hint: '', icon: 'fas fa-parking' },
    wheelchair: 'around_wheelchair',
    rest: 'around_rest',
    cycle: 'around_cycle' },
  toilets: {
    toolbar: { tooltip: 'Toilets', hint: '', icon: 'fas fa-parking' },
    id: 'toilets' },
  food: {
    toolbar: { tooltip: 'Food and Drink', hint: '', icon: 'fas fa-parking' },
    id: 'food' },
  service: {
    toolbar: { tooltip: 'Shops and Services', hint: '', icon: 'fas fa-parking' },

    agricultural: 'service_agricultural',
    beauty: 'service_beauty',
    business: 'service_business',
    children: 'service_children',
    communications: 'service_communications',
    community: 'service_community',
    electricals: 'service_electricals',
    ethical: 'service_ethical',
    event:'service_event',
    fashion: 'service_fashion', // fashion + beauty
    finance: 'service_finance',
    food: 'service_food', // food and supermarkets?
    hardware: 'service_hardware',
    health: 'service_health',
    hobbies: 'service_hobbies',
    home: 'service_home', // home and garden
    learn: 'service_learn',
    life: 'service_life',
    other: 'service_other',
    pet: 'service_pet',
    post: 'service_post',
    spiritual: 'service_spiritual',
    transport: 'service_transport',
    travel: 'service_travel',
    variety: 'service_variety' },
  enjoy: {
    toolbar: { tooltip: 'Get here', hint: 'Getting to and from the city', icon: 'fas fa-parking' },
    arts: 'enjoy_arts',
    adult: 'enjoy_adult',
    children: 'enjoy_children',
    events: 'enjoy_events',
   sport:'enjoy_sport' },
  help: {
    toolbar: { tooltip: 'Get here', hint: 'Getting to and from the city', icon: 'fas fa-parking' },
    id: 'help' }
}
