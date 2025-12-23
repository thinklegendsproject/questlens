import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ActivityCard = ({ userName, questTitle, timestamp }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardText}>
        <Text style={styles.userName}>{userName}</Text> completed the quest: "{questTitle}"
      </Text>
      <Text style={styles.timestamp}>{timestamp}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#12162A',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  cardText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  userName: {
    fontWeight: 'bold',
    color: '#8C2BEE',
  },
  timestamp: {
    color: '#A0A0A0',
    fontSize: 12,
    marginTop: 10,
    textAlign: 'right',
  },
});

export default ActivityCard;
