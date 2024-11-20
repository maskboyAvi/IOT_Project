import React, { useState, useEffect } from 'react';
import { Text, Switch, View } from 'react-native';
import { Accelerometer } from 'expo-sensors'; // Corrected import for Accelerometer
import styles from '../styles';

const AccelerometerManager = ({ setSensorData, sensorData }) => {
  const [accelerometerData, setAccelerometerData] = useState({ x: 0, y: 0, z: 0 });
  const [accelerometerActive, setAccelerometerActive] = useState(false);

  useEffect(() => {
    let subscription;

    const startAccelerometerUpdates = () => {
      Accelerometer.setUpdateInterval(1000); // Set interval for updates
      subscription = Accelerometer.addListener((accelData) => {
        // Update the accelerometerData state
        setAccelerometerData({
          x: accelData.x.toFixed(5),
          y: accelData.y.toFixed(5),
          z: accelData.z.toFixed(5),
        });

        // Update the global sensorData in the App component
        setSensorData((prevData) => ({
          ...prevData,
          accelerometer: {
            x: accelData.x.toFixed(5),
            y: accelData.y.toFixed(5),
            z: accelData.z.toFixed(5),
          },
        }));
      });
    };

    if (accelerometerActive) {
      startAccelerometerUpdates();
    }

    return () => {
      if (subscription) {
        subscription.remove();
        console.log("Accelerometer subscription removed");
      }
    };
  }, [accelerometerActive, setSensorData]); // Only re-run if accelerometerActive or setSensorData changes

  const toggleAccelerometer = (value) => {
    setAccelerometerActive(value);
  };

  return (
    <View style={styles.widget}>
      <Text style={styles.welcome}>Accelerometer</Text>
      <Text style={styles.dataText}>x: {accelerometerData.x}</Text>
      <Text style={styles.dataText}>y: {accelerometerData.y}</Text>
      <Text style={styles.dataText}>z: {accelerometerData.z}</Text>
      <Switch
        style={styles.switch}
        onValueChange={toggleAccelerometer}
        value={accelerometerActive}
      />
      <Text style={styles.switchLabel}>
        {accelerometerActive ? "Accelerometer Active" : "Accelerometer Inactive"}
      </Text>
    </View>
  );
};

export default AccelerometerManager;
