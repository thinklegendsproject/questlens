import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, addDoc, collection, updateDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '../config/firebase';

const TeamScreen = () => {
  const [teamData, setTeamData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teamName, setTeamName] = useState('');

  const auth = getAuth(app);
  const db = getFirestore(app);

  const fetchUserAndTeamData = async () => {
    setLoading(true);
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const fetchedUserData = userDocSnap.data();
        setUserData(fetchedUserData);
        if (fetchedUserData.teamId) {
          const teamDocRef = doc(db, 'teams', fetchedUserData.teamId);
          const teamDocSnap = await getDoc(teamDocRef);
          if (teamDocSnap.exists()) {
            setTeamData(teamDocSnap.data());
          }
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserAndTeamData();
  }, []);

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      Alert.alert('Error', 'Please enter a team name.');
      return;
    }
    const user = auth.currentUser;
    if (user) {
      try {
        const newTeamRef = await addDoc(collection(db, 'teams'), {
          name: teamName,
          creatorId: user.uid,
          members: [user.uid],
          level: 1,
          xp: 0,
          createdAt: serverTimestamp(),
        });

        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
          teamId: newTeamRef.id,
        });

        Alert.alert('Success', 'Team created successfully!');
        fetchUserAndTeamData(); // Refresh data to show the new team view
      } catch (error) {
        Alert.alert('Error', 'Could not create team. Please try again.');
        console.error('Error creating team: ', error);
      }
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#8C2BEE" />
      </View>
    );
  }

  // If user is on a team, show the team view
  if (teamData) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{teamData.name}</Text>
        <Text style={styles.memberHeader}>Members:</Text>
        {teamData.members.map((memberId) => (
          <Text key={memberId} style={styles.memberText}>{memberId}</Text>
        ))}
      </View>
    );
  }

  // If user is not on a team, show the create team view
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a Team</Text>
      <TextInput
        style={styles.input}
        placeholder="Team Name"
        placeholderTextColor="#999"
        value={teamName}
        onChangeText={setTeamName}
      />
      <TouchableOpacity style={styles.button} onPress={handleCreateTeam}>
        <Text style={styles.buttonText}>Create Team</Text>
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
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        backgroundColor: '#12162A',
        color: '#FFFFFF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    button: {
        width: '100%',
        backgroundColor: '#8C2BEE',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    memberHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 10,
    },
    memberText: {
        fontSize: 16,
        color: '#A0A0A0',
        marginBottom: 5,
    },
});

export default TeamScreen;
