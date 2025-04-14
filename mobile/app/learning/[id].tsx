import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import PasswordSecurityScreen from '../learning/password-security';
import SecureAuthScreen from '../learning/secure-auth';
import TransactionSafetyScreen from '../learning/transaction-safety';
import DeviceSecurityScreen from '../learning/device-security';
import PhishingPreventionScreen from '../learning/phishing-prevention';

export default function LearningModuleScreen() {
  const { id } = useLocalSearchParams();

  // Map module IDs to their respective screens
  const moduleScreens: { [key: string]: JSX.Element } = {
    'password-security': <PasswordSecurityScreen />,
    'secure-auth': <SecureAuthScreen />,
    'transaction-safety': <TransactionSafetyScreen />,
    'device-security': <DeviceSecurityScreen />,
    'phishing-prevention': <PhishingPreventionScreen />
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#1A1A1A" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>
      {moduleScreens[id as string] || (
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Module not found</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    color: '#1A1A1A',
    marginLeft: 4,
    fontFamily: 'Inter_500Medium',
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 16,
    color: '#8E8E93',
    fontFamily: 'Inter_500Medium',
  },
});
