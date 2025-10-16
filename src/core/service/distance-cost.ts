import { token } from "../lib/cookie";

/**
 * Fetch combined distance & cost from backend
 * Endpoint Laravel: /api/job-orders/get-distance-cost/{id}
 */
export const fetchDistanceAndCost = async (jobOrderId: number | string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/job-orders/get-distance-cost/${jobOrderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal mengambil data jarak & ongkir");
    }

    const result = await response.json();
    return result.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
        throw new Error(error.message);
    }
  }
};
