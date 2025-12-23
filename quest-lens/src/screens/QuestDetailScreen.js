import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../config/firebase';

const QuestDetailScreen = ({ route, navigation }) => {
  const { quest } = route.params;
  const db = getFirestore(app);
  const auth = getAuth(app);

  const handleJoinQuest = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await addDoc(collection(db, 'userQuests'), {
          userId: user.uid,
          questId: quest.id,
          status: 'active',
          progress: 0,
        });
        Alert.alert('Quest Joined!', 'You can now find this quest in your active quests.');
        navigation.goBack();
      } catch (error) {
        Alert.alert('Error', 'Could not join quest. Please try again.');
        console.error('Error joining quest: ', error);
      }
    } else {
      Alert.alert('Not Logged In', 'You must be logged in to join a quest.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{quest.title}</Text>
      <Text style={styles.description}>Complete this quest to earn rewards.</Text>
      <View style={styles.rewardContainer}>
        <Text style={styles.rewardText}>XP: {quest.xp}</Text>
        <Text style={styles.rewardText}>Coins: {quest.coins}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleJoinQuest}>
        <Text style={styles.buttonText}>Join Quest</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F1A',
    paddingTop: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#A0A0A0',
    textAlign: 'center',
    marginBottom: 30,
  },
  rewardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
  },
  rewardText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#8C2BEE',
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 25,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default QuestDetailScreen;
