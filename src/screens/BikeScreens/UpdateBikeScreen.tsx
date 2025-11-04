import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { MyBikeAdsStackParamList } from '../../navigation/MyBikeAdsStack';
import { getBikeById, updateBike, UpdateBikeDTO } from '../../api/BikesApi';
import ListingUpdateLayout from '../../components/details/ListingUpdateLayout';
import ListingUpdateLoader from '../../components/details/ListingUpdateLoader';
import ListingFormInput from '../../components/form/ListingFormInput';
import ListingFormDropdown from '../../components/form/ListingFormDropdown';
import ListingFormTextArea from '../../components/form/ListingFormTextArea';
import ListingYearPickerField from '../../components/form/ListingYearPickerField';
import {
  listingUpdateStyles,
  LISTING_UPDATE_COLORS as COLORS,
  LISTING_UPDATE_SPACING as SPACING,
} from '../../theme/listingUpdate';
import useListingDetails from '../../hooks/useListingDetails';
import { BikeDetail } from '../../api/BikesApi';
import getFriendlyApiError from '../../utils/getFriendlyApiError';
import { useAuth } from '../../context/AuthContext';

type UpdateRouteProp = RouteProp<MyBikeAdsStackParamList, 'UpdateBike'>;
type UpdateNavProp = NativeStackNavigationProp<MyBikeAdsStackParamList, 'UpdateBike'>;

type FormErrors = {
  brand?: string;
  model?: string;
  variant?: string;
  manufactureYear?: string;
  engineCC?: string;
  kilometersDriven?: string;
  fuelType?: string;
  color?: string;
  registrationNumber?: string;
  description?: string;
  prize?: string;
};

const fuelTypeOptions = [
  { label: 'Petrol', value: 'PETROL' },
  { label: 'Diesel', value: 'DIESEL' },
  { label: 'Electric', value: 'ELECTRIC' },
  { label: 'CNG', value: 'CNG' },
];

const styles = listingUpdateStyles;

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1990;

