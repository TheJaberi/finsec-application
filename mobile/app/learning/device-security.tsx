import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useLearningProgress } from '@/contexts/LearningProgressContext';
import { router } from 'expo-router';
import { useBadges } from '@/contexts/BadgesContext';
import {
  Lock,
  Smartphone,
  Wifi,
  Shield,
  RefreshCw,
  Check,
  AlertTriangle,
  Camera,
  Mic,
  MapPin,
  ChevronLeft,
} from 'lucide-react-native';

const SECURITY_CHECKS = [
  {
    id: 'lock-screen',
    title: 'Lock Screen Security',
    icon: Lock,
    color: '#007AFF',
    items: [
      {
        title: 'Use Biometric Lock',
        description: 'Enable fingerprint or face recognition for maximum security.',
        critical: true,
      },
      {
        title: 'Strong Passcode',
        description: 'Use at least 6 digits, avoid simple patterns.',
        critical: true,
      },
      {
        title: 'Quick Lock',
        description: 'Set screen to lock immediately after sleep.',
        critical: false,
      },
    ],
  },
  {
    id: 'app-permissions',
    title: 'App Permissions',
    icon: Shield,
    color: '#32C759',
    items: [
      {
        title: 'Camera Access',
        description: 'Only allow camera access to necessary apps.',
        icon: Camera,
        critical: true,
      },
      {
        title: 'Location Services',
        description: 'Review which apps can access your location.',
        icon: MapPin,
        critical: true,
      },
      {
        title: 'Microphone Access',
        description: 'Limit microphone access to trusted apps.',
        icon: Mic,
        critical: false,
      },
    ],
  },
  {
    id: 'system-updates',
    title: 'System Updates',
    icon: RefreshCw,
    color: '#FF9500',
    items: [
      {
        title: 'Auto Updates',
        description: 'Enable automatic system updates.',
        critical: true,
      },
      {
        title: 'App Updates',
        description: 'Regularly update all installed apps.',
        critical: true,
      },
      {
        title: 'Security Patches',
        description: 'Install security updates promptly.',
        critical: true,
      },
    ],
  },
  {
    id: 'network-security',
    title: 'Network Security',
    icon: Wifi,
    color: '#AF52DE',
    items: [
      {
        title: 'Avoid Public WiFi',
        description: 'Use mobile data or VPN on public networks.',
        critical: true,
      },
      {
        title: 'WiFi Security',
        description: 'Use WPA3 encryption on home network.',
        critical: true,
      },
      {
        title: 'Bluetooth Settings',
        description: 'Turn off Bluetooth when not in use.',
        critical: false,
      },
    ],
  },
];

export default function DeviceSecurityScreen() {
  const [completedChecks, setCompletedChecks] = useState<string[]>([]);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const { updateModuleProgress, markModuleComplete } = useLearningProgress();
  const { awardBadge } = useBadges();

  useEffect(() => {
    updateModuleProgress('device-security', `completed-${completedChecks.length}`);
  }, [completedChecks]);

  const handleCheckItem = (sectionId: string, itemTitle: string) => {
    const checkId = `${sectionId}-${itemTitle}`;
    if (completedChecks.includes(checkId)) {
      setCompletedChecks(completedChecks.filter(id => id !== checkId));
    } else {
      setCompletedChecks([...completedChecks, checkId]);
    }
  };

  const isItemChecked = (sectionId: string, itemTitle: string) => {
    return completedChecks.includes(`${sectionId}-${itemTitle}`);
  };

  const getProgress = () => {
    const totalItems = SECURITY_CHECKS.reduce(
      (sum, section) => sum + section.items.length,
      0
    );
    return (completedChecks.length / totalItems) * 100;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#1A1A1A" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Device Security</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${getProgress()}%` }]}
            />
          </View>
          <Text style={styles.progressText}>
            {completedChecks.length} items completed
          </Text>
        </View>

        {SECURITY_CHECKS.map((section) => (
          <View key={section.id} style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => setExpandedSection(
                expandedSection === section.id ? null : section.id
              )}
            >
              <View style={[styles.iconContainer, { backgroundColor: section.color }]}>
                <section.icon size={24} color="#FFFFFF" />
              </View>
              <View style={styles.sectionTitle}>
                <Text style={styles.sectionTitleText}>{section.title}</Text>
                <Text style={styles.sectionCount}>
                  {section.items.filter(item =>
                    isItemChecked(section.id, item.title)
                  ).length} / {section.items.length}
                </Text>
              </View>
            </TouchableOpacity>

            {expandedSection === section.id && (
              <View style={styles.sectionContent}>
                {section.items.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.checkItem,
                      isItemChecked(section.id, item.title) && styles.checkedItem,
                    ]}
                    onPress={() => handleCheckItem(section.id, item.title)}
                  >
                    <View style={styles.checkItemContent}>
                      {item.critical && (
                        <AlertTriangle size={16} color="#FF3B30" style={styles.criticalIcon} />
                      )}
                      <View style={styles.checkItemText}>
                        <Text style={styles.checkItemTitle}>{item.title}</Text>
                        <Text style={styles.checkItemDescription}>
                          {item.description}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.checkbox}>
                      {isItemChecked(section.id, item.title) && (
                        <Check size={16} color="#32C759" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}

        {getProgress() === 100 && (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => {
              markModuleComplete('device-security');
              awardBadge('deviceGuardian');
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
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
    color: '#1A1A1A',
    marginLeft: 4,
    fontFamily: 'Inter_500Medium',
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
  progressBar: {
    height: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'Inter_400Regular',
    marginTop: 8,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    flex: 1,
    marginLeft: 16,
  },
  sectionTitleText: {
    fontSize: 16,
    color: '#1A1A1A',
    fontFamily: 'Inter_600SemiBold',
  },
  sectionCount: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'Inter_400Regular',
    marginTop: 4,
  },
  sectionContent: {
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  checkItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkedItem: {
    backgroundColor: '#F8F8F8',
  },
  checkItemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  criticalIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  checkItemText: {
    flex: 1,
  },
  checkItemTitle: {
    fontSize: 14,
    color: '#1A1A1A',
    fontFamily: 'Inter_500Medium',
    marginBottom: 4,
  },
  checkItemDescription: {
    fontSize: 13,
    color: '#8E8E93',
    fontFamily: 'Inter_400Regular',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    marginLeft: 16,
    justifyContent: 'center',
    alignItems: 'center',
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
