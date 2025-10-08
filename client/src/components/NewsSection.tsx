import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rss, ExternalLink } from "lucide-react";

// Mock news data
const newsItems = [
  { id: 1, title: "Bitcoin Surges Past $70,000, Setting New All-Time High", source: "Crypto News Today", time: "2h ago" },
  { id: 2, title: "Ethereum's Dencun Upgrade Goes Live, Promising Lower Gas Fees", source: "ETH World", time: "5h ago" },
  { id: 3, title: "SEC Delays Decision on Spot Ethereum ETFs, Citing Market Concerns", source: "The Financial Times", time: "8h ago" },
  { id: 4, title: "Global Regulators to Form Task Force on Cryptocurrency Risks", source: "Reuters", time: "1d ago" },
];

export default function NewsSection() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Latest News</CardTitle>
        <Rss className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {newsItems.map((item) => (
            <li key={item.id} className="flex items-start justify-between">
              <div>
                <p className="font-semibold hover:text-primary transition-colors cursor-pointer">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.source} - {item.time}</p>
              </div>
              <Button variant="ghost" size="icon" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
