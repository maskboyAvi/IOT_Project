import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, FlatList, View, Button } from "react-native";

export default function SharedDataPage() {
  const [sharedData, setSharedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // To store error messages

  // Function to fetch shared data from the API
  const fetchSharedData = async () => {
    console.log("Starting fetch...");

    try {
      const response = await fetch("https://iot-project-h7tr.onrender.com/get-data");

      // Check if response status is ok
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const jsonResponse = await response.json();

      console.log("API Response:", jsonResponse); // Log full API response

      if (jsonResponse.data && Array.isArray(jsonResponse.data)) {
        setSharedData(jsonResponse.data);  // Update state with the fetched data
        console.log("Data set:", jsonResponse.data);
      } else {
        throw new Error("Data key is missing or not an array.");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching shared data:", error);
      setError(error.message); // Set error message state
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSharedData(); // Fetch data when the component mounts
  }, []); // Empty dependency array ensures this only runs once on component mount

  // Reload the data when the user presses the "Refresh" button
  const handleRefresh = () => {
    setLoading(true);  // Set loading state before fetching again
    setError(null);    // Clear any previous error messages
    fetchSharedData();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
        <Button title="Retry" onPress={handleRefresh} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Error: {error}</Text>
        <Button title="Retry" onPress={handleRefresh} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={sharedData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.dataItem}>
            <Text>{JSON.stringify(item, null, 2)}</Text>  {/* Display item data */}
          </View>
        )}
      />
      <Button title="Refresh" onPress={handleRefresh} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  dataItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    width: "90%",
  },
});
