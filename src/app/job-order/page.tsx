"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { JobOrder } from "@/core/types/job-order";
import { getJobOrders } from "@/core/service/job-order";
import AdminLayout from "../AdminLayout";
import { IconArrowDown, IconArrowUp, IconEye, IconReload } from "@tabler/icons-react";
import { encryptId } from "@/core/lib/crypto";

export default function JobOrderTable() {
  const [jobOrders, setJobOrders] = useState<JobOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [perPage, setPerPage] = useState(10);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getJobOrders({
        page: currentPage,
        search,
        sort_by: sortBy,
        sort_dir: sortDir,
        per_page: perPage,
      });

      setJobOrders(res.data.data);
      setCurrentPage(res.data.current_page);
      setLastPage(res.data.last_page);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, search, sortBy, sortDir, perPage]);

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= lastPage) setCurrentPage(page);
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDir("asc");
    }
  };

  return (
    <AdminLayout>
      <div className="pc-container content-page">
        <div className="pc-content">
          <div className="page-header">
            <div className="page-block">
              <div className="row align-items-center">
                <div className="col-md-12">
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item"><a href="">Home</a></li>
                    <li className="breadcrumb-item"><a href="javascript: void(0)">Membership</a></li>
                    <li className="breadcrumb-item" aria-current="page">Membership List</li>
                  </ul>
                </div>
                <div className="col-md-12">
                  <div className="page-header-title">
                    <h2 className="mb-0">Membership List</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card table-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5>Job Order list</h5>
              <div className="d-flex align-items-center gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select
                  className="form-select"
                  value={perPage}
                  onChange={(e) => setPerPage(Number(e.target.value))}
                >
                  {[5, 10, 25, 50].map((n) => (
                    <option key={n} value={n}>
                      {n} / page
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="card-body pt-3">
              <div className="table-responsive position-relative">
                {loading && (
                  <div className="loading-overlay d-flex flex-column align-items-center justify-content-center">
                    <IconReload size={36} className="spin mb-2" />
                    <span>Loading...</span>
                  </div>
                )}

                {error ? (
                  <p className="text-danger">{error}</p>
                ) : (
                  <>
                    <table className="table table-hover" id="pc-dt-simple">
                      <thead>
                        <tr>
                          {["job_number", "customer_name", "created_at", "status_name", "driver_name", "vehicle_plate"].map(
                            (col) => (
                              <th key={col} onClick={() => handleSort(col)} style={{ cursor: "pointer" }}>
                                {col.replace("_", " ").toUpperCase()}
                                {sortBy === col && (sortDir === "asc" ? <IconArrowUp size={14} /> : <IconArrowDown size={14} />)}
                              </th>
                            )
                          )}
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jobOrders.map((job) => {
                          const encryptedId = encryptId(job.id_job_order);
                          return (
                            <tr key={job.id_job_order}>
                              <td>{job.job_number}</td>
                              <td>{job.customer_name}</td>
                              <td>{job.created_at}</td>
                              <td className={job.status_name === "in_transit" ? "text-warning" : "text-success"}>
                                {job.status_name}
                              </td>
                              <td>{job.driver_name}</td>
                              <td>{job.vehicle_plate}</td>
                              <td>
                                <Link
                                  href={`/job-order/${encryptedId}`}
                                  className="avtar avtar-xs btn-primary text-white bg-primary me-1"
                                >
                                  <IconEye size={20} />
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    <nav className="mt-3">
                      <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                          <button className="page-link" onClick={() => handlePageClick(currentPage - 1)}>
                            Previous
                          </button>
                        </li>
                        {Array.from({ length: lastPage }, (_, i) => (
                          <li key={i + 1} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                            <button className="page-link" onClick={() => handlePageClick(i + 1)}>
                              {i + 1}
                            </button>
                          </li>
                        ))}
                        <li className={`page-item ${currentPage === lastPage ? "disabled" : ""}`}>
                          <button className="page-link" onClick={() => handlePageClick(currentPage + 1)}>
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </>
                )}
              </div>
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
        `}</style>
      </div>
    </AdminLayout>
  );
}
