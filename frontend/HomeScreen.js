// frontend/HomeScreen.js
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

export default function HomeScreen({ navigation }) {
  
  const startScenario = (scenarioType) => {
    navigation.navigate('Chat', { scenario: scenarioType });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>PhishGuard AI</Text>
          <Text style={styles.subtitle}>Select a Training Simulation</Text>
        </View>

        <ScrollView contentContainerStyle={styles.cardContainer}>
          {/* Bank Scenario Card */}
          <TouchableOpacity style={styles.card} onPress={() => startScenario('bank')}>
            <View style={[styles.iconBox, { backgroundColor: '#e74c3c' }]}>
              <Text style={styles.iconText}>🏦</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Bank Fraud Alert</Text>
              <Text style={styles.cardDesc}>Defend against urgent requests for PINs and passwords.</Text>
            </View>
          </TouchableOpacity>

          {/* HR Scenario Card */}
          <TouchableOpacity style={styles.card} onPress={() => startScenario('hr')}>
            <View style={[styles.iconBox, { backgroundColor: '#3498db' }]}>
              <Text style={styles.iconText}>👥</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>HR Policy Update</Text>
              <Text style={styles.cardDesc}>Identify phishing links disguised as mandatory employee forms.</Text>
            </View>
          </TouchableOpacity>

          {/* Support Scenario Card (Locked) */}
          <TouchableOpacity style={[styles.card, { opacity: 0.6 }]} disabled={true}>
            <View style={[styles.iconBox, { backgroundColor: '#f1c40f' }]}>
              <Text style={styles.iconText}>🛠️</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>IT Support (Locked)</Text>
              <Text style={styles.cardDesc}>Remote access scams. (Coming Soon)</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>

        {/* --- NEW FOOTER SECTION --- */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Powered by Chiza Labs @2025</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  contentContainer: { flex: 1, justifyContent: 'space-between' }, // Pushes footer to bottom
  header: { padding: 30, paddingTop: 50, backgroundColor: '#2c3e50', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#bdc3c7' },
  cardContainer: { padding: 20 },
  card: { 
    backgroundColor: 'white', 
    borderRadius: 15, 
    padding: 20, 
    marginBottom: 15, 
    flexDirection: 'row', 
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconBox: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  iconText: { fontSize: 24 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  cardDesc: { fontSize: 14, color: '#666', lineHeight: 20 },
  
  // Footer Styles
  footer: { padding: 20, alignItems: 'center', marginBottom: 10 },
  footerText: { color: '#95a5a6', fontSize: 12, fontWeight: '600', letterSpacing: 0.5 }
});