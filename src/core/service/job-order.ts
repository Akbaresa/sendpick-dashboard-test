import { JobOrderDetail, JobOrderResponse } from '../types/job-order';
import { token } from '../lib/cookie';
import { ApiResponse } from '../types';

interface GetJobOrdersParams {
  page?: number;
  search?: string;
  sort_by?: string;
  sort_dir?: 'asc' | 'desc';
  per_page?: number;
}

export const getJobOrders = async (params: GetJobOrdersParams = {}): Promise<JobOrderResponse> => {
  if (!token) throw new Error('No token found');

  const {
    page = 1,
    search = '',
    sort_by = 'created_at',
    sort_dir = 'desc',
    per_page = 10,
  } = params;

  const query = new URLSearchParams();
  query.append('page', page.toString());
  if (search) query.append('search', search);
  if (sort_by) query.append('sort_by', sort_by);
  if (sort_dir) query.append('sort_dir', sort_dir);
  if (per_page) query.append('per_page', per_page.toString());

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/job-orders?${query.toString()}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch job orders');
  }

  const data: JobOrderResponse = await res.json();
  return data;
};


export const getJobOrderDetail = async (
  id: number | string
): Promise<JobOrderDetail> => {
  if (!token) throw new Error("No token found");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/job-orders/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch job order detail: ${text}`);
  }

  const json: ApiResponse<JobOrderDetail> = await res.json();
  return json.data;
};
