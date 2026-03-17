import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert, StatusBar, Switch
} from 'react-native';
import { colors, spacing, borderRadius } from '../theme';

export default function SettingsScreen() {
  const [walletKey, setWalletKey] = useState('');
  const [serverUrl, setServerUrl] = useState('http://localhost:4021');
  const [autoPayEnabled, setAutoPayEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (walletKey && !walletKey.startsWith('0x')) {
      Alert.alert('Invalid Key', 'Private key must start with 0x');
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    Alert.alert('✅ Saved', 'Settings saved. Your wallet will be used for x402 payments.');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Configure your x402 payment wallet</Text>
        </View>

        {/* Wallet Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💳 Wallet Configuration</Text>
          <View style={styles.card}>
            <Text style={styles.label}>EVM Private Key</Text>
            <Text style={styles.hint}>Used for signing x402 USDC payments on Base</Text>
            <TextInput
              style={styles.input}
              value={walletKey}
              onChangeText={setWalletKey}
              placeholder="0xYOUR_TESTNET_PRIVATE_KEY"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={styles.infoRow}>
              <Text style={styles.infoEmoji}>ℹ️</Text>
              <Text style={styles.infoText}>Only use a testnet wallet with small amounts. Never use your main wallet.</Text>
            </View>
          </View>
        </View>

        {/* Server Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌐 Server Configuration</Text>
          <View style={styles.card}>
            <Text style={styles.label}>API Server URL</Text>
            <Text style={styles.hint}>The x402-protected Runna training server</Text>
            <TextInput
              style={styles.input}
              value={serverUrl}
              onChangeText={setServerUrl}
              placeholder="http://localhost:4021"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* Payment Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Payment Settings</Text>
          <View style={styles.card}>
            <View style={styles.toggleRow}>
              <View>
                <Text style={styles.toggleLabel}>Auto-pay with x402</Text>
                <Text style={styles.toggleHint}>Automatically pay for premium content</Text>
              </View>
              <Switch
                value={autoPayEnabled}
                onValueChange={setAutoPayEnabled}
                trackColor={{ false: colors.surfaceLight, true: colors.primary + '80' }}
                thumbColor={autoPayEnabled ? colors.primary : colors.textMuted}
              />
            </View>
            <View style={styles.toggleRow}>
              <View>
                <Text style={styles.toggleLabel}>Network</Text>
                <Text style={styles.toggleHint}>Base Sepolia (testnet)</Text>
              </View>
              <View style={styles.networkBadge}>
                <Text style={styles.networkText}>Base Sepolia</Text>
              </View>
            </View>
          </View>
        </View>

        {/* x402 Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📖 About x402</Text>
          <View style={styles.card}>
            <Text style={styles.aboutText}>
              x402 is an open payment protocol for the internet. When you access a premium training plan, the app automatically:
              {'\n\n'}1. Receives a 402 Payment Required response
              {'\n'}2. Signs a USDC micropayment with your wallet
              {'\n'}3. Sends an X-PAYMENT header to the server
              {'\n'}4. Receives the unlocked content instantly
              {'\n\n'}No subscriptions. No credit cards. Pay only for what you use.
            </Text>
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>💰 Cost per plan</Text>
              <Text style={styles.costValue}>$0.001 USDC</Text>
            </View>
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>⛓️ Network</Text>
              <Text style={styles.costValue}>Base Sepolia</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={[styles.saveBtn, saved && styles.saveBtnSaved]} onPress={handleSave}>
          <Text style={styles.saveBtnText}>{saved ? '✅ Saved!' : 'Save Settings'}</Text>
        </TouchableOpacity>

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.md },
  header: { marginBottom: spacing.lg, paddingTop: spacing.md },
  title: { fontSize: 28, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  section: { marginBottom: spacing.md },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  label: { fontSize: 14, fontWeight: '600', color: colors.text },
  hint: { fontSize: 12, color: colors.textMuted, marginTop: -spacing.xs },
  input: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    color: colors.text,
    fontSize: 14,
    fontFamily: 'monospace',
  },
  infoRow: { flexDirection: 'row', gap: spacing.xs, alignItems: 'flex-start', marginTop: spacing.xs },
  infoEmoji: { fontSize: 14 },
  infoText: { fontSize: 12, color: colors.textMuted, flex: 1, lineHeight: 17 },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  toggleLabel: { fontSize: 14, fontWeight: '600', color: colors.text },
  toggleHint: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  networkBadge: {
    backgroundColor: colors.primary + '20',
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  networkText: { fontSize: 11, fontWeight: '600', color: colors.primary },
  aboutText: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceLight,
    marginTop: spacing.xs,
  },
  costLabel: { fontSize: 13, color: colors.textSecondary },
  costValue: { fontSize: 13, fontWeight: '600', color: colors.primary },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.round,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  saveBtnSaved: { backgroundColor: colors.success },
  saveBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
