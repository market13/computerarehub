import { supabase, safeDbQuery } from './supabaseClient';

const REPAIR_STORAGE_KEY = 'computercare_repair_tickets';

const INITIAL_REPAIR_TICKETS = [
  {
    id: '1001-rep',
    job_id: 'CC-REP-1042',
    customer_name: 'Rahul Sharma',
    customer_phone: '9810550000',
    customer_email: 'rahul.s@example.com',
    device_type: 'Desktop PC',
    device_brand_model: 'Custom Ryzen 5 5600X Gaming PC',
    serial_number: 'SN-GZB-2026-09',
    issue_description: 'Display output flickering under GPU load; thermal re-pasting requested.',
    status: 'in_progress',
    estimated_cost: 1200,
    technician_notes: 'Tested RTX 3060 temps. Thermal paste replaced with Arctic MX-4. Stress testing underway.',
    created_at: '2026-11-16T11:30:00Z',
    updated_at: '2026-11-17T15:20:00Z',
  },
  {
    id: '1002-rep',
    job_id: 'CC-REP-1041',
    customer_name: 'Priya Verma',
    customer_phone: '9871000000',
    customer_email: 'priya.v@example.com',
    device_type: 'Laptop',
    device_brand_model: 'Dell Inspiron 15 3501',
    serial_number: 'DELL-88219-IN',
    issue_description: 'Extremely slow boot times; upgrade from HDD to 500GB NVMe SSD.',
    status: 'ready_for_pickup',
    estimated_cost: 3200,
    technician_notes: 'Crucial P3 500GB NVMe installed. OS cloned successfully. Ready for collection at Shiva Tower.',
    created_at: '2026-11-15T14:10:00Z',
    updated_at: '2026-11-16T17:45:00Z',
  },
  {
    id: '1003-rep',
    job_id: 'CC-REP-1040',
    customer_name: 'Amit Kumar',
    customer_phone: '9811223344',
    customer_email: 'amit.k@example.com',
    device_type: 'Laptop',
    device_brand_model: 'HP Pavilion Gaming 15',
    serial_number: 'HP-99382',
    issue_description: 'Cooling fan rattling loudly; high CPU throttling.',
    status: 'delivered',
    estimated_cost: 1800,
    final_cost: 1800,
    technician_notes: 'Replaced CPU blower fan and cleaned heat sink. Completed and handed over to customer.',
    created_at: '2026-11-12T10:00:00Z',
    updated_at: '2026-11-14T18:00:00Z',
  },
];

export function generateJobId() {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `CC-REP-${num}`;
}

export const REPAIR_STATUS_MAP = {
  received: { label: 'Device Received', color: 'bg-blue-50 text-blue-700 border-blue-200', step: 1 },
  diagnosing: { label: 'Under Diagnosis', color: 'bg-amber-50 text-amber-700 border-amber-200', step: 2 },
  awaiting_parts: { label: 'Awaiting Spare Parts', color: 'bg-orange-50 text-orange-700 border-orange-200', step: 3 },
  in_progress: { label: 'Repair in Progress', color: 'bg-purple-50 text-purple-700 border-purple-200', step: 4 },
  ready_for_pickup: { label: 'Ready for Pickup', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', step: 5 },
  delivered: { label: 'Handed Over / Completed', color: 'bg-slate-100 text-slate-700 border-slate-300', step: 6 },
  cancelled: { label: 'Cancelled / Returned', color: 'bg-rose-50 text-rose-700 border-rose-200', step: 0 },
};

/**
 * Look up a repair ticket by Job ID or Phone
 */
export async function getRepairTicket(query) {
  const cleaned = (query || '').trim().toUpperCase();
  if (!cleaned) return null;

  return await safeDbQuery(
    async (client) => {
      const isJobId = cleaned.startsWith('CC-REP') || cleaned.includes('-');
      let req = client.from('repair_tickets').select('*');
      if (isJobId) {
        req = req.eq('job_id', cleaned);
      } else {
        req = req.eq('customer_phone', cleaned);
      }
      const { data, error } = await req.maybeSingle();
      if (error) throw error;
      return data;
    },
    async () => {
      const tickets = getLocalRepairTickets();
      return (
        tickets.find(
          (t) =>
            t.job_id.toUpperCase() === cleaned ||
            t.customer_phone.replace(/\D/g, '').endsWith(cleaned.replace(/\D/g, ''))
        ) || null
      );
    }
  );
}

/**
 * Create a new repair job ticket
 */
export async function createRepairTicket(ticketData) {
  const jobId = generateJobId();
  const newTicket = {
    job_id: jobId,
    customer_name: ticketData.customerName,
    customer_phone: ticketData.customerPhone,
    customer_email: ticketData.customerEmail || '',
    device_type: ticketData.deviceType || 'Desktop PC',
    device_brand_model: ticketData.deviceBrandModel || '',
    serial_number: ticketData.serialNumber || '',
    issue_description: ticketData.issueDescription || '',
    accessories_included: ticketData.accessoriesIncluded || 'Device only',
    status: 'received',
    estimated_cost: Number(ticketData.estimatedCost) || 0,
    technician_notes: 'Device checked in at Computer Care, Shiva Tower.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return await safeDbQuery(
    async (client) => {
      const { data, error } = await client
        .from('repair_tickets')
        .insert(newTicket)
        .select()
        .single();
      if (error) throw error;
      return { jobId, ticket: data };
    },
    async () => {
      const list = getLocalRepairTickets();
      list.unshift(newTicket);
      saveLocalRepairTickets(list);
      return { jobId, ticket: newTicket };
    }
  );
}

/**
 * Update an existing repair ticket status or notes (Admin)
 */
export async function updateRepairTicket(jobId, updates) {
  const payload = {
    ...updates,
    updated_at: new Date().toISOString(),
  };

  return await safeDbQuery(
    async (client) => {
      const { data, error } = await client
        .from('repair_tickets')
        .update(payload)
        .eq('job_id', jobId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    async () => {
      const list = getLocalRepairTickets();
      const idx = list.findIndex((t) => t.job_id === jobId);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...payload };
        saveLocalRepairTickets(list);
        return list[idx];
      }
      return null;
    }
  );
}

/**
 * Retrieve all repair tickets for Admin dashboard
 */
export async function getAllRepairTickets() {
  return await safeDbQuery(
    async (client) => {
      const { data, error } = await client
        .from('repair_tickets')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    async () => {
      return getLocalRepairTickets();
    }
  );
}

function getLocalRepairTickets() {
  try {
    const raw = localStorage.getItem(REPAIR_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(REPAIR_STORAGE_KEY, JSON.stringify(INITIAL_REPAIR_TICKETS));
      return INITIAL_REPAIR_TICKETS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_REPAIR_TICKETS;
  }
}

function saveLocalRepairTickets(tickets) {
  try {
    localStorage.setItem(REPAIR_STORAGE_KEY, JSON.stringify(tickets));
  } catch (err) {
    console.warn('Failed to save repair tickets to localStorage', err);
  }
}
