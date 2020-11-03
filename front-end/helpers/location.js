import Geocode from 'react-geocode'

Geocode.setApiKey('AIzaSyAxnD5Yfll6FYErBZR1nMsQEjh67PDHvu0')
Geocode.setLanguage('en')
Geocode.setRegion('us')

const getGeolocation = ({ lat, lon }) => Geocode.fromLatLng(lat, lon)

export default getGeolocation
