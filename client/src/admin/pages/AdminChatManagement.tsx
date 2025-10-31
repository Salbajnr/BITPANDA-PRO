
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminChatManagement() {
  return (
    <div className="p-6">
      <PageHeader
        title="Chat Management"
        description="Manage user chats and support conversations"
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Chat Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Chat management features will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
