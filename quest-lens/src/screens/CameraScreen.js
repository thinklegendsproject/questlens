import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../config/firebase';

const CameraScreen = ({ route, navigation }) => {
  const { userQuestId } = route.params; // Assumes userQuestId is passed as a route param
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);
  const storage = getStorage(app);
  const db = getFirestore(app);
  const auth = getAuth(app);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });
        const response = await fetch(photo.uri);
        const blob = await response.blob();

        const user = auth.currentUser;
        if (!user) {
          Alert.alert("Error", "You need to be logged in to submit a quest.");
          return;
        }

        const storageRef = ref(storage, `quest_submissions/${user.uid}/${userQuestId}_${new Date().toISOString()}`);
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);

        const userQuestRef = doc(db, "userQuests", userQuestId);
        await updateDoc(userQuestRef, {
          submissionUrl: downloadURL,
          status: 'pending_validation',
        });

        Alert.alert("Success!", "Your submission has been uploaded for validation.");
        navigation.goBack();

      } catch (error) {
        console.error("Error capturing or uploading image: ", error);
        Alert.alert("Error", "Could not submit quest. Please try again.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={Camera.Constants.Type.back} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleCapture}>
            <Text style={styles.buttonText}>Capture</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    camera: {
      flex: 1,
    },
    buttonContainer: {
      flex: 1,
      backgroundColor: 'transparent',
      flexDirection: 'row',
      margin: 20,
      justifyContent: 'center',
      alignItems: 'flex-end',
    },
    button: {
      alignSelf: 'flex-end',
      alignItems: 'center',
      backgroundColor: '#8C2BEE',
      borderRadius: 50,
      padding: 20,
    },
    buttonText: {
      fontSize: 18,
      color: 'white',
    },
  });

export default CameraScreen;
