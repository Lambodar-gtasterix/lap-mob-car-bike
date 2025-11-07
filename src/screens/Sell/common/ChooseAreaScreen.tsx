import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { colors, radii, spacing } from '../../../theme/tokens';
import { SellCarStackParamList } from '../../../navigation/SellCarStack';

const PANDHARPUR_AREAS = [
  'Vitthal Mandir Area',
  'Bus Stand',
  'Railway Station Road',
  'Wakhari',
  'Bhima River Side',
];

type ChooseAreaRouteProp = RouteProp<SellCarStackParamList, 'ChooseAreaScreen'>;

const ChooseAreaScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<ChooseAreaRouteProp>();
  const { cityName, carId, images } = route.params;

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAreas, setFilteredAreas] = useState(PANDHARPUR_AREAS);

  const handleClose = () => {
    navigation.goBack();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredAreas(PANDHARPUR_AREAS);
    } else {
      const filtered = PANDHARPUR_AREAS.filter((area) =>
        area.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredAreas(filtered);
    }
  };

  const handleAreaPress = (area: string) => {
    const fullLocation = `${area}, ${cityName}, Maharashtra`;
    console.log('Selected location:', fullLocation);

    // Navigate back to CarLocationScreen with selected location
    navigation.navigate('CarLocationScreen', {
      carId,
      images,
      selectedLocation: fullLocation
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Icon name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{cityName}</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={20} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search area"
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Icon name="close-circle" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Areas Section */}
        <View style={styles.areasHeader}>
          <Text style={styles.areasHeaderText}>Choose Area</Text>
        </View>

        {/* Areas List */}
        <FlatList
          data={filteredAreas}
          keyExtractor={(item) => item}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.areasList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.areaItem}
              onPress={() => handleAreaPress(item)}
              activeOpacity={0.7}
            >
              <Text style={styles.areaText}>{item}</Text>
              <Icon name="chevron-right" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.areaDivider} />}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.white,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    position: 'absolute',
    left: spacing.lg,
    padding: spacing.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    minHeight: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  areasHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  areasHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  areasList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  areaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  areaText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  areaDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing.md,
  },
});

export default ChooseAreaScreen;
