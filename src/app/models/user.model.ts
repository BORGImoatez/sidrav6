export interface User {
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  role: UserRole;
  structureId?: number;
  structure?: Structure;
  actif: boolean;
  dateCreation: Date;
  derniereConnexion?: Date;
  motDePasse:string;
}

export interface Structure {
  id: number;
  nom: string;
  type: TypeStructure;
  gouvernoratId: number;
  gouvernorat?: Gouvernorat;
  secteur: string;
  adresse?: string;
  ministereId?: number;
  ministere?: Ministere;
  telephone?: string;
  actif: boolean;
}

export interface Gouvernorat {
  id: number;
  nom: string;
  codeIso3: string;
}

export interface Ministere {
  id: number;
  nom: string;
  code: string;
  actif: boolean;
}

export interface Delegation {
  id: number;
  nom: string;
  gouvernoratId: number;
  gouvernorat?: Gouvernorat;
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN_STRUCTURE = 'ADMIN_STRUCTURE',
  UTILISATEUR = 'UTILISATEUR',
  EXTERNE = 'EXTERNE',
PENDING='PENDING'
}

export enum TypeStructure {
  PUBLIQUE = 'PUBLIQUE',
  PRIVEE = 'PRIVEE',
  ONG = 'ONG'
}

export interface LoginRequest {
  email: string;
  motDePasse: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  requiresOtp?: boolean;
  userId?: number;
  blockedUntil?: Date;
  remainingAttempts?: number;
}

export interface OtpRequest {
  userId: number;
  code: string;
}

export interface OtpResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
  blockedUntil?: Date;
  remainingAttempts?: number;
}

export interface UserStructureInfo {
  userId: number;
  secteur: string;
  typeStructure: TypeStructure;
  ministere: string;
  structureId: number;
  structureNom: string;
  gouvernoratId: number;
  gouvernoratNom: string;
  hasStructure: boolean;
}

export interface OtpCode {
  id: number;
  userId: number;
  code: string;
  dateCreation: Date;
  dateExpiration: Date;
  etat: OtpEtat;
  nombreTentatives: number;
}

export enum OtpEtat {
  VALIDE = 'VALIDE',
  EXPIRE = 'EXPIRE',
  UTILISE = 'UTILISE'
}
