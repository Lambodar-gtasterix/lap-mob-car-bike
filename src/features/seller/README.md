# Seller Features

Seller-specific features for managing product listings.

## Features

### 1. Listings (`listings/`)
MyAds management - view, edit, delete listings
- **Status**: ✅ ACTIVE (fully implemented)
- **Location**: Currently in `src/screens/MyAds/`
- **Components**: MyAdsScreen, entityAdapters, hooks

### 2. Sell (`sell/`)
Sell product flow - add new listings
- **Status**: ✅ ACTIVE (fully implemented)
- **Location**: Currently in `src/screens/` (BikeScreens, CarScreens, etc.)
- **Flow**: Choose entity → Details → Location → Pricing → Photos → Confirm

### 3. Update (`update/`)
Update existing listings
- **Status**: ✅ ACTIVE (fully implemented)
- **Location**: Currently in entity screen folders
- **Screens**: UpdateBikeScreen, UpdateCarScreen, UpdateLaptopScreen, UpdateMobileScreen

## Current Implementation

All seller features are currently working and located in:
- `src/screens/MyAds/` - Listings management
- `src/screens/BikeScreens/` - Bike sell/update flow
- `src/screens/CarScreens/` - Car sell/update flow
- `src/screens/LaptopScreens/` - Laptop sell/update flow
- `src/screens/MobileScreens/` - Mobile sell/update flow
- `src/screens/SellProductScreen.tsx` - Entry point

**Note**: Files will be migrated to this structure in future chunks to maintain better organization.
