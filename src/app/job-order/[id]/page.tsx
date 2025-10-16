"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { decryptId } from "@/core/lib/crypto";
import AdminLayout from "@/app/AdminLayout";
import { IconReload } from "@tabler/icons-react";
import { token } from "@/core/lib/cookie";

interface JobOrderDetail {
  pickup_address: string;
  destination_address: string;
  id_job_order: number;
  job_number: string;
  customer_name: string;
  status_name: string;
  driver_name: string;
  driver_phone?: string;
  vehicle_plate?: string;
  vehicle_name?: string;
  pickup_location?: string;
  dropoff_location?: string;
  total_weight?: number;
  total_volume?: number;
  created_at: string;
}

export default function JobOrderDetailPage() {
  const { id } = useParams();
  const [job, setJob] = useState<JobOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const decryptedId = decryptId(id as string);

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/job-orders/${decryptedId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Gagal mengambil detail job order");

        const data = await res.json();
        setJob(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  return (
    <AdminLayout>
      <div className="pc-container content-page">
        <div className="pc-content">
          <div className="card">
            <div className="card-header">
              <h5>Job Order Detail</h5>
            </div>
            <div className="card-body position-relative">
              {loading && (
                <div className="loading-overlay d-flex flex-column align-items-center justify-content-center">
                  <IconReload size={36} className="spin mb-2" />
                  <span>Loading...</span>
                </div>
              )}

              {error && <p className="text-danger">{error}</p>}

              {!loading && job && (
                <div className="card-body">
                    <p><strong>Job Number:</strong> {job.job_number}</p>
                    <p><strong>Customer:</strong> {job.customer_name}</p>
                    <p><strong>Pickup Address:</strong> {job.pickup_address}</p>
                    <p><strong>Destination Address:</strong> {job.destination_address}</p>
                    <p><strong>Status:</strong> {job.status_name}</p>
                    <p><strong>Driver:</strong> {job.driver_name}</p>
                    <p><strong>Vehicle:</strong> {job.vehicle_plate}</p>
                    <p><strong>Total Weight:</strong> {job.total_weight} kg</p>
                    <p><strong>Total Volume:</strong> {job.total_volume} m³</p>
                    <p><strong>Created At:</strong> {new Date(job.created_at).toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <style jsx>{`
          .loading-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.8);
            z-index: 10;
          }

          .spin {
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    </AdminLayout>
  );
}
