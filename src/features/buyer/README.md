# Buyer Features

Buyer-specific features and screens.

## Features

### 1. Browse (`browse/`)
- Browse product listings
- Search products
- Filter by category, price, etc.
- **Status**: Ready for implementation (pending backend APIs)

### 2. Favorites (`favorites/`)
- Add products to wishlist
- View saved products
- Remove from favorites
- **Status**: Ready for implementation (pending backend APIs)

### 3. Orders (`orders/`)
- View order history
- Track order status
- View order details
- **Status**: Ready for implementation (pending backend APIs)

### 4. Chat (`chat/`)
- Chat with sellers
- View conversation history
- Send inquiries
- **Status**: Ready for implementation

### 5. Bidding (`bidding/`)
- Live bidding on products
- Place bids
- View bid history
- **Status**: Partially implemented (LiveBiddingScreen exists)

## How to Add New Buyer Feature

1. Choose appropriate folder (e.g., `favorites/`)
2. Add screen to `screens/` folder
3. Add hook to `hooks/` folder (e.g., `useFavorites.ts`)
4. Add API calls to `api/` folder
5. Update navigation in `App.tsx`

## Example Structure

```
favorites/
├── screens/
│   └── FavoritesScreen.tsx
├── hooks/
│   └── useFavorites.ts
├── api/
│   └── favorites.ts
└── components/
    └── FavoriteButton.tsx
```
