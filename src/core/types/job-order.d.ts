export interface JobOrder {
  id_job_order: number;
  job_number: string;
  customer_name: string;
  created_at: string;
  status_name: string;
  driver_name: string;
  vehicle_plate: string;
}

export interface JobOrderResponse {
  status: boolean;
  message: string;
  data: {
    current_page: number;
    data: JobOrder[];
    last_page: number;
    per_page: number;
    total: number;
    next_page_url: string | null;
    prev_page_url: string | null;
  };
}

export interface JobOrderDetail {
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


interface Manifest {
  id_manifest: number;
  item_name: string;
  quantity: number;
  weight?: number;
  volume?: number;
  notes?: string;
}

interface Location {
  id_location: number;
  type: string;
  address: string;
  lat?: number;
  lng?: number;
}

export interface JobOrderDetail {
  job_order: {
    id_job_order: number;
    job_number: string;
    customer_name: string;
    pickup_address: string;
    destination_address: string;
    status_name: string;
    driver_name?: string;
    vehicle_plate?: string;
    total_weight?: number;
    total_volume?: number;
    created_at: string;
  };
  manifests: Manifest[];
  locations: Location[];
}