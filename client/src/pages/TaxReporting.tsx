import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { 
  FileText, 
  Download, 
  Calculator,
  TrendingUp,
  TrendingDown,
  Calendar as CalendarIcon,
  Receipt,
  DollarSign,
  AlertTriangle
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "wouter";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

interface TaxReport {
  id: string;
  year: number;
  totalGains: number;
  totalLosses: number;
  netGains: number;
  transactionCount: number;
  reportUrl: string;
  generatedAt: Date;
}

export default function TaxReporting() {
  const { user } = useAuth();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isGenerating, setIsGenerating] = useState(false);

  if (!user) {
    return <Redirect to="/auth" />;
  }

  const { data: taxReports = [] } = useQuery({
    queryKey: ['/api/tax/reports', user.id],
    queryFn: async () => {
      const response = await fetch('/api/tax/reports', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch tax reports');
      return response.json();
    }
  });

  const { data: taxSummary } = useQuery({
    queryKey: ['/api/tax/summary', selectedYear],
    queryFn: async () => {
      const response = await fetch(`/api/tax/summary?year=${selectedYear}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch tax summary');
      return response.json();
    }
  });

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/tax/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ year: selectedYear })
      });
      
      if (!response.ok) throw new Error('Failed to generate report');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tax-report-${selectedYear}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const years = Array.from({length: 5}, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          
          <main className="flex-1 overflow-y-auto p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Tax Reporting
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Generate comprehensive tax reports for your crypto transactions
              </p>
            </div>

            {/* Year Selection */}
            <div className="mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Select Tax Year
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={generateReport} disabled={isGenerating}>
                      {isGenerating ? (
                        <>
                          <Calculator className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Generate Report
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tax Summary */}
            {taxSummary && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Total Gains</p>
                        <p className="text-2xl font-bold text-green-600">
                          ${taxSummary.totalGains?.toLocaleString() || '0'}
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Total Losses</p>
                        <p className="text-2xl font-bold text-red-600">
                          ${taxSummary.totalLosses?.toLocaleString() || '0'}
                        </p>
                      </div>
                      <TrendingDown className="h-8 w-8 text-red-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Net Result</p>
                        <p className={`text-2xl font-bold ${(taxSummary.netGains || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${taxSummary.netGains?.toLocaleString() || '0'}
                        </p>
                      </div>
                      <DollarSign className="h-8 w-8 text-slate-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Transactions</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          {taxSummary.transactionCount || 0}
                        </p>
                      </div>
                      <Receipt className="h-8 w-8 text-slate-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Previous Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Previous Tax Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                {taxReports.length > 0 ? (
                  <div className="space-y-4">
                    {taxReports.map((report: TaxReport) => (
                      <div key={report.id} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <div className="flex items-center gap-4">
                          <FileText className="h-8 w-8 text-slate-500" />
                          <div>
                            <h3 className="font-semibold">Tax Report {report.year}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Generated on {new Date(report.generatedAt).toLocaleDateString()}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">
                                {report.transactionCount} transactions
                              </Badge>
                              <Badge variant={report.netGains >= 0 ? "default" : "destructive"}>
                                Net: ${report.netGains.toLocaleString()}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No tax reports generated yet</p>
                    <p className="text-sm text-slate-400 mt-2">
                      Generate your first report using the controls above
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tax Notice */}
            <Card className="mt-6 bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                      Important Tax Notice
                    </h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      This report is for informational purposes only and should not be considered professional tax advice. 
                      Always consult with a qualified tax professional for your specific situation. Cryptocurrency tax 
                      laws vary by jurisdiction and are subject to change.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}