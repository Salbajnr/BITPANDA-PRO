import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { FileText, Download, ExternalLink } from 'lucide-react';

const UserAgreement = () => {
  const pdfUrl = '/attached_assets/user-agreement-bitpanda-bitpanda-gmbh-en-1.0.0_1755504802677.pdf';

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'BITPANDA-User-Agreement.pdf';
    link.click();
  };

  const handleOpenInNewTab = () => {
    window.open(pdfUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            User Agreement
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Official BITPANDA GmbH User Agreement Document
          </p>
          <p className="text-sm text-gray-500 mt-4">Version 1.0.0 - Legal Document</p>
        </div>

        {/* PDF Viewer Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-blue-500" />
              BITPANDA User Agreement Document
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center">
                <Button 
                  onClick={handleOpenInNewTab}
                  className="flex items-center gap-2"
                  variant="default"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Document
                </Button>
                <Button 
                  onClick={handleDownload}
                  className="flex items-center gap-2"
                  variant="outline"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </div>

              {/* PDF Embed */}
              <div className="w-full">
                <div className="border rounded-lg overflow-hidden bg-white dark:bg-slate-800">
                  <iframe
                    src={pdfUrl}
                    className="w-full h-[800px]"
                    title="BITPANDA User Agreement"
                    style={{ border: 'none' }}
                  />
                </div>
              </div>

              {/* Fallback message */}
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                <p>
                  If the document doesn't display properly, please{' '}
                  <button 
                    onClick={handleDownload}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    download the PDF
                  </button>{' '}
                  or{' '}
                  <button 
                    onClick={handleOpenInNewTab}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    open it in a new tab
                  </button>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notice */}
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                  Important Legal Document
                </h3>
                <p className="text-amber-700 dark:text-amber-300 text-sm">
                  This document contains the complete terms and conditions for using BITPANDA services. 
                  Please read it carefully and contact our legal team if you have any questions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Questions About This Agreement?</h2>
            <p className="mb-6">
              If you have any questions about this User Agreement, please contact our legal team.
            </p>
            <div className="space-y-2">
              <p><strong>Email:</strong> legal@bitpanda-pro.com</p>
              <p><strong>Address:</strong> BITPANDA GmbH, Wiedner Hauptstraße 94, 1050 Vienna, Austria</p>
              <p><strong>Phone:</strong> +43 1 234 5678</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserAgreement;