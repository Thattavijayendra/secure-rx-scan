import React from 'react';
import { Calendar, User, Mail, Stethoscope, AlertCircle, CheckCircle, Clock, Pill } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PrescriptionData } from '@/lib/encryption';

interface PrescriptionCardProps {
  prescription: PrescriptionData;
  isValid: boolean;
}

const PrescriptionCard: React.FC<PrescriptionCardProps> = ({ prescription, isValid }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="prescription-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Prescription Details</CardTitle>
          <Badge 
            className={`px-3 py-1 font-semibold ${isValid ? 'status-valid' : 'status-invalid'}`}
          >
            {isValid ? (
              <>
                <CheckCircle className="w-4 h-4 mr-1" />
                Valid
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 mr-1" />
                Invalid
              </>
            )}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Patient Information */}
        <div className="bg-muted/30 rounded-lg p-4">
          <h3 className="font-semibold text-foreground mb-3 flex items-center">
            <User className="w-4 h-4 mr-2 text-primary" />
            Patient Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Name:</span>
              <span className="ml-2 font-medium">{prescription.patientName}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Age:</span>
              <span className="ml-2 font-medium">{prescription.patientAge} years</span>
            </div>
            <div className="md:col-span-2">
              <span className="text-muted-foreground">Email:</span>
              <span className="ml-2 font-medium">{prescription.patientEmail}</span>
            </div>
          </div>
        </div>

        {/* Doctor Information */}
        <div className="bg-muted/30 rounded-lg p-4">
          <h3 className="font-semibold text-foreground mb-3 flex items-center">
            <Stethoscope className="w-4 h-4 mr-2 text-primary" />
            Prescribing Doctor
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Dr. Name:</span>
              <span className="ml-2 font-medium">{prescription.doctorName}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Email:</span>
              <span className="ml-2 font-medium">{prescription.doctorEmail}</span>
            </div>
          </div>
        </div>

        {/* Prescription Details */}
        <div className="bg-muted/30 rounded-lg p-4">
          <h3 className="font-semibold text-foreground mb-3 flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-primary" />
            Prescription Details
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-muted-foreground">Prescription ID:</span>
              <span className="ml-2 font-mono text-xs bg-muted px-2 py-1 rounded">
                {prescription.prescriptionId}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Diagnosis:</span>
              <span className="ml-2 font-medium">{prescription.diagnosis}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <span className="text-muted-foreground">Issued Date:</span>
                <span className="ml-2 font-medium">{formatDate(prescription.issuedDate)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Valid Until:</span>
                <span className="ml-2 font-medium">{formatDate(prescription.validUntil)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Medications */}
        {prescription.medications && prescription.medications.length > 0 && (
          <div className="bg-muted/30 rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-3 flex items-center">
              <Pill className="w-4 h-4 mr-2 text-primary" />
              Prescribed Medications
            </h3>
            <div className="space-y-3">
              {prescription.medications.map((medication, index) => (
                <div key={index} className="bg-card border border-border rounded-lg p-3">
                  <div className="font-medium text-foreground mb-2">{medication.name}</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Dosage:</span> {medication.dosage}
                    </div>
                    <div>
                      <span className="font-medium">Frequency:</span> {medication.frequency}
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span> {medication.duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Verification Status */}
        <div className={`rounded-lg p-4 border ${isValid ? 'bg-accent/10 border-accent/20' : 'bg-destructive/10 border-destructive/20'}`}>
          <div className="flex items-center">
            {isValid ? (
              <CheckCircle className="w-5 h-5 text-accent mr-3" />
            ) : (
              <AlertCircle className="w-5 h-5 text-destructive mr-3" />
            )}
            <div>
              <div className={`font-semibold ${isValid ? 'text-accent' : 'text-destructive'}`}>
                {isValid ? 'Prescription Verified' : 'Verification Failed'}
              </div>
              <div className="text-sm text-muted-foreground">
                {isValid 
                  ? 'This prescription has been verified against our secure database.' 
                  : 'This prescription could not be verified. Please check with the issuing doctor.'
                }
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrescriptionCard;