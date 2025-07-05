"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner"

import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/constants";
import { Transaction } from "@/types";

const formSchema = z.object({
  description: z.string().min(1, "Description is required").max(100),
  amount: z.coerce.number().positive("Amount must be a positive number"),
  date: z.date(),
  category: z.string().min(1, "Category is required"),
});

interface TransactionFormProps {
  initialData?: Transaction | null;
  onFinish: () => void;
}

export default function TransactionForm({ initialData, onFinish }: TransactionFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState<Date>(
    initialData ? new Date(initialData.date) : new Date()
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || "",
      amount: initialData?.amount || 0,
      date: initialData ? new Date(initialData.date) : new Date(),
      category: initialData?.category || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const url = initialData
        ? `/api/transactions/${initialData._id}`
        : "/api/transactions";
      const method = initialData ? "PUT" : "POST";

      // Fix timezone issue by using local date formatting
      const localDate = new Date(values.date.getTime() - values.date.getTimezoneOffset() * 60000);
      const formattedDate = localDate.toISOString().split('T')[0];

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          date: formattedDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Something went wrong.");
      }

      toast.success("Success!", {
        description: `Transaction successfully ${initialData ? 'updated' : 'created'}.`,
        richColors: true,
      });

      router.refresh();
      onFinish();

    } catch (error) {
      toast.error("Uh oh! Something went wrong.", {
        description: "There was a problem with your request.",
        richColors: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate years for dropdown (current year ± 10 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  // Generate months
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleMonthChange = (monthIndex: string) => {
    const newDate = new Date(calendarMonth);
    newDate.setMonth(parseInt(monthIndex));
    setCalendarMonth(newDate);
  };

  const handleYearChange = (year: string) => {
    const newDate = new Date(calendarMonth);
    newDate.setFullYear(parseInt(year));
    setCalendarMonth(newDate);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Groceries" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="space-y-3 p-3">
                      {/* Month and Year Dropdowns */}
                      <div className="flex justify-center space-x-2">
                        <Select
                          value={calendarMonth.getMonth().toString()}
                          onValueChange={handleMonthChange}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map((month, index) => (
                              <SelectItem key={month} value={index.toString()}>
                                {month}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Select
                          value={calendarMonth.getFullYear().toString()}
                          onValueChange={handleYearChange}
                        >
                          <SelectTrigger className="w-[80px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="h-40">
                            {years.map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Calendar */}
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          if (date) {
                            // Ensure we're working with local time to avoid timezone issues
                            const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                            field.onChange(localDate);
                          }
                        }}
                        month={calendarMonth}
                        onMonthChange={setCalendarMonth}
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(23, 59, 59, 999); // End of today
                          return date > today || date < new Date("1900-01-01");
                        }}
                        initialFocus
                        className="rounded-md border-0"
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Saving..." : "Save Transaction"}
        </Button>
      </form>
    </Form>
  );
}