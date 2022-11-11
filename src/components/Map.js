import { useEffect, useState } from 'react'
import { Dimensions, Text, StyleSheet } from 'react-native'
import MapView, { Callout, Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { LANGARA } from '../constants/coordinates'
import * as Location from 'expo-location'

const Map = () => {
  const [pin, setPin] = useState({
    latitude: LANGARA.latitutde,
    longitude: LANGARA.longitude
  })

  useEffect(() => {
    ;(async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        console.log('Permission to access location was denied')
        return
      }

      let location = await Location.getCurrentPositionAsync({})
      console.log('LOCATION', location)

      setPin({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      })
    })()
  }, [])

  return (
    <MapView
      initialRegion={{
        latitude: LANGARA.latitutde,
        longitude: LANGARA.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }}
      showsUserLocation={true}
      onUserLocationChange={e => {
        console.log('onUserLocationChange', e.nativeEvent.coordinate)

        setPin({
          latitude: e.nativeEvent.coordinate.latitude,
          longitude: e.nativeEvent.coordinate.longitude
        })
      }}
      provider={PROVIDER_GOOGLE}
      style={styles.map}
    >
      <Marker
        coordinate={pin}
        pinColor='navy'
        description='Langara College'
        draggable={true}
        onDragStart={e => {
          console.log('Drag Start', e.nativeEvent.coordinate)
        }}
        onDragEnd={e => {
          console.log('Drag End', e.nativeEvent.coordinate)

          setPin({
            latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude
          })
        }}
      >
        <Callout>
          <Text>This is the best college in Vancouver.</Text>
        </Callout>
      </Marker>
      <Circle center={pin} radius={1000} />
    </MapView>
  )
}

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
})

export default Map
