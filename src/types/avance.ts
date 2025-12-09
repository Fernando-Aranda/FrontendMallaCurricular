export interface Avance {
  nrc: string;
  period: string;      
  student: string;     
  course: string;      
  excluded: boolean;
  inscriptionType: string;
  status: 'APROBADO' | 'REPROBADO' | string; 
}