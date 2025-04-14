import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useLearningProgress } from '@/contexts/LearningProgressContext';
import { router } from 'expo-router';
import { AlertTriangle, Mail, MessageSquare, AlertCircle } from 'lucide-react-native';

const PHISHING_SCENARIOS = [
  {
    id: 'email-urgent',
    title: 'Urgent Bank Notice',
    type: 'Email',
    content: {
      from: 'security@bank-secure-notice.com',
      subject: 'Urgent: Account Security Breach',
      body: 'Dear Customer,\n\nWe have detected suspicious activity on your account. Click here immediately to verify your identity and prevent account suspension: www.bank-secure-verification.com',
      time: '2:15 AM',
    },
    redFlags: [
      {
        element: 'Sender Email',
        description: 'Suspicious domain, not official bank domain',
        position: { x: 20, y: 40 },
      },
      {
        element: 'Urgency',
        description: 'Creates pressure to act quickly without thinking',
        position: { x: 20, y: 80 },
      },
      {
        element: 'Link',
        description: 'Suspicious URL, not official bank website',
        position: { x: 20, y: 160 },
      },
      {
        element: 'Time',
        description: 'Unusual hour for bank communication',
        position: { x: 20, y: 200 },
      },
    ],
  },
  {
    id: 'sms-prize',
    title: 'Prize Winner SMS',
    type: 'SMS',
    content: {
      from: '+1234567890',
      body: 'Congratulations! You\'ve won a $1000 gift card. Claim within 24hrs: bit.ly/claim-prize',
      time: 'Just now',
    },
    redFlags: [
      {
        element: 'Unknown Sender',
        description: 'Random phone number',
        position: { x: 20, y: 40 },
      },
      {
        element: 'Unexpected Prize',
        description: 'You haven\'t entered any contest',
        position: { x: 20, y: 80 },
      },
      {
        element: 'Short URL',
        description: 'Masked destination link',
        position: { x: 20, y: 120 },
      },
      {
        element: 'Time Pressure',
        description: '24-hour deadline to create urgency',
        position: { x: 20, y: 160 },
      },
    ],
  },
  {
    id: 'payment-request',
    title: 'Payment Request',
    type: 'Message',
    content: {
      from: 'payment@secure-transfer.net',
      body: 'You have received a payment request of $750. Accept payment here: secure-transfer.net/accept-payment',
      time: '5 minutes ago',
    },
    redFlags: [
      {
        element: 'Unsolicited',
        description: 'Unexpected payment request',
        position: { x: 20, y: 40 },
      },
      {
        element: 'Domain',
        description: 'Generic-looking domain name',
        position: { x: 20, y: 80 },
      },
      {
        element: 'Action Required',
        description: 'Requires immediate action',
        position: { x: 20, y: 120 },
      },
    ],
  },
];

export default function PhishingPreventionScreen() {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [foundFlags, setFoundFlags] = useState<string[]>([]);
  const [showAllFlags, setShowAllFlags] = useState(false);
  const { updateModuleProgress, markModuleComplete } = useLearningProgress();

  useEffect(() => {
    updateModuleProgress('phishing-prevention', `scenario-${currentScenario}`);
  }, [currentScenario]);

  const handleFlagPress = (element: string) => {
    if (!showAllFlags && !foundFlags.includes(element)) {
      const newFoundFlags = [...foundFlags, element];
      setFoundFlags(newFoundFlags);
      
      if (newFoundFlags.length === PHISHING_SCENARIOS[currentScenario].redFlags.length) {
        // All flags found in current scenario
        setTimeout(() => {
          if (currentScenario < PHISHING_SCENARIOS.length - 1) {
            setCurrentScenario(currentScenario + 1);
            setFoundFlags([]);
            setShowAllFlags(false);
          }
        }, 1500);
      }
    }
  };

  const getScenarioIcon = (type: string) => {
    switch (type) {
      case 'Email':
        return Mail;
      case 'SMS':
        return MessageSquare;
      default:
        return AlertCircle;
    }
  };

  const scenario = PHISHING_SCENARIOS[currentScenario];
  const ScenarioIcon = getScenarioIcon(scenario.type);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Phishing Prevention</Text>

        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Scenario {currentScenario + 1} of {PHISHING_SCENARIOS.length}
          </Text>
          <Text style={styles.foundText}>
            Found {foundFlags.length} of {scenario.redFlags.length} red flags
          </Text>
        </View>

        <View style={styles.scenarioCard}>
          <View style={styles.scenarioHeader}>
            <View style={styles.typeContainer}>
              <ScenarioIcon size={20} color="#1A1A1A" />
              <Text style={styles.typeText}>{scenario.type}</Text>
            </View>
            <Text style={styles.scenarioTitle}>{scenario.title}</Text>
          </View>

          <View style={styles.messageContainer}>
            <Text style={styles.messageField}>From: {scenario.content.from}</Text>
            {scenario.content.subject && (
              <Text style={styles.messageField}>Subject: {scenario.content.subject}</Text>
            )}
            <Text style={styles.messageBody}>{scenario.content.body}</Text>
            <Text style={styles.messageTime}>{scenario.content.time}</Text>
          </View>

          {scenario.redFlags.map((flag) => (
            <TouchableOpacity
              key={flag.element}
              style={[
                styles.flagIndicator,
                { top: flag.position.y, left: flag.position.x },
                (showAllFlags || foundFlags.includes(flag.element)) && styles.flagVisible,
              ]}
              onPress={() => handleFlagPress(flag.element)}
            >
              <AlertTriangle size={20} color="#FF3B30" />
              <View style={styles.flagTooltip}>
                <Text style={styles.flagTitle}>{flag.element}</Text>
                <Text style={styles.flagDescription}>{flag.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.hintButton}
          onPress={() => setShowAllFlags(!showAllFlags)}
        >
          <Text style={styles.hintButtonText}>
            {showAllFlags ? 'Hide Red Flags' : 'Show Red Flags'}
          </Text>
        </TouchableOpacity>

        {currentScenario === PHISHING_SCENARIOS.length - 1 &&
          foundFlags.length === scenario.redFlags.length && (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => {
              markModuleComplete('phishing-prevention');
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
  progressContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  progressText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  foundText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 4,
  },
  scenarioCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  scenarioHeader: {
    marginBottom: 16,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#1A1A1A',
    marginLeft: 8,
  },
  scenarioTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#1A1A1A',
  },
  messageContainer: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 12,
  },
  messageField: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  messageBody: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#1A1A1A',
    marginVertical: 12,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#8E8E93',
    textAlign: 'right',
  },
  flagIndicator: {
    position: 'absolute',
    opacity: 0,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 8,
  },
  flagVisible: {
    opacity: 1,
  },
  flagTooltip: {
    backgroundColor: '#FFEFEF',
    borderRadius: 8,
    padding: 8,
    marginLeft: 8,
    flex: 1,
  },
  flagTitle: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#FF3B30',
    marginBottom: 4,
  },
  flagDescription: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#FF3B30',
  },
  hintButton: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  hintButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#007AFF',
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
