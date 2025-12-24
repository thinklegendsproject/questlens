import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '../config/firebase';

const TeamChatScreen = ({ route }) => {
  const { teamId } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const messagesQuery = query(
      collection(db, 'teams', teamId, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [teamId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const user = auth.currentUser;
    if (user) {
      try {
        await addDoc(collection(db, 'teams', teamId, 'messages'), {
          text: newMessage,
          senderId: user.uid,
          senderName: user.email, // Using email as sender name
          createdAt: serverTimestamp(),
        });
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message: ', error);
      }
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.messageBubble, item.senderId === auth.currentUser?.uid ? styles.myMessage : styles.theirMessage]}>
      <Text style={styles.senderName}>{item.senderName}</Text>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 10 }}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B0F1A',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#12162A',
    },
    input: {
        flex: 1,
        backgroundColor: '#12162A',
        color: '#FFFFFF',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
    },
    sendButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#8C2BEE',
        borderRadius: 20,
        paddingHorizontal: 20,
    },
    sendButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    messageBubble: {
        marginVertical: 5,
        marginHorizontal: 10,
        padding: 10,
        borderRadius: 15,
        maxWidth: '80%',
    },
    myMessage: {
        backgroundColor: '#8C2BEE',
        alignSelf: 'flex-end',
    },
    theirMessage: {
        backgroundColor: '#12162A',
        alignSelf: 'flex-start',
    },
    senderName: {
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 5,
    },
    messageText: {
        color: '#FFFFFF',
    },
});

export default TeamChatScreen;
