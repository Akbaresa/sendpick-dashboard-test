"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { decryptId } from "@/core/lib/crypto";
import AdminLayout from "@/app/AdminLayout";
import { IconReload } from "@tabler/icons-react";
import { getJobOrderDetail } from "@/core/service/job-order";
import { fetchDistanceAndCost } from "@/core/service/distance-cost";
import { JobOrderDetail } from "@/core/types/job-order";

export default function JobOrderDetailPage() {
  const { id } = useParams();
  const [job, setJob] = useState<JobOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLoc, setSelectedLoc] = useState<unknown | null | any>(null);

  // Tambahan state untuk Distance & Cost
  const [distanceData, setDistanceData] = useState<any | null>(null);
  const [loadingDistance, setLoadingDistance] = useState(false);

  useEffect(() => {
    if (!id) return;

    const decryptedId = decryptId(id as string);

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await getJobOrderDetail(decryptedId);
        setJob(res);

        // Setelah detail job diambil, fetch juga jarak & ongkir
        setLoadingDistance(true);
        const distanceResult = await fetchDistanceAndCost(decryptedId);
        setDistanceData(distanceResult);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
        setLoadingDistance(false);
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
              {(loading || loadingDistance) && (
                <div className="loading-overlay d-flex flex-column align-items-center justify-content-center">
                  <IconReload size={36} className="spin mb-2" />
                  <span>Loading data...</span>
                </div>
              )}

              {error && <p className="text-danger">{error}</p>}

              {!loading && job && (
                <>
                  <div className="mb-4">
                    <h6 className="mb-2">📦 Job Info</h6>
                    <p><strong>Job Number:</strong> {job.job_order.job_number}</p>
                    <p><strong>Customer:</strong> {job.job_order.customer_name}</p>
                    <p><strong>Status:</strong> {job.job_order.status_name}</p>
                    <p><strong>Pickup:</strong> {job.job_order.pickup_address}</p>
                    <p><strong>Destination:</strong> {job.job_order.destination_address}</p>
                    <p><strong>Driver:</strong> {job.job_order.driver_name}</p>
                    <p><strong>Vehicle:</strong> {job.job_order.vehicle_plate}</p>
                    <p><strong>Total Weight:</strong> {job.job_order.total_weight} kg</p>
                    <p><strong>Total Volume:</strong> {job.job_order.total_volume} m³</p>
                    <p><strong>Created At:</strong> {new Date(job.job_order.created_at).toLocaleString()}</p>
                  </div>

                  {/* Distance & Cost Section */}
                  {distanceData && (
                    <>
                      <hr />
                      <div className="mb-4">
                        <h6 className="mb-3">🚚 Distance & Cost</h6>

                        <div className="row mb-3">
                          <div className="col-md-6">
                            <div className="p-3 border rounded bg-light">
                              <p className="mb-1"><strong>Distance:</strong> {distanceData.distance.distance_km.toFixed(2)} km</p>
                              <p className="mb-0"><strong>Duration:</strong> {distanceData.distance.duration_minutes.toFixed(1)} minutes</p>
                            </div>
                          </div>
                        </div>

                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>Courier</th>
                              <th>Service</th>
                              <th>Description</th>
                              <th>Cost (Rp)</th>
                              <th>ETD</th>
                            </tr>
                          </thead>
                          <tbody>
                            {distanceData.cost.map((c: any, index: number) => (
                              <tr key={index}>
                                <td>{c.name}</td>
                                <td>{c.service}</td>
                                <td>{c.description}</td>
                                <td>{c.cost.toLocaleString("id-ID")}</td>
                                <td>{c.etd || "-"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}

                  <hr />

                  {/* Manifest Table */}
                  <div className="mb-4">
                    <h6>📋 Manifests</h6>
                    {job.manifests.length > 0 ? (
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Item</th>
                            <th>Qty</th>
                            <th>Weight</th>
                            <th>Volume</th>
                            <th>Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {job.manifests.map((m) => (
                            <tr key={m.id_manifest}>
                              <td>{m.item_name}</td>
                              <td>{m.quantity}</td>
                              <td>{m.weight ?? "-"}</td>
                              <td>{m.volume ?? "-"}</td>
                              <td>{m.notes ?? "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-muted">No manifests found.</p>
                    )}
                  </div>

                  <hr />

                  {/* Location Table */}
                  <div>
                    <h6>📍 Locations</h6>
                    {job.locations.length > 0 ? (
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Type</th>
                            <th>Address</th>
                            <th>Latitude</th>
                            <th>Longitude</th>
                            <th>Track</th>
                          </tr>
                        </thead>
                        <tbody>
                          {job.locations.map((loc) => (
                            <tr key={loc.id_location}>
                              <td>{loc.type}</td>
                              <td>{loc.address}</td>
                              <td>{loc.lat ?? "-"}</td>
                              <td>{loc.lng ?? "-"}</td>
                              <td>
                                {loc.lat && loc.lng ? (
                                  <a
                                    href={`https://www.google.com/maps?q=${loc.lat},${loc.lng}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-sm btn-primary"
                                  >
                                    Track via Map
                                  </a>
                                ) : (
                                  <span className="text-muted">No coordinates</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-muted">No locations found.</p>
                    )}
                  </div>
                </>
              )}

              {selectedLoc && (
                <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
                  <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Track Location</h5>
                        <button
                          type="button"
                          className="btn-close"
                          onClick={() => setSelectedLoc(null)}
                        ></button>
                      </div>
                      <div className="modal-body">
                        <iframe
                          src={`https://www.google.com/maps?q=${selectedLoc.lat},${selectedLoc.lng}&z=15&output=embed`}
                          width="100%"
                          height="400"
                          style={{ border: 0 }}
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Styles */}
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
