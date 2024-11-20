import React, { useState, useEffect } from 'react';
import { Text, Switch, View } from 'react-native';
import { Magnetometer } from 'expo-sensors';
import styles from '../styles';

const MagnetometerManager = ({ setSensorData, sensorData, mqttClient, deviceId }) => {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [magnetometerActive, setMagnetometerActive] = useState(false);

  useEffect(() => {
    let subscription;

    const startMagnetometerUpdates = () => {
      Magnetometer.setUpdateInterval(1000);
      subscription = Magnetometer.addListener((magnetometerData) => {
        if (magnetometerData) {
          // Send magnetometer data to MQTT if active
          if (magnetometerActive && mqttClient && deviceId) {
            const mqttData = JSON.stringify({
              magnetometer: {
                x: parseFloat(magnetometerData.x.toFixed(5)),
                y: parseFloat(magnetometerData.y.toFixed(5)),
                z: parseFloat(magnetometerData.z.toFixed(5)),
              },
            });
            mqttClient.publish(`/v1/${deviceId}/data`, mqttData, 0, false);
          }

          // Update local state
          setData({
            x: magnetometerData.x.toFixed(5),
            y: magnetometerData.y.toFixed(5),
            z: magnetometerData.z.toFixed(5),
          });

          // Update global sensor data state
          setSensorData((prevData) => ({
            ...prevData,
            magnetometer: {
              x: magnetometerData.x.toFixed(5),
              y: magnetometerData.y.toFixed(5),
              z: magnetometerData.z.toFixed(5),
            },
          }));
        } else {
          console.warn("Magnetometer data is not available");
        }
      });
    };

    if (magnetometerActive) {
      startMagnetometerUpdates();
    }

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [magnetometerActive, mqttClient, deviceId, setSensorData]);

  const toggleMagnetometer = (value) => {
    setMagnetometerActive(value);
  };

  return (
    <View style={styles.widget}>
      <Text style={styles.welcome}>Magnetometer</Text>
      <Text style={styles.dataText}>x: {data.x}</Text>
      <Text style={styles.dataText}>y: {data.y}</Text>
      <Text style={styles.dataText}>z: {data.z}</Text>
      <Switch
        style={styles.switch}
        onValueChange={toggleMagnetometer}
        value={magnetometerActive}
      />
      <Text style={styles.switchLabel}>
        {magnetometerActive ? "Magnetometer Active" : "Magnetometer Inactive"}
      </Text>
    </View>
  );
};

export default MagnetometerManager;
