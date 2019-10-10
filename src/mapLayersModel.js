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
    community: 'service_community',
    communications: 'service_communications',
    ethical: 'service_ethical',
    fashion: 'service_fashion', // fashion + beauty
    food: 'service_food', // food and supermarkets?
    hardware: 'service_hardware',
    home: 'service_home', // home and garden
    hobbies: 'service_hobbies',
    health: 'service_health',
    learn: 'service_learn',
    life: 'service_life',
    other: 'service_other',
    pet: 'service_pet',
    post: 'service_post',
    spiritual: 'service_spiritual',
    finance: 'service_finance',
    transport: 'service_transport',
    variety: 'service_variety'  },
  enjoy: {
    toolbar: { tooltip: 'Get here', hint: 'Getting to and from the city', icon: 'fas fa-parking' },
    arts: 'enjoy_arts',
    adult: 'enjoy_adult',
    children: 'enjoy_children' },
  help: {
    toolbar: { tooltip: 'Get here', hint: 'Getting to and from the city', icon: 'fas fa-parking' },
    id: 'help' }
}
