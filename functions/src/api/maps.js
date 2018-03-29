import * as functions from 'firebase-functions'
import axios from 'axios'

const endpoint = 'https://maps.googleapis.com/maps/api/geocode/json'
const locationType = 'ROOFTOP'
const resultType = 'street_address'

export const getAddress = (lat, long) => {
    console.log(`Getting address. Lat, long: ${lat}, ${long}`)

    const mapsConfig = functions.config().maps

    if (mapsConfig) {
        return new Promise((resolve, reject) => {
            const getAddressComponent = (components, key) => {
                const addressComponent = components.find(component => component.types.includes(key))
                return addressComponent ? addressComponent.short_name : undefined
            }

            const processResponse = (response) => {
                const result = response.data.results[0]
                if (result) {
                    const {
                        formatted_address: formattedAddress,
                        address_components: components
                    } = result

                    const streetNumber = getAddressComponent(components, 'street_number')
                    const route = getAddressComponent(components, 'route')
                    const sublocality = getAddressComponent(components, 'sublocality')
                    const locality = getAddressComponent(components, 'locality')
                    const country = getAddressComponent(components, 'country')
                    const postalCode = getAddressComponent(components, 'postal_code')

                    return {
                        route,
                        sublocality,
                        locality,
                        country,
                        street_number: streetNumber,
                        postal_code: postalCode,
                        formatted_address: formattedAddress
                    }
                }
                return null
            }

            const params = {
                latlng: `${lat},${long}`,
                location_type: locationType,
                result_type: resultType,
                key: mapsConfig.api.key
            }

            axios
                .get(endpoint, { params })
                .then((response) => resolve(processResponse(response)))
        })
    } else {
        throw new Error('No google maps config: maps.api.key')
    }
}
