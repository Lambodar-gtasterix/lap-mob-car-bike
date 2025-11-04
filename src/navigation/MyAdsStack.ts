// src/navigation/MyAdsStack.ts
import { MyMobileAdsStackParamList } from './MyMobileAdsStack';
import { MyLaptopAdsStackParamList } from './MyLaptopAdsStack';
import { MyCarAdsStackParamList } from './MyCarAdsStack';
import { MyBikeAdsStackParamList } from './MyBikeAdsStack';

export type MyAdsStackParamList = MyMobileAdsStackParamList &
  MyLaptopAdsStackParamList &
  MyCarAdsStackParamList &
  MyBikeAdsStackParamList;
