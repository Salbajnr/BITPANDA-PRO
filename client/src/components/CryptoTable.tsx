import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CryptoData } from "@/hooks/useCryptoData";
import { Star, TrendingUp, TrendingDown } from "lucide-react";

interface CryptoTableProps {
  marketData: CryptoData[];
}

export default function CryptoTable({ marketData }: CryptoTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]"></TableHead>
          <TableHead>Asset</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>24h Change</TableHead>
          <TableHead>Market Cap</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {marketData.map((crypto) => (
          <TableRow key={crypto.id}>
            <TableCell>
              <Button variant="ghost" size="icon">
                <Star className="h-4 w-4" />
              </Button>
            </TableCell>
            <TableCell className="font-medium flex items-center">
              <img src={crypto.image} alt={crypto.name} className="h-6 w-6 mr-3"/>
              {crypto.name} <span className="text-muted-foreground ml-2">{crypto.symbol.toUpperCase()}</span>
            </TableCell>
            <TableCell>${crypto.current_price.toLocaleString()}</TableCell>
            <TableCell className={crypto.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"}>
              <div className="flex items-center">
                {crypto.price_change_percentage_24h >= 0 ? <TrendingUp className="h-4 w-4 mr-1"/> : <TrendingDown className="h-4 w-4 mr-1"/>}
                {crypto.price_change_percentage_24h.toFixed(2)}%
              </div>
            </TableCell>
            <TableCell>${crypto.market_cap.toLocaleString()}</TableCell>
            <TableCell className="text-right">
              <Button>Trade</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}