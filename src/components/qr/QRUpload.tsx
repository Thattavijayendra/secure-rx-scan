import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image, FileImage } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface QRUploadProps {
  onFileUpload: (file: File) => void;
}

const QRUpload: React.FC<QRUploadProps> = ({ onFileUpload }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <Card className="glass-card">
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-xl mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Upload QR Code</h3>
          <p className="text-sm text-muted-foreground">
            Drag and drop a QR code image or click to browse
          </p>
        </div>

        <div
          {...getRootProps()}
          className={`
            relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-300
            ${isDragActive 
              ? 'border-primary bg-primary/5 scale-105' 
              : 'border-border hover:border-primary/50 hover:bg-muted/50'
            }
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <div className={`
              inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 transition-all duration-300
              ${isDragActive ? 'bg-primary text-primary-foreground animate-pulse-glow' : 'bg-muted text-muted-foreground'}
            `}>
              {isDragActive ? (
                <Upload className="w-8 h-8" />
              ) : (
                <FileImage className="w-8 h-8" />
              )}
            </div>
            
            <div className="text-center">
              <p className="text-lg font-medium text-foreground mb-2">
                {isDragActive ? 'Drop your QR code here' : 'Choose QR code image'}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Supports PNG, JPG, JPEG, GIF, BMP, WebP (Max 10MB)
              </p>
              
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium">
                <Image className="w-4 h-4 mr-2" />
                Browse Files
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-muted-foreground text-center">
          Ensure the QR code is clear and well-lit for accurate scanning
        </div>
      </CardContent>
    </Card>
  );
};

export default QRUpload;