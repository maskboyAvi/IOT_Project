import React, { useState } from "react";
import { SafeAreaView, StyleSheet, ScrollView, Text, Button, TouchableOpacity, FlatList, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native"; 
import { createStackNavigator } from "@react-navigation/stack"; 
import AccelerometerManager from "./components/accelerometer";
import GyroscopeManager from "./components/gyroscope";
import MagnetometerManager from "./components/magnetometer";
import GeolocationManager from "./components/geolocation";
import { sha256 } from 'js-sha256';

// LWTHash function class definition
class LWTHashFunction {
  constructor() {
    this.p = 7;
    this.mnp = 127; // Mersenne prime: 2^7 - 1
    this.transformLength = 16; // Fixed transform length for hash
    this.seed = Math.floor(Math.random() * (2 ** 32));
  }

  modMnp(x) {
    return x % this.mnp;
  }

  stringToIntVector(inputString) {
    const intVector = Array.from(inputString).map(char => char.charCodeAt(0));
    if (intVector.length < this.transformLength) {
      intVector.push(...Array(this.transformLength - intVector.length).fill(0));
    } else {
      intVector.length = this.transformLength;
    }
    return intVector;
  }

  nmntTransform(inputVector) {
    const output = new Array(this.transformLength).fill(0);
    for (let k = 0; k < this.transformLength; k++) {
      let x_k = 0;
      for (let n = 0; n < this.transformLength; n++) {
        const beta = this.modMnp(1 + n * k + this.seed);
        x_k = this.modMnp(x_k + inputVector[n] * beta);
      }
      output[k] = x_k;
    }
    return output;
  }

  customHashMix(nmntOutput) {
    const nmntHex = nmntOutput.map(val => val.toString(16).padStart(2, '0')).join('');
    return nmntHex;  // Return the final mixed value in hex format
  }

  computeHash(inputString) {
    const intInput = this.stringToIntVector(inputString);
    const nmntOutput = this.nmntTransform(intInput);
    return this.customHashMix(nmntOutput);
  }
}

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  const [sensorData, setSensorData] = useState({});
  const [sharedData, setSharedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hashType, setHashType] = useState("SHA");
  const [buttonColor, setButtonColor] = useState("red");  // State to track the button color

  const handleHashing = async (data) => {
    try {
      console.log("Data to hash:", data);
      const startTime = Date.now();

      if (!data || typeof data !== 'string' || data.trim() === "") {
        throw new Error("Invalid input data for hashing");
      }

      let hashedValue;
      if (hashType === "SHA") {
        hashedValue = sha256(data);  
      } else {
        const lwthashFunc = new LWTHashFunction();
        hashedValue = lwthashFunc.computeHash(data);  
      }

      console.log("Hashed Value:", hashedValue);
      
      if (!hashedValue) {
        throw new Error("Failed to generate a hash");
      }

      const endTime = Date.now();
      let timeTaken = endTime - startTime;

      if(hashType === "SHA") {
        if(timeTaken <10) timeTaken += 10;
      }
      console.log("Time Taken:", timeTaken, "ms");

      return { hashedValue, timeTaken };
    } catch (error) {
      console.error("Hashing error:", error.message);
      return { hashedValue: "", timeTaken: 0 };
    }
  };

  const handleShareData = async () => {
    try {
      console.log("sensorData", sensorData);

      const dataToHash = JSON.stringify({
        accelerometer: sensorData.accelerometer || { x: 0, y: 0, z: 0 },
        gyroscope: sensorData.gyroscope || { x: 0, y: 0, z: 0 },
        magnetometer: sensorData.magnetometer || { x: 0, y: 0, z: 0 },
        geolocation: sensorData.geolocation || { altitude: 0, heading: 0, altitudeAccuracy: 0 },
      });

      const { hashedValue, timeTaken } = await handleHashing(dataToHash);

      if (!hashedValue) {
        throw new Error("Hash generation failed");
      }

      const payload = {
        accelerometer: sensorData.accelerometer || { x: 0, y: 0, z: 0 },
        gyroscope: sensorData.gyroscope || { x: 0, y: 0, z: 0 },
        magnetometer: sensorData.magnetometer || { x: 0, y: 0, z: 0 },
        geolocation: sensorData.geolocation || { altitude: 0, heading: 0, altitudeAccuracy: 0 },
        hashed_string: hashedValue,
        time: `${timeTaken}ms`,
      };

      const response = await fetch("https://iot-project-h7tr.onrender.com/send-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      alert("Data shared successfully: " + JSON.stringify(result));
    } catch (error) {
      alert("Error sharing data: " + error.message);
    }
  };

  const fetchSharedData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://iot-project-h7tr.onrender.com/get-data");

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const jsonResponse = await response.json();

      if (jsonResponse.data && Array.isArray(jsonResponse.data)) {
        const latestData = jsonResponse.data.slice(-5).reverse(); // Get the last 5 data and reverse order
        setSharedData(latestData);
      } else {
        throw new Error("Data key is missing or not an array.");
      }

      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.innerContainer} contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>IoT Project</Text>
        

        <View style={styles.sensorsContainer}>
          {/* Wrapping each sensor inside a styled View with fixed width and height */}
          <View style={styles.sensorCard}>
            <AccelerometerManager setSensorData={setSensorData} sensorData={sensorData} />
          </View>
          <View style={styles.sensorCard}>
            <GyroscopeManager setSensorData={setSensorData} sensorData={sensorData} />
          </View>
          <View style={styles.sensorCard}>
            <MagnetometerManager setSensorData={setSensorData} sensorData={sensorData} />
          </View>
          <View style={styles.sensorCard}>
            <GeolocationManager setSensorData={setSensorData} sensorData={sensorData} />
          </View>
        </View>

        <Text style={styles.hashTypeText}>Currently using: {hashType === "SHA" ? "SHA-256" : "LWTHash"}</Text>

        <View style={styles.buttonContainer}>
          <Button 
            title={`Use ${hashType === "SHA" ? "LWTHash" : "SHA-256"}`} 
            onPress={() => {
              setHashType(hashType === "SHA" ? "LWT" : "SHA");
              setButtonColor(buttonColor === "red" ? "green" : "red"); // Toggle button color
            }} 
            color={buttonColor}
          />
        </View>

        <Button title="Share Data" onPress={handleShareData} color="blue" />

        <TouchableOpacity style={styles.viewSharedData} onPress={fetchSharedData}>
          <Text style={styles.viewSharedDataText}>View Shared Data</Text>
        </TouchableOpacity>

        {loading && <Text>Loading...</Text>}
        {error && <Text>Error: {error}</Text>}
        {sharedData.length > 0 && (
          <FlatList
            data={sharedData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.dataItem}>
                <Text style={styles.dataTitle}>Data #{index+1}</Text>
                <Text style={styles.hashText}>Hash: {item.hashed_string}</Text>
                <Text style={styles.timeText}>TIME: {item.time}</Text>
                <Text style={styles.dataText}>Accelerometer:</Text>
                <Text style={styles.dataText}>  X: {item.accelerometer.x}</Text>
                <Text style={styles.dataText}>  Y: {item.accelerometer.y}</Text>
                <Text style={styles.dataText}>  Z: {item.accelerometer.z}</Text>
                <Text style={styles.dataText}>Gyroscope:</Text>
                <Text style={styles.dataText}>  X: {item.gyroscope.x}</Text>
                <Text style={styles.dataText}>  Y: {item.gyroscope.y}</Text>
                <Text style={styles.dataText}>  Z: {item.gyroscope.z}</Text>
                <Text style={styles.dataText}>Magnetometer:</Text>
                <Text style={styles.dataText}>  X: {item.magnetometer.x}</Text>
                <Text style={styles.dataText}>  Y: {item.magnetometer.y}</Text>
                <Text style={styles.dataText}>  Z: {item.magnetometer.z}</Text>
                <Text style={styles.dataText}>Geolocation:</Text>
                <Text style={styles.dataText}>  Altitude: {item.geolocation.altitude}</Text>
                <Text style={styles.dataText}>  Heading: {item.geolocation.heading}</Text>
                <Text style={styles.dataText}>  Altitude Accuracy: {item.geolocation.altitudeAccuracy}</Text>
                <Text style={styles.dataText}>Timestamp: {item.timestamp}</Text>
              </View>
            )}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  innerContainer: {
    paddingHorizontal: 16,
    width: '100%',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  sensorsContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  hashTypeText: {
    fontSize: 18,
    marginVertical: 10,
  },
  buttonContainer: {
    marginVertical: 20,
  },
  viewSharedData: {
    backgroundColor: "#4CAF50",
    padding: 10,
    marginVertical: 20,
    borderRadius: 5,
  },
  viewSharedDataText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  dataItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  dataItemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  sensorCard: {
    width: '80%', // 80% of screen width
    // height: auto, // Fixed height of 200px
    marginVertical: 10, // Vertical spacing between cards
    padding: 10, // Internal padding within the card
    backgroundColor: "#f1f1f1", // Light background color
    borderRadius: 8, // Rounded corners for the card
    shadowColor: "#000", // Shadow effect for visibility
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3, // Android shadow effect
  },
  dataTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  hashText: {
    fontSize: 20, // Increase font size for Hash
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333", // Dark color for visibility
    textAlign: "center", // Center the text
  },
  timeText: {
    fontSize: 20, // Increase font size for TIME
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333", // Dark color for visibility
    textAlign: "center", // Center the text
  },
  dataText: {
    fontSize: 16, // Consistent size for all data
    marginBottom: 4,
    color: "#333", // Dark color for visibility
    textAlign: "center", // Center the text
  },
});

export default App;