const UpdateBikeScreen: React.FC = () => {
  const navigation = useNavigation<UpdateNavProp>();
  const { params } = useRoute<UpdateRouteProp>();
  const { bikeId } = params;
  const { sellerId: authSellerId } = useAuth();

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    variant: '',
    manufactureYear: '',
    engineCC: '',
    kilometersDriven: '',
    fuelType: null as string | null,
    color: '',
    registrationNumber: '',
    prize: '',
    description: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [ownerSellerId, setOwnerSellerId] = useState<number | null>(null);
  const [initialFormData, setInitialFormData] = useState<typeof formData | null>(null);

  const yearOptions = useMemo(() => {
    const years: string[] = [];
    for (let year = CURRENT_YEAR; year >= MIN_YEAR; year--) {
      years.push(year.toString());
    }
    return years;
  }, []);

  const fetchBike = useCallback(() => getBikeById(bikeId), [bikeId]);

  const { data, loading, error } = useListingDetails<BikeDetail>(fetchBike, {
    defaultErrorMessage: 'Failed to load bike details',
  });

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  useEffect(() => {
    if (!data) return;
    const nextFormData = {
      brand: data.brand ?? '',
      model: data.model ?? '',
      variant: data.variant ?? '',
      manufactureYear: data.manufactureYear ? String(data.manufactureYear) : '',
      engineCC: data.engineCC ? String(data.engineCC) : '',
      kilometersDriven: data.kilometersDriven ? String(data.kilometersDriven) : '',
      fuelType: (data.fuelType as string) ?? null,
      color: data.color ?? '',
      registrationNumber: data.registrationNumber ?? '',
      prize: data.prize != null ? String(data.prize) : '',
      description: data.description ?? '',
    };
    setFormData(nextFormData);
    setInitialFormData({ ...nextFormData });
    setOwnerSellerId(
      typeof data.sellerId === 'number' && Number.isFinite(data.sellerId)
        ? data.sellerId
        : null,
    );
    setTouched({});
    setErrors({});
  }, [data]);

  const validateField = useCallback((field: string, value: any): string | undefined => {
    switch (field) {
      case 'brand':
        if (!value || value.trim().length < 2) return 'Brand name is required';
        break;
      case 'model':
        if (!value || value.trim().length < 1) return 'Model name is required';
        break;
      case 'variant':
        if (!value || value.trim().length < 1) return 'Variant is required';
        break;
      case 'color':
        if (!value || value.trim().length < 2) return 'Color is required';
        break;
      case 'description':
        if (!value || value.trim().length < 20) return 'Description must be at least 20 characters';
        if (value.length > 400) return 'Description must not exceed 400 characters';
        break;
      case 'prize': {
        const price = parseFloat(value);
        if (!value || Number.isNaN(price)) return 'Please enter a valid price';
        if (price <= 0 || price > 10000000) return 'Please enter a valid price between 1 and 10000000';
        break;
      }
      case 'manufactureYear': {
        if (!value || value.length < 4) return 'Please select manufacture year';
        const year = parseInt(value, 10);
        if (Number.isNaN(year) || year < MIN_YEAR || year > CURRENT_YEAR) {
          return `Please select a valid year between ${MIN_YEAR} and ${CURRENT_YEAR}`;
        }
        break;
      }
      case 'engineCC': {
        if (!value || value.trim() === '') return undefined;
        const cc = parseInt(value, 10);
        if (Number.isNaN(cc) || cc < 0) return 'Please enter a valid number';
        break;
      }
      case 'kilometersDriven': {
        if (!value || value.trim() === '') return undefined;
        const km = parseInt(value, 10);
        if (Number.isNaN(km) || km < 0) return 'Please enter a valid number';
        break;
      }
      case 'registrationNumber':
        if (!value || value.trim().length < 5) return 'Registration number is required';
        break;
      case 'fuelType':
        if (!value) return 'Please select fuel type';
        break;
      default:
        break;
    }
    return undefined;
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof typeof formData>).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched((prev) => {
      const updated: Record<string, boolean> = { ...prev };
      (Object.keys(formData) as Array<keyof typeof formData>).forEach((field) => {
        updated[field] = true;
      });
      return updated;
    });
    return isValid;
  }, [formData, validateField]);

  const handleInputChange = useCallback(
    (field: string, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      if (touched[field]) {
        const error = validateField(field, value);
        setErrors((prev) => ({ ...prev, [field]: error }));
      }
    },
    [touched, validateField],
  );

  const handleBlur = useCallback(
    (field: string, value?: any) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const valueToValidate = value !== undefined ? value : formData[field];
      const error = validateField(field, valueToValidate);
      setErrors((prev) => ({ ...prev, [field]: error }));
    },
    [formData, validateField],
  );

  const handleUpdate = useCallback(async () => {
    if (!validateForm()) {
      Alert.alert('Please review the form', 'Correct highlighted fields before saving.');
      return;
    }

    const changedFields = initialFormData
      ? (Object.keys(formData) as Array<keyof typeof formData>).filter((field) => {
          const current = formData[field];
          const initial = initialFormData[field];
          const normalize = (value: any) => {
            if (typeof value === 'string') {
              return value.trim();
            }
            return value;
          };
          return normalize(current) !== normalize(initial);
        })
      : (Object.keys(formData) as Array<keyof typeof formData>);

    if (changedFields.length === 0) {
      Alert.alert('No changes detected', 'Please update at least one field before saving.');
      return;
    }

    const prizeNum = parseFloat(formData.prize);
    const yearNum = parseInt(formData.manufactureYear, 10);
    const engineCCNum = formData.engineCC.trim() ? parseInt(formData.engineCC, 10) : undefined;
    const kmNum = formData.kilometersDriven.trim() ? parseInt(formData.kilometersDriven, 10) : undefined;

    try {
      setSaving(true);

      const payload: UpdateBikeDTO = {
        prize: prizeNum,
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        variant: formData.variant.trim(),
        manufactureYear: yearNum,
        engineCC: engineCCNum,
        kilometersDriven: kmNum,
        fuelType: formData.fuelType || undefined,
        color: formData.color.trim(),
        registrationNumber: formData.registrationNumber.trim(),
        description: formData.description.trim(),
        status: 'ACTIVE',
      };

      const resolvedSellerId =
        (typeof ownerSellerId === 'number' && Number.isFinite(ownerSellerId) && ownerSellerId) ||
        (typeof authSellerId === 'number' && Number.isFinite(authSellerId) && authSellerId) ||
        undefined;

      if (resolvedSellerId !== undefined) {
        Object.assign(payload, { sellerId: resolvedSellerId });
      }

      await updateBike(bikeId, payload);
      Alert.alert('Success', 'Bike updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', getFriendlyApiError(err, 'Failed to update bike'));
    } finally {
      setSaving(false);
    }
  }, [authSellerId, formData, initialFormData, bikeId, navigation, ownerSellerId, validateForm]);

  if (loading) {
    return <ListingUpdateLoader message="Loading bike details..." />;
  }

  return (
    <>
      <ListingUpdateLayout
        title="Edit Bike Details"
        onBack={() => navigation.goBack()}
        footer={
          <TouchableOpacity
            style={[styles.nextButton, saving && styles.nextButtonDisabled]}
            onPress={handleUpdate}
            disabled={saving}
            activeOpacity={0.8}
          >
            {saving ? (
              <ActivityIndicator color={COLORS.white} size="small" />
            ) : (
              <Text style={styles.nextButtonText}>Update</Text>
            )}
          </TouchableOpacity>
        }
        scrollProps={{ showsVerticalScrollIndicator: false }}
      >
        <ListingFormInput
          label="Brand"
          placeholder="e.g., Honda, Yamaha, Royal Enfield"
          value={formData.brand}
          onChangeText={(v) => handleInputChange('brand', v)}
          onBlur={() => handleBlur('brand')}
          error={touched.brand ? errors.brand : undefined}
          autoCapitalize="words"
          autoCorrect={false}
          maxLength={40}
          required
        />

        <ListingFormInput
          label="Model"
          placeholder="e.g., CB Shine 125, FZ-S"
          value={formData.model}
          onChangeText={(v) => handleInputChange('model', v)}
          onBlur={() => handleBlur('model')}
          error={touched.model ? errors.model : undefined}
          autoCapitalize="words"
          autoCorrect={false}
          maxLength={40}
          required
        />

        <ListingFormInput
          label="Variant"
          placeholder="e.g., Drum Brake BS6, ABS, Standard"
          value={formData.variant}
          onChangeText={(v) => handleInputChange('variant', v)}
          onBlur={() => handleBlur('variant')}
          error={touched.variant ? errors.variant : undefined}
          autoCapitalize="words"
          maxLength={60}
          required
        />

        <ListingYearPickerField
          label="Manufacture Year"
          value={formData.manufactureYear}
          years={yearOptions}
          onChange={(year) => {
            handleInputChange('manufactureYear', year);
            handleBlur('manufactureYear', year);
          }}
          required
          error={touched.manufactureYear ? errors.manufactureYear : undefined}
        />

        <ListingFormInput
          label="Engine CC"
          placeholder="e.g., 125, 150, 350"
          value={formData.engineCC}
          onChangeText={(v) => handleInputChange('engineCC', v.replace(/[^0-9]/g, ''))}
          onBlur={() => handleBlur('engineCC')}
          error={touched.engineCC ? errors.engineCC : undefined}
          keyboardType="numeric"
          maxLength={6}
        />

        <ListingFormInput
          label="Kilometers Driven"
          placeholder="e.g., 18500"
          value={formData.kilometersDriven}
          onChangeText={(v) => handleInputChange('kilometersDriven', v.replace(/[^0-9]/g, ''))}
          onBlur={() => handleBlur('kilometersDriven')}
          error={touched.kilometersDriven ? errors.kilometersDriven : undefined}
          keyboardType="numeric"
          maxLength={10}
        />

        <ListingFormDropdown
          label="Fuel Type"
          data={fuelTypeOptions}
          value={formData.fuelType}
          onChange={(item) => {
            handleInputChange('fuelType', item.value);
            handleBlur('fuelType', item.value);
          }}
          error={touched.fuelType ? errors.fuelType : undefined}
          required
        />

        <ListingFormInput
          label="Color"
          placeholder="e.g., Black, Red, Blue"
          value={formData.color}
          onChangeText={(v) => handleInputChange('color', v)}
          onBlur={() => handleBlur('color')}
          error={touched.color ? errors.color : undefined}
          autoCapitalize="words"
          maxLength={40}
          required
        />

        <ListingFormInput
          label="Registration Number"
          placeholder="e.g., MH15AB3456"
          value={formData.registrationNumber}
          onChangeText={(v) => handleInputChange('registrationNumber', v.toUpperCase())}
          onBlur={() => handleBlur('registrationNumber')}
          error={touched.registrationNumber ? errors.registrationNumber : undefined}
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={20}
          required
        />

        <ListingFormInput
          label="Price"
          placeholder="Enter price in ₹"
          value={formData.prize}
          onChangeText={(v) => handleInputChange('prize', v.replace(/[^0-9]/g, ''))}
          onBlur={() => handleBlur('prize')}
          error={touched.prize ? errors.prize : undefined}
          keyboardType="numeric"
          maxLength={10}
          required
        />

        <ListingFormTextArea
          label="Description"
          value={formData.description}
          onChangeText={(v) => handleInputChange('description', v)}
          onBlur={() => handleBlur('description')}
          error={touched.description ? errors.description : undefined}
          autoCapitalize="sentences"
          maxLength={400}
          required
          placeholder="Describe your bike's condition, service history, and accessories..."
        />

        <View style={{ height: SPACING.xxxl }} />
      </ListingUpdateLayout>
    </>
  );
};

export default UpdateBikeScreen;
