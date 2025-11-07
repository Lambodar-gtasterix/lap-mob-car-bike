import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import SellFlowLayout from '../Sell/common/SellFlowLayout';
import PrimaryButton from '../../components/common/PrimaryButton';
import FormField from '../../components/form/FormField';
import { StepConfig } from '../../components/common/ProgressStepper';
import { colors, radii, shadows, spacing } from '../../theme/tokens';

const SELL_FLOW_STEPS: StepConfig[] = [
  { label: 'Details', status: 'completed' },
  { label: 'Photos', status: 'completed' },
  { label: 'Pricing', status: 'current' },
];

const PRICE_HINTS = [
  'Set a competitive price to attract more buyers.',
  'Highlight accessories or warranty to justify your price.',
];

const MobilePricingScreen: React.FC = () => {
  const [price, setPrice] = useState('');

  const handlePriceChange = (value: string) => {
    const sanitized = value.replace(/[^0-9]/g, '');
    setPrice(sanitized);
  };

  const handleSavePrice = () => {
    if (!price) {
      Alert.alert('Add Price', 'Please enter a price to continue.');
      return;
    }

    Alert.alert('Price Saved', `You set your mobile price to \u20B9${price}.`);
  };

  return (
    <SellFlowLayout
      title="Set Mobile Price"
      steps={SELL_FLOW_STEPS}
      footer={
        <PrimaryButton
          label="Save Price"
          onPress={handleSavePrice}
          disabled={!price}
          icon={<Icon name="content-save-outline" size={20} color={colors.white} />}
        />
      }
    >
      <FormField label="Listing Price" required>
        <View style={styles.priceInputContainer}>
          <View style={styles.currencyChip}>
            <Icon name="currency-inr" size={20} color={colors.white} />
          </View>
          <TextInput
            value={price}
            onChangeText={handlePriceChange}
            placeholder="Enter amount"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
            maxLength={7}
            style={styles.priceInput}
          />
        </View>
      </FormField>

      <View style={styles.previewCard}>
        <Text style={styles.previewLabel}>Price preview</Text>
        <Text style={styles.previewValue}>
          {price ? `\u20B9${price}` : '\u20B9 0'}
        </Text>
        <Text style={styles.previewCaption}>
          Buyers will see this amount on your mobile listing.
        </Text>
      </View>

      <View style={styles.tipsCard}>
        <View style={styles.tipHeader}>
          <Icon name="lightbulb-on-outline" size={20} color={colors.stepActive} />
          <Text style={styles.tipTitle}>Pricing tips</Text>
        </View>
        {PRICE_HINTS.map((hint) => (
          <View key={hint} style={styles.tipRow}>
            <View style={styles.bullet} />
            <Text style={styles.tipText}>{hint}</Text>
          </View>
        ))}
      </View>
    </SellFlowLayout>
  );
};

const styles = StyleSheet.create({
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    minHeight: 56,
  },
  currencyChip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  priceInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  previewCard: {
    marginTop: spacing.xxl,
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  previewLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    letterSpacing: 1,
  },
  previewValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
  },
  previewCaption: {
    marginTop: spacing.md,
    fontSize: 14,
    color: colors.textSecondary,
  },
  tipsCard: {
    marginTop: spacing.xxl,
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.stepActive,
    marginTop: spacing.xs,
    marginRight: spacing.md,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});

export default MobilePricingScreen;
