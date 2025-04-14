import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useRef } from 'react';
import { useLearningProgress } from '@/contexts/LearningProgressContext';
import { router } from 'expo-router';
import { Smartphone, Key, MessageSquare, Fingerprint, ShieldCheck } from 'lucide-react-native';

const MFA_TYPES = [
  {
    id: 'authenticator',
    title: 'Authenticator App',
    icon: Smartphone,
    color: '#007AFF',
    description: 'Most secure method. Uses time-based codes that change every 30 seconds.',
    strengthLevel: 5,
  },
  {
    id: 'biometric',
    title: 'Biometric',
    icon: Fingerprint,
    color: '#32C759',
    description: 'Very secure and convenient. Uses your unique biological features.',
    strengthLevel: 4,
  },
  {
    id: 'security-key',
    title: 'Security Key',
    icon: Key,
    color: '#AF52DE',
    description: 'Physical key that must be present for authentication.',
    strengthLevel: 4,
  },
  {
    id: 'sms',
    title: 'SMS Code',
    icon: MessageSquare,
    color: '#FF9500',
    description: 'Less secure due to potential SMS interception.',
    strengthLevel: 2,
  },
];

export default function SecureAuthScreen() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showDemo, setShowDemo] = useState(false);
  const { updateModuleProgress, markModuleComplete } = useLearningProgress();
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    updateModuleProgress('secure-auth', 'exploring-mfa');
  }, []);

  // Simulate an authenticator code generator animation
  useEffect(() => {
    if (showDemo && selectedType === 'authenticator') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 30000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      rotateAnim.setValue(0);
    }
  }, [showDemo, selectedType]);

  const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const [code, setCode] = useState(generateCode());

  useEffect(() => {
    if (showDemo && selectedType === 'authenticator') {
      const interval = setInterval(() => {
        setCode(generateCode());
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [showDemo, selectedType]);

  const renderDemo = () => {
    if (!showDemo || !selectedType) return null;

    switch (selectedType) {
      case 'authenticator':
        return (
          <View style={styles.demoContainer}>
            <View style={styles.authenticatorDemo}>
              <Animated.View
                style={[
                  styles.progressCircle,
                  {
                    transform: [{
                      rotate: rotateAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      }),
                    }],
                  },
                ]}
              />
              <Text style={styles.codeText}>{code}</Text>
              <Text style={styles.timeText}>Code changes in 30 seconds</Text>
            </View>
          </View>
        );
      case 'biometric':
        return (
          <View style={styles.demoContainer}>
            <View style={styles.biometricDemo}>
              <Fingerprint size={80} color="#32C759" />
              <Text style={styles.demoText}>Touch sensor to authenticate</Text>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Secure Authentication</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Multi-Factor Authentication</Text>
          <Text style={styles.description}>
            Learn about different types of MFA and their security levels. Tap each method to see how it works.
          </Text>

          {MFA_TYPES.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.mfaCard,
                selectedType === type.id && styles.selectedCard,
              ]}
              onPress={() => {
                setSelectedType(type.id);
                setShowDemo(true);
              }}
            >
              <View style={[styles.iconContainer, { backgroundColor: type.color }]}>
                <type.icon size={24} color="#FFFFFF" />
              </View>
              <View style={styles.mfaInfo}>
                <Text style={styles.mfaTitle}>{type.title}</Text>
                <Text style={styles.mfaDescription}>{type.description}</Text>
                <View style={styles.strengthContainer}>
                  {[...Array(5)].map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.strengthDot,
                        i < type.strengthLevel ? { backgroundColor: type.color } : {}
                      ]}
                    />
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {renderDemo()}

        <TouchableOpacity
          style={styles.completeButton}
          onPress={() => {
            markModuleComplete('secure-auth');
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
  mfaCard: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  selectedCard: {
    backgroundColor: '#E5E5EA',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mfaInfo: {
    flex: 1,
    marginLeft: 16,
  },
  mfaTitle: {
    fontSize: 16,
    color: '#1A1A1A',
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 4,
  },
  mfaDescription: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'Inter_400Regular',
    marginBottom: 8,
  },
  strengthContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  strengthDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E5EA',
  },
  demoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  authenticatorDemo: {
    alignItems: 'center',
    padding: 20,
  },
  progressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#007AFF',
    position: 'absolute',
  },
  codeText: {
    fontSize: 32,
    fontFamily: 'Inter_600SemiBold',
    color: '#1A1A1A',
    letterSpacing: 4,
    marginVertical: 20,
  },
  timeText: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'Inter_400Regular',
  },
  biometricDemo: {
    alignItems: 'center',
    padding: 20,
  },
  demoText: {
    fontSize: 16,
    color: '#8E8E93',
    fontFamily: 'Inter_500Medium',
    marginTop: 16,
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
