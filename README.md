# IoT Project: Lightweight Hashing for IoT Data Security

This repository contains the implementation of a semester IoT project focused on securing sensor data using cryptographic hashing techniques. The project integrates multiple IoT sensors, collects real-time data, and applies lightweight cryptographic hash functions to ensure efficient and secure data transmission. This implementation is based on the paper **"LNMNT - New Mersenne Number based Lightweight Crypto Hash Function for IoT"**.

---

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Implemented Sensors](#implemented-sensors)
- [Hash Functions](#hash-functions)
- [Project Workflow](#project-workflow)
- [Installation and Setup](#installation-and-setup)
- [Performance Comparison](#performance-comparison)
- [Team Members](#team-members)
---

## Introduction

IoT devices generate vast amounts of data, making it critical to secure this data efficiently for resource-constrained environments. This project implements the **LNMNT lightweight hash function**, a cryptographic technique designed to reduce computational overhead while ensuring robust security. We compare LNMNT's performance with the widely used **SHA-256** hash function to demonstrate its effectiveness.

---

## Features

1. **Lightweight Cryptographic Hashing**:
   - Implemented the LNMNT hash function using Mersenne primes for optimized performance on IoT devices.
   - Real-time comparison with SHA-256.

2. **Sensor Data Collection**:
   - Integrated real-time data collection from accelerometer, gyroscope, magnetometer, and geolocation sensors.

3. **Data Sharing**:
   - Secure transmission of hashed sensor data to a server.
   - Retrieval and display of recent shared data.

4. **Performance Metrics**:
   - Real-time calculation of hashing time for both algorithms.
   - Performance visualization and logging.

5. **User Interaction**:
   - Dynamic toggling between hash algorithms with visual feedback (button color changes).

---

## Implemented Sensors

- **Accelerometer**: Measures acceleration along x, y, and z axes.
- **Gyroscope**: Captures rotational motion data.
- **Magnetometer**: Detects magnetic field variations.
- **Geolocation**: Tracks position (latitude, longitude, altitude, and heading).

---

## Hash Functions

### 1. **LNMNT Hash Function**
   - Based on Mersenne primes for modular arithmetic.
   - Utilizes a Number Modulo Transform (NMNT) for efficient hashing.
   - Outputs a hexadecimal hash string.

### 2. **SHA-256**
   - Industry-standard cryptographic hash function.
   - Provides a 256-bit hash output.

The user can toggle between these functions to observe differences in performance and applicability to IoT use cases.

---

## Project Workflow

1. **Sensor Data Acquisition**:
   - Collect data from all sensors and format it as a JSON object.

2. **Hashing**:
   - Apply the selected hash function (LNMNT or SHA-256) to the sensor data.

3. **Data Transmission**:
   - Send hashed data and metadata to a remote server via a REST API.

4. **Data Retrieval**:
   - Fetch recent hashed data from the server for verification and display.

---

## Installation and Setup

### Prerequisites
- **Node.js** and **npm/yarn** installed.
- **React Native CLI** setup for mobile app development.
- **Expo** for geolocation and sensors management.

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/IOT_Project.git
2. Install dependencies:
    ```bash
    npm install
3. Start the application:
    ```bash
    npm run start

## Performance Comparison
The project evaluates:

- **Hashing Time**: LNMNT significantly outperforms SHA-256 on IoT devices due to reduced computational complexity.

- **Security**: While LNMNT offers lightweight security for IoT contexts, SHA-256 remains the gold standard for applications requiring stronger cryptographic guarantees.
Performance results are logged during execution for analysis.

## Team Members
1. **AVIRAL KATIYAR** - **LCS2022007**
2. **AKHILENDER BONGIRWAR** - **LCS2022011**
3. **SHISHIRO DHEERAVATH** - **LCS2022014**
4. **GYANDEEP KATIYAR** - **LCS2022019**
5. **HARSHITH CHORDIYA** - **LCS2022021**
