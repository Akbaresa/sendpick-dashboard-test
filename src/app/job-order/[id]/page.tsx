"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { decryptId } from "@/core/lib/crypto";
import AdminLayout from "@/app/AdminLayout";
import { IconReload } from "@tabler/icons-react";
import { getJobOrderDetail } from "@/core/service/job-order";
import { fetchDistanceAndCost } from "@/core/service/distance-cost";
import { JobOrderDetail } from "@/core/types/job-order";
import Link from "next/link";

export default function JobOrderDetailPage() {
  const { id } = useParams();
  const [job, setJob] = useState<JobOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openMapId, setOpenMapId] = useState<number | null>(null);
  const [distanceData, setDistanceData] = useState<any | null>(null);
  const [loadingDistance, setLoadingDistance] = useState(false);

  const handleToggleMap = (id: number) => {
    setOpenMapId(openMapId === id ? null : id);
  };

  useEffect(() => {
    if (!id) return;

    const decryptedId = decryptId(id as string);

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await getJobOrderDetail(decryptedId);
        setJob(res);


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
          <div className="page-header">
            <div className="page-block">
              <div className="row align-items-center">
                <div className="col-md-12">
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item"><a>Home</a></li>
                    <li className="breadcrumb-item" aria-current="page"><Link href={`/job-order`}>Job Order</Link></li>
                  </ul>
                </div>
                <div className="col-md-12">
                  <div className="page-header-title">
                    <h2 className="mb-0">Job Order</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h5>Job Order Detail</h5>
            </div>
            <div className="card-body position-relative" style={{ overflow: "visible" }}>
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

                  {/* Location Timeline */}
                  <div className="location-timeline-container mt-4">
                    <h6>📍 Location Timeline</h6>

                    {job.locations.length > 0 ? (
                      <div className="timeline">
                        {job.locations.map((loc: any, index: number) => (
                          <div className="timeline-item" key={loc.id_location}>
                            <div className="timeline-icon">
                              {index === 0
                                ? "🚚"
                                : index === job.locations.length - 1
                                  ? "🏁"
                                  : "📦"}
                            </div>

                            <div className="timeline-content">
                              <h6 className="mb-1">{loc.type}</h6>
                              <p className="mb-1 text-muted">{loc.address}</p>
                              <p className="mb-1">
                                <strong>Lat:</strong> {loc.lat ?? "-"} |{" "}
                                <strong>Lng:</strong> {loc.lng ?? "-"}
                              </p>

                              {loc.lat && loc.lng ? (
                                <button
                                  onClick={() => handleToggleMap(loc.id_location)}
                                  className="btn btn-sm btn-outline-primary mt-2"
                                >
                                  {openMapId === loc.id_location
                                    ? "Hide Map"
                                    : "Track via Map"}
                                </button>
                              ) : (
                                <span className="text-muted mt-2 d-block">
                                  No coordinates
                                </span>
                              )}

                              <div
                                className={`map-container mt-3 position-relative ${openMapId === loc.id_location ? "show" : ""
                                  }`}
                              >
                                {openMapId === loc.id_location && (
                                  <div
                                    className="map-embed card position-absolute start-0 end-0"
                                    style={{
                                      top: "100%",
                                      zIndex: 1000,
                                      marginTop: "10px",
                                      boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                                      borderRadius: "12px",
                                      overflow: "hidden",
                                    }}
                                  >
                                    <div className="card-body p-0">
                                      <iframe
                                        src={`https://www.google.com/maps?q=${loc.lat},${loc.lng}&z=14&output=embed`}
                                        width="100%"
                                        height="250"
                                        style={{
                                          border: 0,
                                          display: "block",
                                          borderRadius: "12px",
                                        }}
                                        allowFullScreen
                                        loading="lazy"
                                      ></iframe>
                                    </div>
                                  </div>
                                )}
                              </div>



                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted">No locations found.</p>
                    )}
                  </div>

                  <hr />

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



                </>
              )}
            </div>
          </div>
        </div>


      </div>
    </AdminLayout>
  );
}
