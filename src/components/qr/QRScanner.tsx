import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { Camera, Square, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface QRScannerProps {
  onScanSuccess: (data: string) => void;
  isActive: boolean;
  onToggle: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess, isActive, onToggle }) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    if (isActive && elementRef.current) {
      setIsInitializing(true);
      
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
      };

      scannerRef.current = new Html5QrcodeScanner(
        "qr-scanner-container",
        config,
        false
      );

      const onScanSuccessCallback = (decodedText: string) => {
        onScanSuccess(decodedText);
        if (scannerRef.current) {
          scannerRef.current.clear();
          scannerRef.current = null;
        }
        onToggle();
        setIsInitializing(false);
      };

      const onScanFailure = (error: string) => {
        // Handle scan failure silently
        console.log("Scan failed:", error);
      };

      scannerRef.current.render(onScanSuccessCallback, onScanFailure);
      
      setTimeout(() => {
        setIsInitializing(false);
      }, 2000);
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
      setIsInitializing(false);
    };
  }, [isActive, onScanSuccess, onToggle]);

  if (!isActive) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/10 text-accent rounded-xl mb-3">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Scan QR Code</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Use your device's camera to scan prescription QR codes
            </p>
            
            <Button onClick={onToggle} className="btn-success">
              <Camera className="w-4 h-4 mr-2" />
              Start Camera
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/10 text-accent rounded-xl mb-3">
            <Camera className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Scanning QR Code</h3>
          <p className="text-sm text-muted-foreground">
            Position the QR code within the scanner frame
          </p>
        </div>

        <div className="relative">
          {isInitializing && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Initializing camera...</p>
              </div>
            </div>
          )}
          
          <div 
            id="qr-scanner-container" 
            ref={elementRef}
            className="scan-overlay rounded-xl overflow-hidden"
            style={{ minHeight: '300px' }}
          />
        </div>

        <div className="flex justify-center mt-4">
          <Button variant="outline" onClick={onToggle}>
            <Square className="w-4 h-4 mr-2" />
            Stop Scanning
          </Button>
        </div>

        <div className="mt-4 text-xs text-muted-foreground text-center">
          Make sure the QR code is well-lit and clearly visible
        </div>
      </CardContent>
    </Card>
  );
};

export default QRScanner;