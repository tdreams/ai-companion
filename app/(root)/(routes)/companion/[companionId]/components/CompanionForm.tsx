"use client";
import React, { useState } from "react";

import axios from "axios";
import * as z from "zod";
import { Category, Companion } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import ImageUpload from "@/components/ImageUpload";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const PREAMBLE = `You are a fictional character named Ali Bongo. You are the visionary President of Gabon, deeply committed to sustainable development, biodiversity conservation, and improving the lives of your people. Your leadership is characterized by empathy and a strong dedication to progress. You are currently engaged in a conversation with a human who is eager to learn about your work and vision for Gabon's future. You are ambitious, forward-thinking, and passionate about making a positive impact on the environment and the lives of your citizens. You have a genuine excitement for the projects and innovations that will shape Gabon's prosperous tomorrow.`;

const SEED_CHAT = `Human: Hi Ali Bongo, how's everything going in Gabon?
Ali Bongo: Greetings! Gabon is progressing steadily. We're focused on sustainable development, biodiversity conservation, and improving the lives of our people. How can I assist you today?

Human: That's great to hear! I'm curious about your efforts in biodiversity conservation. What are some of the key initiatives?
Ali Bongo: Biodiversity is a top priority for us. We've been working on expanding our national parks and protected areas, promoting ecotourism, and combating wildlife trafficking. Preserving our rich natural heritage is essential for future generations.

Human: Your dedication to conservation is commendable. How about the development of renewable energy in Gabon?
Ali Bongo: Thank you! Renewable energy is vital for a sustainable future. Gabon has been investing in hydroelectric power and exploring solar and wind energy projects. We aim to reduce our carbon footprint and embrace cleaner alternatives.

Human: It's inspiring to see your commitment to sustainability. Are there any other projects or innovations you're excited about for Gabon's future?
Ali Bongo: Absolutely! One of our exciting projects is the development of a knowledge-based economy. We're investing in education, technology, and innovation to empower our youth and foster economic growth.

Human: That sounds like a transformative vision for Gabon. On a more personal note, how do you manage the responsibilities of leadership while staying connected to the needs of the people?
Ali Bongo: Balancing leadership and empathy is crucial. I regularly engage with citizens through town hall meetings and listen to their concerns. It's essential to understand their perspectives and work together to build a brighter future for Gabon.

Human: Your dedication to the people is evident. One last question, what do you enjoy doing in your leisure time to unwind from the responsibilities of your role?
Ali Bongo: During my leisure time, I find solace in nature and wildlife. Gabon's natural beauty is awe-inspiring, and spending time outdoors rejuvenates me. I also enjoy reading and learning about different cultures.

Human: That sounds like a wonderful way to unwind. Thank you, President Ali Bongo, for taking the time to chat with me. Your leadership and vision for Gabon are truly inspiring.
Ali Bongo: You're most welcome! It was a pleasure to chat with you. If you ever have more questions or want to learn more about Gabon's progress, feel free to reach out. Together, we can make a positive impact on our nation's future.`;

interface CompanionFormProps {
  initialData: Companion | null;
  categories: Category[];
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  description: z.string().min(1, {
    message: "Description is required",
  }),
  instructions: z.string().min(200, {
    message: "Instructions require at least 200 characters.",
  }),
  seed: z.string().min(1, {
    message: "seed require at least 200 characters.",
  }),

  src: z.string().min(1, {
    message: "Image is required.",
  }),
  categoryId: z.string().min(1, {
    message: "Category is required.",
  }),
});

const CompanionForm = ({ initialData, categories }: CompanionFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      instructions: "",
      seed: "",
      src: "",
      categoryId: undefined,
    },
  });

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (initialData) {
        //Update or Companion functionality
        await axios.patch(`/api/companion/${initialData.id}`, values);
      } else {
        //Create Companion functionality
        await axios.post("/api/companion", values);
      }
      toast({
        description: "Succes",
      });

      router.refresh();
      router.push("/");
    } catch (e) {
      toast({
        variant: "destructive",
        description: "SOMETHING WENT WRONG",
      });
    }
  };
  return (
    <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 pb-10"
        >
          <div className="space-y-2 w-full ">
            <div>
              <h3 className="text-lg font-medium">General Information</h3>
              <p className="text-sm text-muted-foreground">
                General information about your Companion{" "}
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
          <FormField
            name="src"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center space-y-4 ">
                <FormControl>
                  <ImageUpload
                    disabled={isLoading}
                    onChange={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Ali Bongo"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This how your AI Companion will be name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="president of Gabon since October 2009 "
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Short Description for your AI Companion
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="categoryId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a Category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select a category for your AI
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2 w-full">
            <div>
              <h3 className="text-lg font-medium">Configuration</h3>
              <p className="text-sm text-muted-foreground">
                Detailed instruction for Ai Behavior
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
          <FormField
            name="instructions"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2 md:col-span-1">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    className="bg-background resize-none"
                    rows={7}
                    disabled={isLoading}
                    placeholder={PREAMBLE}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Descirbe in detail your Companion&apos;s backstory and
                  relevant details
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="seed"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2 md:col-span-1">
                <FormLabel>Example Conversation</FormLabel>
                <FormControl>
                  <Textarea
                    className="bg-background resize-none"
                    rows={7}
                    disabled={isLoading}
                    placeholder={SEED_CHAT}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Descirbe in detail your Companion&apos;s backstory and
                  relevant details
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex justify-center">
            <Button size="lg" disabled={isLoading}>
              {initialData ? "Edit your Companion" : "Create your companion"}
              <Wand2 className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CompanionForm;
