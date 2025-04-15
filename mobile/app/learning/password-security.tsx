import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useLearningProgress } from '@/contexts/LearningProgressContext';
import { router } from 'expo-router';
import { useBadges } from '@/contexts/BadgesContext';

// Password strength estimation in seconds
const estimateCrackTime = (password: string) => {
  let score = 0;
  const length = password.length;

  // Basic character type checks
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // Calculate character set size
  let charSetSize = 0;
  if (hasLower) charSetSize += 26;
  if (hasUpper) charSetSize += 26;
  if (hasNumber) charSetSize += 10;
  if (hasSpecial) charSetSize += 32;

  // Basic formula: possibilities = charSetSize^length
  const possibilities = Math.pow(charSetSize, length);

  // Assuming 10 billion guesses per second (modern computer)
  const secondsToCrack = possibilities / (10 * Math.pow(10, 9));

  return {
    regular: formatTime(secondsToCrack),
    supercomputer: formatTime(secondsToCrack / 1000), // 1000x faster
    quantum: formatTime(secondsToCrack / 1000000) // 1M times faster
  };
};

const formatTime = (seconds: number) => {
  if (seconds < 1) return 'instantly';
  if (seconds < 60) return Math.round(seconds) + ' seconds';
  if (seconds < 3600) return Math.round(seconds / 60) + ' minutes';
  if (seconds < 86400) return Math.round(seconds / 3600) + ' hours';
  if (seconds < 31536000) return Math.round(seconds / 86400) + ' days';
  if (seconds < 315360000) return Math.round(seconds / 31536000) + ' years';
  return 'millions of years';
};

const calculateStrength = (password: string) => {
  let score = 0;

  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 20;
  if (/[a-z]/.test(password)) score += 10;
  if (/[A-Z]/.test(password)) score += 10;
  if (/\d/.test(password)) score += 10;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 20;
  if (password.length >= 16) score += 10;

  return Math.min(score, 100);
};

const getStrengthLabel = (strength: number) => {
  if (strength >= 80) return { label: 'Very Strong', color: '#32C759' };
  if (strength >= 60) return { label: 'Strong', color: '#66C75A' };
  if (strength >= 40) return { label: 'Medium', color: '#FFB340' };
  if (strength >= 20) return { label: 'Weak', color: '#FF9500' };
  return { label: 'Very Weak', color: '#FF3B30' };
};

export default function PasswordSecurityScreen() {
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(0);
  const { updateModuleProgress, markModuleComplete } = useLearningProgress();
  const { awardBadge } = useBadges();
  const crackTimes = estimateCrackTime(password);
  const strengthInfo = getStrengthLabel(strength);

  useEffect(() => {
    setStrength(calculateStrength(password));
    updateModuleProgress('password-security', 'strength-checker');
  }, [password]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Password Security</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Password Strength Checker</Text>
          <Text style={styles.description}>
            Enter a password to see how strong it is and how long it would take to crack
          </Text>

          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter a password"
            secureTextEntry
          />

          {/* Strength Bar */}
          <View style={styles.strengthBarContainer}>
            <View style={[styles.strengthBar, { width: `${strength}%`, backgroundColor: strengthInfo.color }]} />
          </View>
          <Text style={[styles.strengthLabel, { color: strengthInfo.color }]}>
            {strengthInfo.label}
          </Text>

          {/* Crack Time Estimates */}
          {password.length > 0 && (
            <View style={styles.crackTimeContainer}>
              <Text style={styles.crackTimeTitle}>Time to crack:</Text>

              <View style={styles.crackTimeRow}>
                <Text style={styles.crackTimeLabel}>Regular Computer:</Text>
                <Text style={styles.crackTimeValue}>{crackTimes.regular}</Text>
              </View>

              <View style={styles.crackTimeRow}>
                <Text style={styles.crackTimeLabel}>Supercomputer:</Text>
                <Text style={styles.crackTimeValue}>{crackTimes.supercomputer}</Text>
              </View>

              <View style={styles.crackTimeRow}>
                <Text style={styles.crackTimeLabel}>Quantum Computer:</Text>
                <Text style={styles.crackTimeValue}>{crackTimes.quantum}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Password Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tips for Strong Passwords</Text>
          <View style={styles.tipContainer}>
            <Text style={styles.tipText}>• Use at least 12 characters</Text>
            <Text style={styles.tipText}>• Mix uppercase and lowercase letters</Text>
            <Text style={styles.tipText}>• Include numbers and special characters</Text>
            <Text style={styles.tipText}>• Avoid personal information</Text>
            <Text style={styles.tipText}>• Use unique passwords for each account</Text>
          </View>
        </View>
        {/* Complete Button */}
        <TouchableOpacity
          style={styles.completeButton}
          onPress={() => {
            markModuleComplete('password-security');
            awardBadge('passwordMaster');
            router.back();
          }}
        >
          <Text style={styles.completeButtonText}>Mark as Complete</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_600SemiBold',
    color: '#1A1A1A',
    marginBottom: 24,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 16,
    fontFamily: 'Inter_400Regular',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 16,
    fontFamily: 'Inter_400Regular',
  },
  strengthBarContainer: {
    height: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  strengthBar: {
    height: '100%',
    borderRadius: 4,
  },
  strengthLabel: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 16,
    textAlign: 'center',
  },
  crackTimeContainer: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 12,
  },
  crackTimeTitle: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  crackTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  crackTimeLabel: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'Inter_400Regular',
    },
  crackTimeValue: {
    fontSize: 14,
    color: '#1A1A1A',
    fontFamily: 'Inter_500Medium',
  },
  tipContainer: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#1A1A1A',
    marginBottom: 8,
    fontFamily: 'Inter_400Regular',
  },
  completeButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    margin: 20,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});
