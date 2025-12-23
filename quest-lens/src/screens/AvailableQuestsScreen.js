import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../config/firebase';

const AvailableQuestsScreen = ({ navigation }) => {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore(app);

  useEffect(() => {
    const fetchQuests = async () => {
      const questsCollection = collection(db, 'quests');
      const questSnapshot = await getDocs(questsCollection);
      const questsList = questSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQuests(questsList);
      setLoading(false);
    };

    fetchQuests();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.questCard} onPress={() => navigation.navigate('QuestDetail', { quest: item })}>
      <Text style={styles.questTitle}>{item.title}</Text>
      <View style={styles.rewardContainer}>
        <Text style={styles.rewardText}>XP: {item.xp}</Text>
        <Text style={styles.rewardText}>Coins: {item.coins}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#8C2BEE" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Quests</Text>
      <FlatList
        data={quests}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No quests available right now.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F1A',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  questCard: {
    backgroundColor: '#12162A',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  questTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  rewardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  rewardText: {
    color: '#A0A0A0',
    fontSize: 14,
  },
});

export default AvailableQuestsScreen;
