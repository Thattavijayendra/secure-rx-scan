import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PrescriptionData } from '@/lib/encryption';

export const verifyPrescription = async (prescriptionData: PrescriptionData): Promise<boolean> => {
  try {
    // Check if prescription exists in Firestore
    const prescriptionsRef = collection(db, 'prescriptions');
    
    // Query by prescription ID
    const prescriptionDoc = await getDoc(doc(prescriptionsRef, prescriptionData.prescriptionId));
    
    if (prescriptionDoc.exists()) {
      const dbData = prescriptionDoc.data();
      
      // Verify key fields match
      const isValid = 
        dbData.patientEmail === prescriptionData.patientEmail &&
        dbData.doctorEmail === prescriptionData.doctorEmail &&
        dbData.issuedDate === prescriptionData.issuedDate;
      
      return isValid;
    }
    
    // Alternative: Query by patient email and doctor email
    const q = query(
      prescriptionsRef,
      where('patientEmail', '==', prescriptionData.patientEmail),
      where('doctorEmail', '==', prescriptionData.doctorEmail)
    );
    
    const querySnapshot = await getDocs(q);
    
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error verifying prescription:', error);
    return false;
  }
};

export interface VerificationHistory {
  id: string;
  patientName: string;
  verificationTime: string;
  status: 'valid' | 'invalid';
  prescriptionData: PrescriptionData;
}

export const saveVerificationHistory = (prescriptionData: PrescriptionData, status: 'valid' | 'invalid') => {
  const history: VerificationHistory = {
    id: Date.now().toString(),
    patientName: prescriptionData.patientName,
    verificationTime: new Date().toISOString(),
    status,
    prescriptionData
  };
  
  const existingHistory = getVerificationHistory();
  const updatedHistory = [history, ...existingHistory].slice(0, 100); // Keep last 100 records
  
  localStorage.setItem('verificationHistory', JSON.stringify(updatedHistory));
};

export const getVerificationHistory = (): VerificationHistory[] => {
  const history = localStorage.getItem('verificationHistory');
  return history ? JSON.parse(history) : [];
};