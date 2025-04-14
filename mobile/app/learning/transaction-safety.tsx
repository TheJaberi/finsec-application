import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useRef } from 'react';
import { useLearningProgress } from '@/contexts/LearningProgressContext';
import { router } from 'expo-router';
import { AlertTriangle, Check, X, DollarSign, Clock, MapPin, AlertCircle } from 'lucide-react-native';

const SCENARIOS = [
  {
    id: 'unusual-amount',
    title: 'Unusual Amount',
    description: 'A transfer that is significantly larger than your typical transactions.',
    transaction: {
      amount: '$5,000',
      recipient: 'Unknown Trading Ltd.',
      location: 'Foreign Country',
      time: '3:45 AM',
      frequency: 'First time transaction',
    },
    redFlags: [
      'Large amount compared to usual transactions',
      'First-time recipient',
      'Unusual hour for transaction',
      'Foreign location',
    ],
    riskyTransaction: true,
  },
  {
    id: 'regular-payment',
    title: 'Regular Payment',
    description: 'Monthly utility bill payment to a known company.',
    transaction: {
      amount: '$85',
      recipient: 'City Power & Utilities',
      location: 'Local',
      time: '2:15 PM',
      frequency: 'Monthly recurring',
    },
    redFlags: [],
    riskyTransaction: false,
  },
  {
    id: 'suspicious-pattern',
    title: 'Suspicious Pattern',
    description: 'Multiple small transactions in quick succession.',
    transaction: {
      amount: '$49.99 (×5)',
      recipient: 'Digital Goods Store',
      location: 'Multiple locations',
      time: 'Last 5 minutes',
      frequency: 'Multiple attempts',
    },
    redFlags: [
      'Multiple transactions in short time',
      'Same amount repeated',
      'Different locations',
      'Unusual pattern',
    ],
    riskyTransaction: true,
  },
];

export default function TransactionSafetyScreen() {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const { updateModuleProgress, markModuleComplete } = useLearningProgress();

  useEffect(() => {
    updateModuleProgress('transaction-safety', 'scenario-' + currentScenario);
  }, [currentScenario]);

  const handleAnswer = (isRisky: boolean) => {
    const correct = isRisky === SCENARIOS[currentScenario].riskyTransaction;
    if (correct) setScore(score + 1);
    setShowResult(true);

    setTimeout(() => {
      if (currentScenario < SCENARIOS.length - 1) {
        Animated.timing(slideAnim, {
          toValue: -400,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setCurrentScenario(currentScenario + 1);
          setShowResult(false);
          slideAnim.setValue(400);
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        });
      }
    }, 2000);
  };

  const renderTransaction = () => {
    const scenario = SCENARIOS[currentScenario];
    const transaction = scenario.transaction;

    return (
      <Animated.View
        style={[
          styles.transactionCard,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        <Text style={styles.scenarioTitle}>{scenario.title}</Text>
        <Text style={styles.scenarioDescription}>{scenario.description}</Text>
        
        <View style={styles.transactionDetails}>
          <View style={styles.detailRow}>
            <DollarSign size={20} color="#8E8E93" />
            <Text style={styles.detailText}>Amount: {transaction.amount}</Text>
          </View>
          <View style={styles.detailRow}>
            <MapPin size={20} color="#8E8E93" />
            <Text style={styles.detailText}>Location: {transaction.location}</Text>
          </View>
          <View style={styles.detailRow}>
            <Clock size={20} color="#8E8E93" />
            <Text style={styles.detailText}>Time: {transaction.time}</Text>
          </View>
        </View>

        {showResult && (
          <View style={styles.resultContainer}>
            {scenario.riskyTransaction ? (
              <View style={styles.warningContainer}>
                <AlertTriangle size={24} color="#FF3B30" />
                <Text style={styles.warningTitle}>Red Flags:</Text>
                {scenario.redFlags.map((flag, index) => (
                  <Text key={index} style={styles.redFlag}>• {flag}</Text>
                ))}
              </View>
            ) : (
              <View style={styles.safeContainer}>
                <Check size={24} color="#32C759" />
                <Text style={styles.safeText}>This is a safe transaction</Text>
              </View>
            )}
          </View>
        )}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Transaction Safety</Text>
        
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>Score: {score}/{SCENARIOS.length}</Text>
        </View>

        {renderTransaction()}

        {!showResult && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.safeButton]}
              onPress={() => handleAnswer(false)}
            >
              <Check size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Safe</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.riskyButton]}
              onPress={() => handleAnswer(true)}
            >
              <AlertTriangle size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Risky</Text>
            </TouchableOpacity>
          </View>
        )}

        {currentScenario === SCENARIOS.length - 1 && showResult && (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => {
              markModuleComplete('transaction-safety');
              router.back();
            }}
          >
            <Text style={styles.completeButtonText}>Mark as Complete</Text>
          </TouchableOpacity>
        )}
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
  scoreContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#007AFF',
  },
  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  scenarioTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  scenarioDescription: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'Inter_400Regular',
    marginBottom: 16,
  },
  transactionDetails: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#1A1A1A',
    fontFamily: 'Inter_400Regular',
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  safeButton: {
    backgroundColor: '#32C759',
  },
  riskyButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    marginLeft: 8,
  },
  resultContainer: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
  },
  warningContainer: {
    backgroundColor: '#FFEFEF',
    padding: 12,
    borderRadius: 8,
  },
  warningTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#FF3B30',
    marginVertical: 8,
  },
  redFlag: {
    fontSize: 14,
    color: '#FF3B30',
    fontFamily: 'Inter_400Regular',
    marginBottom: 4,
  },
  safeContainer: {
    backgroundColor: '#E8F8EF',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  safeText: {
    fontSize: 16,
    color: '#32C759',
    fontFamily: 'Inter_500Medium',
    marginLeft: 8,
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
