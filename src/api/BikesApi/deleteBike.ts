import api from '../client';

export async function deleteBike(bikeId: number): Promise<{ status: string; message: string }> {
  const { data } = await api.delete(`/bikes/delete/${bikeId}`);
  return data;
}
