import client from '../client';

export type BikeStatus = 'ACTIVE' | 'DRAFT' | 'SOLD' | string;

export type BikeItem = {
  bike_id: number;
  prize: number;
  brand?: string;
  model?: string;
  variant?: string;
  manufactureYear?: number;
  engineCC?: number;
  kilometersDriven?: number;
  fuelType?: string;
  color?: string;
  registrationNumber?: string;
  description?: string;
  sellerId?: number;
  status?: BikeStatus;
  createdAt?: string;
  images?: Array<{
    imageId: number;
    image_link: string;
    publicId: string;
  }>;
};

export type BikeResponse = BikeItem[];

export async function getAllBikes(params?: { page?: number; size?: number; sort?: string }) {
  const res = await client.get<BikeResponse>('/bikes/get');

  // Transform response to match PageResponse format for compatibility
  return {
    content: res.data || [],
    last: true,
    first: true,
    totalPages: 1,
    totalElements: res.data?.length || 0,
    size: res.data?.length || 0,
    number: 0,
    numberOfElements: res.data?.length || 0,
    empty: !res.data || res.data.length === 0,
  };
}
