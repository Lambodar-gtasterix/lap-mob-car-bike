import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import SellFlowLayout from '../Sell/common/SellFlowLayout';
import PrimaryButton from '../../components/common/PrimaryButton';
import FormField from '../../components/form/FormField';
import { colors, radii, shadows, spacing } from '../../theme/tokens';
import { SellCarStackParamList } from '../../navigation/SellCarStack';

type CarLocationNavProp = NativeStackNavigationProp<SellCarStackParamList, 'CarLocationScreen'>;
type CarLocationRouteProp = RouteProp<SellCarStackParamList, 'CarLocationScreen'>;

const CarLocationScreen: React.FC = () => {
  const navigation = useNavigation<CarLocationNavProp>();
  const route = useRoute<CarLocationRouteProp>();
  const { carId, images, selectedLocation } = route.params;

  const [location, setLocation] = useState(selectedLocation || 'Hinjewadi, Pune');

  // Update location when selectedLocation changes
  useEffect(() => {
    if (selectedLocation) {
      setLocation(selectedLocation);
    }
  }, [selectedLocation]);

  const handleLocationPress = () => {
    // Navigate to ChooseLocationScreen
    navigation.navigate('ChooseLocationScreen', {
      returnScreen: 'CarLocationScreen',
      carId,
      images
    });
  };

  const handleNext = () => {
    if (!location.trim()) {
      Alert.alert('Add Location', 'Please enter a location to continue.');
      return;
    }
    // Navigate to next screen (ConfirmDetails or another screen)
    navigation.navigate('ConfirmDetails', { carId, images });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SellFlowLayout
      title="Set Car Location"
      onBack={handleBack}
      footer={
        <PrimaryButton
          label="Next"
          onPress={handleNext}
          disabled={!location.trim()}
        />
      }
    >
      <FormField label="Location" required>
        <TouchableOpacity
          style={styles.locationInputContainer}
          onPress={handleLocationPress}
          activeOpacity={0.7}
        >
          <View style={styles.locationIcon}>
            <Icon name="map-marker" size={20} color={colors.white} />
          </View>
          <Text style={styles.locationInput}>{location}</Text>
          <Icon name="chevron-right" size={24} color={colors.textMuted} />
        </TouchableOpacity>
        <Text style={styles.subtitle}>Location - {location}</Text>
      </FormField>
    </SellFlowLayout>
  );
};

const styles = StyleSheet.create({
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    minHeight: 56,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  locationInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
});

export default CarLocationScreen;
