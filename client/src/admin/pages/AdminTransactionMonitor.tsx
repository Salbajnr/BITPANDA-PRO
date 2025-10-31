
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminTransactionMonitor() {
  return (
    <div className="p-6">
      <PageHeader
        title="Transaction Monitor"
        description="Monitor and analyze all platform transactions"
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Transaction Monitor</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Transaction monitoring features will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
