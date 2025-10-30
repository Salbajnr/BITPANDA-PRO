
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDepositManagement() {
  return (
    <div className="p-6">
      <PageHeader
        title="Deposit Management"
        description="Manage user deposits and transaction approvals"
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Deposit Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Deposit management features will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
