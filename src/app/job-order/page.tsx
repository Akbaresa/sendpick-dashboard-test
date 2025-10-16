'use client'

import { useEffect, useState } from 'react';
import AdminLayout from '../AdminLayout';
import { IconEye, IconEdit, IconTrash } from '@tabler/icons-react';
import { getJobOrders } from '@/core/service/job-order';
import type { JobOrder as JobOrderType } from '@/core/types/job-order';

export default function JobOrder() {
  const [jobOrders, setJobOrders] = useState<JobOrderType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchJobOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getJobOrders();
      setJobOrders(data);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobOrders();
  }, []);

  return (
    <AdminLayout>
      <div className="pc-container content-page">
        <div className="pc-content">
          <div className="card table-card">
            <div className="card-header">
              <h5>Job Order list</h5>
            </div>
            <div className="card-body pt-3">
              <div className="table-responsive">
                {loading ? (
                  <p>Loading...</p>
                ) : error ? (
                  <p className="text-danger">{error}</p>
                ) : (
                  <table className="table table-hover" id="pc-dt-simple">
                    <thead>
                      <tr>
                        <th>Job Number</th>
                        <th>Customer</th>
                        <th>Created At</th>
                        <th>Status</th>
                        <th>Driver</th>
                        <th>Vehicle</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobOrders.map((job) => (
                        <tr key={job.id_job_order}>
                          <td>{job.job_number}</td>
                          <td>{job.customer_name}</td>
                          <td>{job.created_at}</td>
                          <td className={job.status_name === 'in_transit' ? 'text-warning' : 'text-success'}>
                            {job.status_name}
                          </td>
                          <td>{job.driver_name}</td>
                          <td>{job.vehicle_plate}</td>
                          <td>
                            <a href="#" className="avtar avtar-xs btn-link-secondary me-1"><IconEye size={20} /></a>
                            <a href="#" className="avtar avtar-xs btn-link-secondary me-1"><IconEdit size={20} /></a>
                            <a href="#" className="avtar avtar-xs btn-link-secondary"><IconTrash size={20} /></a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
