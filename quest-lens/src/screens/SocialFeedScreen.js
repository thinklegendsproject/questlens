import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { getFirestore, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { app } from '../config/firebase';
import ActivityCard from '../components/ActivityCard';

const SocialFeedScreen = () => {
  const [feedData, setFeedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore(app);

  useEffect(() => {
    const q = query(collection(db, 'socialFeed'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const feedItems = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userName: data.userName,
          questTitle: data.questTitle,
          // Convert Firestore timestamp to a readable format
          timestamp: data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleDateString() : 'Just now',
        };
      });
      setFeedData(feedItems);
      setLoading(false);
    });

    return () => unsubscribe(); // Unsubscribe when component unmounts
  }, []);

  const renderItem = ({ item }) => (
    <ActivityCard
      userName={item.userName}
      questTitle={item.questTitle}
      timestamp={item.timestamp}
    />
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#8C2BEE" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Social Feed</Text>
      <FlatList
        data={feedData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No social activity yet.</Text>}
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
    emptyText: {
        color: '#A0A0A0',
        textAlign: 'center',
        marginTop: 50,
    }
  });

export default SocialFeedScreen;
