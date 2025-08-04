import React, { useState } from 'react';
import { Shield, Upload, Camera, AlertTriangle } from 'lucide-react';
import Header from '@/components/layout/Header';
import QRUpload from '@/components/qr/QRUpload';
import QRScanner from '@/components/qr/QRScanner';
import PrescriptionCard from '@/components/prescription/PrescriptionCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { decryptData, PrescriptionData } from '@/lib/encryption';
import { verifyPrescription, saveVerificationHistory } from '@/lib/database';

const Dashboard: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState<PrescriptionData | null>(null);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const processQRData = async (qrData: string) => {
    setIsProcessing(true);
    
    try {
      // Decrypt the QR code data
      const decryptedData = decryptData(qrData);
      setPrescriptionData(decryptedData);

      // Verify against database
      const isValidPrescription = await verifyPrescription(decryptedData);
      setIsValid(isValidPrescription);

      // Save to verification history
      saveVerificationHistory(decryptedData, isValidPrescription ? 'valid' : 'invalid');

      toast({
        title: isValidPrescription ? "Prescription Verified" : "Verification Failed",
        description: isValidPrescription 
          ? "The prescription has been successfully verified."
          : "The prescription could not be verified in our database.",
        variant: isValidPrescription ? "default" : "destructive",
      });

    } catch (error) {
      console.error('Error processing QR code:', error);
      toast({
        title: "Processing Error",
        description: "Failed to decrypt or process the QR code data.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    // For demonstration, we'll simulate QR code reading from file
    // In a real implementation, you'd use a library like jsQR to read from the image
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // This is a simplified example - you'd need proper QR code detection here
      // For now, we'll use a sample encrypted string for demonstration
      const sampleQRData = "U2FsdGVkX1+example_encrypted_data_here";
      processQRData(sampleQRData);
    };
    reader.readAsDataURL(file);
    
    toast({
      title: "Processing Image",
      description: "Analyzing the uploaded QR code...",
    });
  };

  const handleScanSuccess = (data: string) => {
    processQRData(data);
  };

  const resetResults = () => {
    setPrescriptionData(null);
    setIsValid(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Prescription Verification Dashboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Securely verify prescription authenticity using encrypted QR codes
          </p>
        </div>

        {/* Results Section */}
        {prescriptionData && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Verification Results</h2>
              <Button variant="outline" onClick={resetResults}>
                Clear Results
              </Button>
            </div>
            <PrescriptionCard prescription={prescriptionData} isValid={isValid} />
          </div>
        )}

        {/* Main Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* QR Upload */}
          <div>
            <QRUpload onFileUpload={handleFileUpload} />
          </div>

          {/* QR Scanner */}
          <div>
            <QRScanner
              onScanSuccess={handleScanSuccess}
              isActive={isScanning}
              onToggle={() => setIsScanning(!isScanning)}
            />
          </div>
        </div>

        {/* Processing Indicator */}
        {isProcessing && (
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-3 animate-pulse">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Processing Prescription</h3>
                <p className="text-sm text-muted-foreground">
                  Decrypting data and verifying against secure database...
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-warning" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  How to Use This System
                </h3>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>
                    <strong>1. Upload QR Code:</strong> Drag and drop or select a QR code image from your device.
                  </p>
                  <p>
                    <strong>2. Scan QR Code:</strong> Use your device's camera to scan QR codes directly.
                  </p>
                  <p>
                    <strong>3. Verification:</strong> The system will decrypt the QR code and verify it against our secure database.
                  </p>
                  <p>
                    <strong>4. Results:</strong> View detailed prescription information and validation status.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;