import React, { useState, useEffect } from 'react';
import { Text, Switch, View } from 'react-native';
import * as Location from 'expo-location';
import styles from '../styles';

const GeolocationManager = ({ setSensorData, sensorData }) => {
  const [data, setData] = useState('');
  const [mapActive, setMapActive] = useState(false);
  const [watchSubscription, setWatchSubscription] = useState(null);

  useEffect(() => {
    const getCurrentPosition = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let position = await Location.getCurrentPositionAsync({});
      setData(position.coords);

      // Update sensorData with the current geolocation data
      setSensorData((prevData) => ({
        ...prevData,
        geolocation: position.coords,
      }));

      const subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 1 },
        (position) => {
          const currentData = position.coords;

          if (mapActive) {
            // Update sensorData with the new geolocation data
            setSensorData((prevData) => ({
              ...prevData,
              geolocation: currentData,
            }));
          }

          setData(currentData);
        }
      );

      setWatchSubscription(subscription);
    };

    if (mapActive) {
      setData('Getting current position...');
      getCurrentPosition();
    }

    return () => {
      if (watchSubscription) {
        watchSubscription.remove();
      }
    };
  }, [mapActive, setSensorData]);

  const toggleMap = (value) => {
    setData('');
    setMapActive(value);
  };

  return (
    <View style={styles.widget}>
      <Text style={styles.welcome}>  Geolocation  </Text>
      <Text style={styles.title}>Current position:</Text>
      <Text>{data ? `Latitute: ${data.latitude},\nLongitude: ${data.longitude}` : "No data available"}</Text>
      <Switch
        style={styles.switch}
        onValueChange={toggleMap}
        value={mapActive}
      />
      <Text style={styles.switchLabel}>
        {mapActive ? "Tracking Active" : "Tracking Inactive"}
      </Text>
    </View>
  );
};

export default GeolocationManager;
