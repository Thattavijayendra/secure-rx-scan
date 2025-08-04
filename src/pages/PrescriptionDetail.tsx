import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, ShieldCheck } from 'lucide-react';

const PrescriptionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [prescription, setPrescription] = useState<any>(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const docRef = doc(db, 'prescriptions', id || '');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPrescription(docSnap.data());
        } else {
          setPrescription(null);
        }
      } catch (error) {
        console.error('Error fetching prescription:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescription();
  }, [id]);

  const handleVerify = async () => {
    if (!id) return;
    setVerifying(true);
    try {
      const docRef = doc(db, 'prescriptions', id);
      await updateDoc(docRef, { isVerified: true });
      setPrescription((prev: any) => ({ ...prev, isVerified: true }));
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="text-center text-red-600 mt-12">
        Prescription not found or invalid QR.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <Card className="shadow-lg">
        <CardContent className="space-y-4 py-6">
          <h2 className="text-xl font-bold text-center">Prescription Details</h2>

          <div><strong>Patient Name:</strong> {prescription.patientName}</div>
          <div><strong>Patient Age:</strong> {prescription.patientAge}</div>
          <div><strong>Diagnosis:</strong> {prescription.diagnosis}</div>

          <div>
            <strong>Medicines:</strong>
            <ul className="list-disc list-inside ml-4">
              {prescription.medicines?.map((med: any, index: number) => (
                <li key={index}>
                  {med.name} - {med.dosage} ({med.frequency})
                </li>
              ))}
            </ul>
          </div>

          <div><strong>Prescribed By:</strong> Dr. {prescription.doctorName}</div>
          <div><strong>Issued At:</strong> {new Date(prescription.createdAt?.seconds * 1000).toLocaleString()}</div>

          {/* ✅ Verification Status */}
          <div className="flex items-center gap-2">
            <strong>Status:</strong>
            {prescription.isVerified ? (
              <span className="text-green-600 font-semibold flex items-center gap-1">
                <ShieldCheck size={18} /> Verified
              </span>
            ) : (
              <span className="text-yellow-600 font-semibold">Not Verified</span>
            )}
          </div>

          {/* ✅ Verify Button */}
          {!prescription.isVerified && (
            <Button
              onClick={handleVerify}
              disabled={verifying}
              className="mt-4 w-full"
            >
              {verifying ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin w-4 h-4" /> Verifying...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle size={18} /> Verify Prescription
                </span>
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PrescriptionDetail;
