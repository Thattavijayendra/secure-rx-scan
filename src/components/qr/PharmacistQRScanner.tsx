// // src/pages/PharmacistQRScanner.tsx

// import React from 'react';
// import { Html5Qrcode } from 'html5-qrcode';
// import QRUpload from './QRUpload';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '@/lib/firebase'; // Make sure this is correctly imported
// import { useNavigate } from 'react-router-dom';

// const PharmacistQRScanner: React.FC = () => {
//   const navigate = useNavigate();

//   const handleQRFileUpload = async (file: File) => {
//     const qrCodeScanner = new Html5Qrcode('temp-file-scan');

//     try {
//       const decodedText = await qrCodeScanner.scanFile(file, true);
//       console.log('QR Code Scanned:', decodedText);

//       // 🔍 Lookup prescription by ID from Firestore
//       const docRef = doc(db, 'prescriptions', decodedText);
//       const docSnap = await getDoc(docRef);

//       if (docSnap.exists()) {
//         // ✅ Navigate to details page with prescription ID
//         navigate(`/prescription/${decodedText}`);
//       } else {
//         alert('❌ Prescription not found in database.');
//       }

//     } catch (error) {
//       console.error('Failed to decode QR code:', error);
//       alert('⚠️ Invalid or unreadable QR code');
//     } finally {
//       qrCodeScanner.clear();
//     }
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">Scan Prescription QR</h2>
//       <QRUpload onFileUpload={handleQRFileUpload} />
//       <div id="temp-file-scan" style={{ display: 'none' }}></div>
//     </div>
//   );
// };

// export default PharmacistQRScanner;


import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import QRUpload from '@/components/qr/QRUpload';

const PharmacistQRScanner: React.FC = () => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [scannedData, setScannedData] = useState<string | null>(null);

  // ✅ Handle file upload scanning
  const handleQRFileUpload = async (file: File) => {
    const qrCodeScanner = new Html5Qrcode('temp-file-scan');
    try {
      const decodedText = await qrCodeScanner.scanFile(file, true);
      console.log('QR Code Scanned from File:', decodedText);
      setScannedData(decodedText);
      window.location.href = `/prescription/${decodedText}`;
    } catch (error) {
      alert('Invalid or unreadable QR code');
    } finally {
      qrCodeScanner.clear();
    }
  };

  // ✅ Start live scanning on mount
  useEffect(() => {
    const startLiveScan = async () => {
      const scanner = new Html5Qrcode("live-scanner");
      scannerRef.current = scanner;

      try {
        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 }
          },
          (decodedText) => {
            console.log("QR Code Scanned from Camera:", decodedText);
            scanner.stop(); // Stop scanning once scanned
            setScannedData(decodedText);
            window.location.href = `/prescription/${decodedText}`;
          },
          (errorMessage) => {
            // console.warn(errorMessage);
          }
        );
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    startLiveScan();

    return () => {
      scannerRef.current?.stop().then(() => {
        scannerRef.current?.clear();
      });
    };
  }, []);

  return (
    <div className="p-4 space-y-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-center">Scan Prescription QR</h2>

      {/* 🔴 Live Camera Scanner */}
      <div id="live-scanner" className="border rounded-md overflow-hidden shadow-md" />

      <p className="text-center text-gray-600">OR Upload QR Image</p>

      {/* 🟡 Upload File Option */}
      <QRUpload onFileUpload={handleQRFileUpload} />

      <div id="temp-file-scan" style={{ display: 'none' }}></div>
    </div>
  );
};

export default PharmacistQRScanner;
