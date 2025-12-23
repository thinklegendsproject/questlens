import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { app } from '../config/firebase';

const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);
  const [completedQuests, setCompletedQuests] = useState([]);
  const [loading, setLoading] = useState(true);

  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (user) {
        // Fetch user profile data
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
        }

        // Fetch completed quests
        const questsQuery = query(
          collection(db, 'userQuests'),
          where('userId', '==', user.uid),
          where('status', '==', 'completed')
        );
        const questsSnapshot = await getDocs(questsQuery);

        // Fetch quest details for each completed userQuest
        const questsPromises = questsSnapshot.docs.map(async (docSnap) => {
            const userQuestData = docSnap.data();
            const questDocRef = doc(db, 'quests', userQuestData.questId);
            const questDocSnap = await getDoc(questDocRef);
            return questDocSnap.exists() ? { id: docSnap.id, ...questDocSnap.data() } : null;
        });

        const quests = (await Promise.all(questsPromises)).filter(Boolean);
        setCompletedQuests(quests);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    signOut(auth).catch(error => console.error('Logout Error: ', error));
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#8C2BEE" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.questItem}>
      <Text style={styles.questTitle}>{item.title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.email}>{userData?.email}</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutButton}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{userData?.level || 1}</Text>
          <Text style={styles.statLabel}>Level</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{userData?.xp || 0}</Text>
          <Text style={styles.statLabel}>XP</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{userData?.coins || 0}</Text>
          <Text style={styles.statLabel}>Coins</Text>
        </View>
      </View>
      <Text style={styles.sectionTitle}>Completed Quests</Text>
      <FlatList
        data={completedQuests}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={{color: '#A0A0A0', textAlign: 'center'}}>No quests completed yet.</Text>}
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    email: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    logoutButton: {
        fontSize: 16,
        color: '#8C2BEE',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 30,
    },
    stat: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    statLabel: {
        fontSize: 14,
        color: '#A0A0A0',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 15,
    },
    questItem: {
        backgroundColor: '#12162A',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
    },
    questTitle: {
        color: '#FFFFFF',
        fontSize: 16,
    },
});

export default ProfileScreen;
