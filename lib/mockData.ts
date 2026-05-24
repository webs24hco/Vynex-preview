export interface Appointment {
  id: string;
  clientName: string;
  service: string;
  time: string;
  duration: string;
  price: number;
  status: "confirmed" | "pending" | "completed";
  avatar?: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  lastVisit: string;
  favoriteService: string;
  pendingBalance: number;
  totalVisits: number;
  notes: string;
  avatar?: string;
}

export interface Service {
  id: string;
  name: string;
  duration: string;
  price: number;
  category: string;
}

export const todayAppointments: Appointment[] = [
  {
    id: "1",
    clientName: "María García",
    service: "Balayage + Cut",
    time: "09:00",
    duration: "2h 30min",
    price: 180,
    status: "completed",
  },
  {
    id: "2",
    clientName: "Laura Méndez",
    service: "Manicure Gel",
    time: "11:30",
    duration: "1h",
    price: 45,
    status: "confirmed",
  },
  {
    id: "3",
    clientName: "Sofía Torres",
    service: "Facial Treatment",
    time: "13:00",
    duration: "1h 15min",
    price: 95,
    status: "pending",
  },
  {
    id: "4",
    clientName: "Ana Ruiz",
    service: "Highlights + Blowout",
    time: "15:00",
    duration: "2h",
    price: 150,
    status: "confirmed",
  },
  {
    id: "5",
    clientName: "Carmen López",
    service: "Eyebrow Lamination",
    time: "17:30",
    duration: "45min",
    price: 35,
    status: "pending",
  },
];

export const allAppointments: Appointment[] = [
  ...todayAppointments,
  {
    id: "6",
    clientName: "Isabel Fernández",
    service: "Full Color",
    time: "10:00",
    duration: "1h 45min",
    price: 120,
    status: "confirmed",
  },
  {
    id: "7",
    clientName: "Patricia Vega",
    service: "Keratin Treatment",
    time: "14:00",
    duration: "2h 30min",
    price: 200,
    status: "pending",
  },
];

export const clients: Client[] = [
  {
    id: "1",
    name: "María García",
    phone: "+34 612 345 678",
    email: "maria.garcia@email.com",
    lastVisit: "May 24, 2026",
    favoriteService: "Balayage",
    pendingBalance: 0,
    totalVisits: 12,
    notes: "Prefers warm tones. Allergic to ammonia-based dyes.",
  },
  {
    id: "2",
    name: "Laura Méndez",
    phone: "+34 623 456 789",
    email: "laura.mendez@email.com",
    lastVisit: "May 20, 2026",
    favoriteService: "Manicure Gel",
    pendingBalance: 45,
    totalVisits: 8,
    notes: "Always books Tuesdays. Likes nude shades.",
  },
  {
    id: "3",
    name: "Sofía Torres",
    phone: "+34 634 567 890",
    email: "sofia.torres@email.com",
    lastVisit: "May 18, 2026",
    favoriteService: "Facial Treatment",
    pendingBalance: 95,
    totalVisits: 5,
    notes: "Sensitive skin. Use hypoallergenic products.",
  },
  {
    id: "4",
    name: "Ana Ruiz",
    phone: "+34 645 678 901",
    email: "ana.ruiz@email.com",
    lastVisit: "May 15, 2026",
    favoriteService: "Highlights",
    pendingBalance: 0,
    totalVisits: 20,
    notes: "VIP client. 10% loyalty discount applies.",
  },
  {
    id: "5",
    name: "Carmen López",
    phone: "+34 656 789 012",
    email: "carmen.lopez@email.com",
    lastVisit: "May 10, 2026",
    favoriteService: "Eyebrow Lamination",
    pendingBalance: 35,
    totalVisits: 3,
    notes: "New client. Referred by Ana Ruiz.",
  },
];

export const services: Service[] = [
  { id: "1", name: "Balayage", duration: "2h 30min", price: 150, category: "Hair Color" },
  { id: "2", name: "Full Color", duration: "1h 45min", price: 120, category: "Hair Color" },
  { id: "3", name: "Highlights", duration: "2h", price: 130, category: "Hair Color" },
  { id: "4", name: "Cut & Style", duration: "45min", price: 45, category: "Hair Cut" },
  { id: "5", name: "Blowout", duration: "30min", price: 25, category: "Hair Styling" },
  { id: "6", name: "Keratin Treatment", duration: "2h 30min", price: 200, category: "Hair Treatment" },
  { id: "7", name: "Manicure Gel", duration: "1h", price: 45, category: "Nails" },
  { id: "8", name: "Pedicure Spa", duration: "1h 15min", price: 55, category: "Nails" },
  { id: "9", name: "Facial Treatment", duration: "1h 15min", price: 95, category: "Skin" },
  { id: "10", name: "Eyebrow Lamination", duration: "45min", price: 35, category: "Brows & Lashes" },
  { id: "11", name: "Lash Extensions", duration: "1h 30min", price: 80, category: "Brows & Lashes" },
  { id: "12", name: "Bridal Package", duration: "4h", price: 350, category: "Special" },
];

export const weekOverview = [
  { day: "Mon", appointments: 5, revenue: 420 },
  { day: "Tue", appointments: 7, revenue: 580 },
  { day: "Wed", appointments: 4, revenue: 340 },
  { day: "Thu", appointments: 6, revenue: 505 },
  { day: "Fri", appointments: 8, revenue: 720 },
  { day: "Sat", appointments: 3, revenue: 250 },
  { day: "Sun", appointments: 0, revenue: 0 },
];
