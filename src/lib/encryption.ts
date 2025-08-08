// import CryptoJS from 'crypto-js';

// const SECRET_KEY = 'samraksha-2025-secure-key-prescription-system';

// export const decryptData = (encryptedData: string): any => {
//   try {
//     const decrypted = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
//     const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
//     return JSON.parse(jsonString);
//   } catch (error) {
//     throw new Error('Invalid or corrupted data');
//   }
// };

// export interface PrescriptionData {
//   prescriptionId: string;
//   patientName: string;
//   patientAge: number;
//   patientEmail: string;
//   diagnosis: string;
//   doctorEmail: string;
//   doctorName: string;
//   issuedDate: string;
//   medications: Array<{
//     name: string;
//     dosage: string;
//     frequency: string;
//     duration: string;
//   }>;
//   validUntil: string;
// }




import CryptoJS from 'crypto-js';

const SECRET_KEY = 'samraksha-2025-secure-key-prescription-system';

export const decryptData = (encryptedData: string): { prescriptionId: string } => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
    const parsed = JSON.parse(jsonString);

    // Safety check (optional)
    if (!parsed.prescriptionId) {
      throw new Error('Missing prescription ID in decrypted data');
    }

    return parsed;
  } catch (error) {
    throw new Error('Invalid or corrupted QR code data');
  }
};
