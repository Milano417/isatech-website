export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'STAFF' | 'STUDENT' | 'GUEST';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  matricule?: string;
  formationCode?: string;
  avatar?: string;
}

export type FormationCategory = 
  | 'Informatique & Technologies'
  | 'Finance & Gestion'
  | 'Commerce & Management'
  | 'Communication & Design'
  | 'Tourisme & Hôtellerie'
  | 'Ressources Humaines & Communication'
  | 'Administration & Management'
  | 'Réseaux & Télécommunications';

export interface Formation {
  id: string;
  code: string;
  name: string;
  slug: string;
  category: FormationCategory;
  shortDescription: string;
  description: string;
  level: string; // e.g. "BAC+2 (BTS) / Licence Professionnelle"
  duration: string; // e.g. "2 ans"
  location: string; // "Abidjan, Koumassi"
  image: string;
  objectives: string[];
  skills: string[];
  program: {
    semester: string;
    modules: string[];
  }[];
  opportunities: string[];
  admissionRequirements: string[];
  status: 'PUBLISHED' | 'DRAFT';
}

export type ApplicationStatus = 
  | 'RECUE'
  | 'EN_COURS'
  | 'COMPLEMENT_REQUIS'
  | 'ACCEPTEE'
  | 'REFUSEE';

export interface ApplicationDocument {
  id: string;
  type: string;
  name: string;
  size: string;
  uploadDate: string;
  status: 'VERIFIE' | 'EN_ATTENTE' | 'REJETE';
}

export interface Application {
  id: string;
  applicationNumber: string; // format ISA-2026-XXXXXX
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: 'M' | 'F';
  address: string;
  city: string;
  country: string;
  lastDiploma: string;
  graduationYear: string;
  previousSchool: string;
  formationCode: string;
  status: ApplicationStatus;
  statusNotes?: string;
  documents: ApplicationDocument[];
  submittedAt: string;
  updatedAt: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: 'Actualités' | 'Communiqués' | 'Événements' | 'Formation' | 'Vie étudiante' | 'Technologie';
  author: string;
  authorRole: string;
  publishedAt: string;
  readTime: string;
  status: 'PUBLISHED' | 'DRAFT';
  tags: string[];
}

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  category: string;
  status: 'A_VENIR' | 'EN_COURS' | 'TERMINE';
  capacity?: number;
  registeredCount: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'NOUVEAU' | 'EN_COURS' | 'TRAITE';
  createdAt: string;
  replyNote?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  biography: string;
  image: string;
  status: 'ACTIF' | 'INACTIF';
  level?: 'FONDATEUR' | 'DIRECTION' | 'PEDAGOGIE' | 'SECRETARIAT' | 'PROFESSEURS';
  reportsTo?: string;
}

export interface StudentCourseGrade {
  code: string;
  courseName: string;
  credits: number;
  grade: number; // /20
  coefficient: number;
  status: 'VALIDE' | 'EN_COURS' | 'RATTRAPAGE';
}

export interface StudentScheduleItem {
  id: string;
  day: 'Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi' | 'Samedi';
  time: string;
  subject: string;
  teacher: string;
  room: string;
  type: 'CM' | 'TD' | 'TP';
}
