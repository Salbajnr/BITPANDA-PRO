
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminBalanceManagement() {
  return (
    <div className="p-6">
      <PageHeader
        title="Balance Management"
        description="Manage user balances and account adjustments"
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Balance Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Balance management features will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
