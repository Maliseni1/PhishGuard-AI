import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform, 
  SafeAreaView, 
  ActivityIndicator 
} from 'react-native';

// Import the Home Screen we created earlier
import HomeScreen from './HomeScreen'; 

const Stack = createNativeStackNavigator();

// ---------------------------------------------------------
// CONFIGURATION: REPLACE THIS WITH YOUR COMPUTER'S LOCAL IP
// ---------------------------------------------------------
// If on Android Emulator, use 'http://10.0.2.2:8000'
// If on Physical Device, use your LAN IP like 'http://192.168.1.5:8000'
const API_URL = 'http://41.63.27.40:8000'; 

// --- CHAT SCREEN COMPONENT ---
function ChatScreen({ route }) {
  const { scenario } = route.params; 
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef();

  // 1. Auto-Start: Fetch opening message from "Scammer"
  useEffect(() => {
    const startSimulation = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/start/${scenario}`);
        if (!response.ok) throw new Error("Backend connection failed");
        
        const data = await response.json();
        const initialBotMessage = { 
          id: Date.now(), 
          text: data.reply, 
          sender: 'bot' 
        };
        setMessages([initialBotMessage]);
      } catch (error) {
        console.error("Start Error:", error);
        setMessages([{ 
          id: Date.now(), 
          text: "⚠️ Error: Could not connect to PhishGuard Server.\nCheck your IP address in App.js!", 
          sender: 'system' 
        }]);
      } finally {
        setLoading(false);
      }
    };

    startSimulation();
  }, [scenario]);

  // 2. Send Message Logic
  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMsg = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/chat`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text, scenario: scenario })
      });

      const data = await response.json();
      const botMsg = { id: Date.now() + 1, text: data.reply, sender: 'bot' };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: "Error: Message failed to send. Is the backend running?", 
        sender: 'system' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={[
      styles.messageBubble, 
      item.sender === 'user' ? styles.userBubble : 
      (item.sender === 'system' ? styles.systemBubble : styles.botBubble)
    ]}>
      <Text style={item.sender === 'system' ? styles.systemText : styles.messageText}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.chatContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={loading ? <Text style={styles.typingText}>Attacker is typing...</Text> : null}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your response..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.sendButtonText}>Send</Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- MAIN APP NAVIGATION ---
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#2c3e50' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Chat" 
          component={ChatScreen} 
          options={({ route }) => ({ 
            title: route.params.scenario === 'bank' ? '⚠️ Fraud Alert' : '📋 HR Update' 
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  chatContainer: { padding: 15, paddingBottom: 20 },
  messageBubble: { padding: 12, borderRadius: 15, marginVertical: 4, maxWidth: '80%' },
  userBubble: { backgroundColor: '#3498db', alignSelf: 'flex-end', borderBottomRightRadius: 2 },
  botBubble: { backgroundColor: '#ffffff', alignSelf: 'flex-start', borderBottomLeftRadius: 2 },
  systemBubble: { backgroundColor: '#ffcccc', alignSelf: 'center', borderWidth: 1, borderColor: '#e74c3c' },
  messageText: { color: '#2c3e50', fontSize: 16 },
  systemText: { color: '#c0392b', fontWeight: 'bold', textAlign: 'center' },
  typingText: { marginLeft: 10, color: '#7f8c8d', fontStyle: 'italic', marginBottom: 10 },
  inputContainer: { 
    flexDirection: 'row', 
    padding: 10, 
    backgroundColor: 'white', 
    borderTopWidth: 1, 
    borderTopColor: '#e0e0e0',
    alignItems: 'center'
  },
  input: { 
    flex: 1, 
    backgroundColor: '#f8f9fa',
    borderColor: '#e0e0e0', 
    borderWidth: 1, 
    borderRadius: 25, 
    paddingHorizontal: 20, 
    height: 45,
    color: '#000'
  },
  sendButton: { 
    marginLeft: 10, 
    backgroundColor: '#2c3e50', 
    borderRadius: 25, 
    width: 45,
    height: 45, 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 2
  },
  sendButtonText: { color: 'white', fontWeight: 'bold', fontSize: 12 }
});