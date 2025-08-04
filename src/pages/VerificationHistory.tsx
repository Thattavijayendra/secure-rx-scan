import React, { useState, useEffect } from 'react';
import { History, Clock, User, CheckCircle, AlertCircle, Eye, Trash2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import PrescriptionCard from '@/components/prescription/PrescriptionCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getVerificationHistory, VerificationHistory } from '@/lib/database';
import { useToast } from '@/hooks/use-toast';

const VerificationHistoryPage: React.FC = () => {
  const [history, setHistory] = useState<VerificationHistory[]>([]);
  const [selectedPrescription, setSelectedPrescription] = useState<VerificationHistory | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const historyData = getVerificationHistory();
    setHistory(historyData);
  };

  const clearHistory = () => {
    localStorage.removeItem('verificationHistory');
    setHistory([]);
    toast({
      title: "History Cleared",
      description: "All verification history has been removed.",
    });
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return {
      date: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const getStatusIcon = (status: 'valid' | 'invalid') => {
    return status === 'valid' 
      ? <CheckCircle className="w-4 h-4 text-accent" />
      : <AlertCircle className="w-4 h-4 text-destructive" />;
  };

  const getStatusBadge = (status: 'valid' | 'invalid') => {
    return (
      <Badge className={status === 'valid' ? 'status-valid' : 'status-invalid'}>
        {getStatusIcon(status)}
        <span className="ml-1">{status === 'valid' ? 'Valid' : 'Invalid'}</span>
      </Badge>
    );
  };

  if (history.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-2xl mb-4">
              <History className="w-8 h-8 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Verification History
            </h1>
            <p className="text-lg text-muted-foreground">
              No verification history found
            </p>
          </div>

          <Card className="glass-card max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Verifications Yet
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start verifying prescriptions to see your history here.
                </p>
              </div>
              <Button onClick={() => window.location.href = '/dashboard'} className="btn-primary">
                Start Verifying
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Verification History
            </h1>
            <p className="text-lg text-muted-foreground">
              View all your prescription verification records
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <div className="text-sm text-muted-foreground">
              {history.length} verification{history.length !== 1 ? 's' : ''}
            </div>
            <Button variant="outline" size="sm" onClick={clearHistory}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear History
            </Button>
          </div>
        </div>

        {/* History Timeline */}
        <div className="space-y-4">
          {history.map((record, index) => {
            const { date, time } = formatDateTime(record.verificationTime);
            
            return (
              <Card key={record.id} className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          record.status === 'valid' ? 'bg-accent/10' : 'bg-destructive/10'
                        }`}>
                          {getStatusIcon(record.status)}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="text-lg font-semibold text-foreground">
                            {record.patientName}
                          </h3>
                          {getStatusBadge(record.status)}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {date} at {time}
                          </div>
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {record.prescriptionData.doctorName}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedPrescription(record)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Prescription Details</DialogTitle>
                          </DialogHeader>
                          {selectedPrescription && (
                            <PrescriptionCard 
                              prescription={selectedPrescription.prescriptionData} 
                              isValid={selectedPrescription.status === 'valid'} 
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Verifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{history.length}</div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Valid Prescriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {history.filter(h => h.status === 'valid').length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Invalid Prescriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {history.filter(h => h.status === 'invalid').length}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default VerificationHistoryPage;