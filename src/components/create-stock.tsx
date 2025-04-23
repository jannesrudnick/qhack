import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useSupabaseBrowser } from "@/lib/supabase/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { FormMessage } from "./ui/form"

const schema = z.object({
  sku: z.string().min(1),
  fulfilmentCenterId: z.string(),
  stockLocationId: z.string(),
  quantity: z.number().min(1),

})

export const CreateStock = () => {

  const supabase = useSupabaseBrowser();
  const { data: articleData } = useQuery(supabase.from('article').select('id, name'));
  const { data: stockLocationData } = useQuery(supabase.from('stock_location').select('*').order('shelf', { ascending: true }).order('floor', { ascending: true }).order('shelf_slot', { ascending: true }));
  const { formState, register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fulfilmentCenterId: 'FC001',
    }
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    console.log(data);
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Enter new Stock</SheetTitle>
          <SheetDescription>
            Enter a new Stock.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 m-4">
            <div className="grid gap-2">
              <Label htmlFor="sku">SKU</Label>
              <Select {...register('sku')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an article" />
                </SelectTrigger>
                <SelectContent>
                  {articleData?.map((article) => (
                    <SelectItem key={article.id} value={article.id}>
                      {article.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-destructive text-sm">{formState.errors.sku?.message}</div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input 
                type="number" 
                id="quantity" 
                {...register('quantity', { valueAsNumber: true })} 

              />
              <div className="text-destructive text-sm">{formState.errors.quantity?.message}</div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stockLocationId">Stock location</Label>
              <Select {...register('stockLocationId')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a stock location" />
                </SelectTrigger>
                <SelectContent>
                  {stockLocationData?.map((stockLocation) => (
                    <SelectItem key={stockLocation.id} value={stockLocation.id}>
                      {stockLocation.shelf}/{stockLocation.floor}/{stockLocation.shelf_slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-destructive text-sm">{formState.errors.stockLocationId?.message}</div>
            </div>

            <Button type="submit">Create</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
