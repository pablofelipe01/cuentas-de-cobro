// types/types.ts

export interface CollectionItem {
  description: string;
  value: number;
}

export interface SignatureFormData {
  concept: string;
  value: number;
  phone: string;
  idNumber: string;
  accountNumber: string;
  bank: string;
  accountType: 'savings' | 'checking';
  city: string;
  department: string;
  firstName: string;
  lastName: string;
  collectionItems: CollectionItem[];
  attachedFile?: File;
  signature: string;
}