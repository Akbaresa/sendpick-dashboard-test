import { JobOrder, JobOrderResponse } from '../types/job-order';
import { token } from '../lib/cookie';

export const getJobOrders = async (page: number = 1): Promise<JobOrder[]> => {
  if (!token) throw new Error('No token found');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/job-orders?page=${page}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('Failed to fetch job orders');

  const data: JobOrderResponse = await res.json();
  return data.data.data;
};
