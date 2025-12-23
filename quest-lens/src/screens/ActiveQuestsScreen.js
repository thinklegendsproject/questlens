import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const activeQuests = [
  { id: '1', title: 'Find a Red Bicycle', progress: '1/1' },
  { id: '4', title: 'Capture a Sunset', progress: '0/1' },
];

const ActiveQuestsScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.questCard} onPress={() => navigation.navigate('Camera')}>
      <Text style={styles.questTitle}>{item.title}</Text>
      <Text style={styles.questProgress}>{item.progress}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Active Quests</Text>
      <FlatList
        data={activeQuests}
        renderItem={renderItem}
        keyExtractor={item => item.id}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  questProgress: {
    color: '#A0A0A0',
    fontSize: 14,
  },
});

export default ActiveQuestsScreen;
