"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { LuLoader, LuPlusCircle } from "react-icons/lu";
import { cn, convertBase64 } from "@/lib/utils";
import { set, useForm } from "react-hook-form";
import Image from "next/image";
import { Button, ButtonProps, buttonVariants } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import axios from "@/lib/axios";
import { useState } from "react";
import { useToast } from "../ui/use-toast";

import { Category } from "@/interfaces/stock";

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";

interface FormInterface {
  name: string;
  description: string;
  price: number;
  thumbnail: FileList;
  stock: number;
  category: Category;
}

export const AddStockButton = ({
  loadStocks = async () => {},
  buttonProps = {}
}: {
  loadStocks?: () => Promise<void>;
  buttonProps?: ButtonProps;
}) => {
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm<FormInterface>();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);

  const onSubmit = async (data: FormInterface) => {

    setIsLoading(true);
    setIsSubmit(true);
    if (!selectedCategory) {
      setIsLoading(false);
      return;
    }

    const thumbnailBase64 = data.thumbnail[0] ? await convertBase64(data.thumbnail[0]) : "";
    
    axios
      .post("/stocks/create", {
        name: data.name,
        description: data.description,
        price: data.price,
        thumbnail: thumbnailBase64,
        stock: data.stock,
        category: selectedCategory
      })
      .then(() => {
        loadStocks().then(() => {
          setIsLoading(false);
          reset();
          toast({
            title: "Stock added successfully."
          });
          setIsOpen(false);
        });
      })
      .catch((err) => {
        setIsLoading(false);
        toast({
          title: "An error occurred.",
          description: err.message
        });
      });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(e) => {
        if (!e) {
          reset();
          setIsOpen(false);
        } else {
          setIsOpen(true);
        }
      }}
    >
      <DialogTrigger
        {...buttonProps}
        className={cn(buttonVariants(), "flex items-center gap-2 bg-primary-yellow text-black", buttonProps.className)}
      >
        <LuPlusCircle className="w-4 h-4" /> Add Stock
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Stock</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 max-h-[500px] overflow-y-scroll">
          <div>
            <Label>Name</Label>
            <Input placeholder="Product name" {...register("name", { required: true })} />
            {errors.name && <p className="text-xs text-red-500 dark:text-red-400">Name is required</p>}
          </div>
          <div>
            <Label>Description</Label>
            <Textarea placeholder="Product description" {...register("description", { required: true })} />
            {errors.description && <p className="text-xs text-red-500 dark:text-red-400">Description is required</p>}
          </div>
          <div>
            <Label>Category</Label>
            <Select onValueChange={(value) => setSelectedCategory(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category"/>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.values(Category).map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {(isSubmit && !selectedCategory) && <p className="text-xs text-red-500 dark:text-red-400">Category is required</p>}
          </div>
          <div>
            <Label>Price (Bath)</Label>
            <Input type="number" placeholder="0" {...register("price", { required: true, min: 0 })} />
            {errors.price && <p className="text-xs text-red-500 dark:text-red-400">Price is required</p>}
          </div>
          <div>
            <Label>Stock (remains)</Label>
            <Input type="number" placeholder="0" {...register("stock", { required: true, min: 0 })} />
            {errors.stock && <p className="text-xs text-red-500 dark:text-red-400">Stock is required</p>}
          </div>
          <div>
            <Label>Upload thumbnail</Label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 max-h-[250px]">
                {watch("thumbnail")?.[0] ? (
                  <Image
                    src={URL.createObjectURL(watch("thumbnail")[0])}
                    alt="thumbnail image"
                    layout="cover"
                    width={0}
                    height={0}
                    className="w-full h-full p-2 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SVG, PNG, JPG or GIF (MAX. 1024 x 1024 px)
                    </p>
                  </div>
                )}
                <Input
                  id="dropzone-file"
                  type="file"
                  multiple={false}
                  className="hidden"
                  {...register("thumbnail", {
                    required: true,
                    validate: (files) => {
                      const file = files?.[0];
                      if (!file) return "No file selected";
                      if (!file.type.startsWith("image/")) return "Invalid file type";
                      if (file.size > 2048 * 2048 * 2) return "File too large";
                      return true;
                    }
                  })}
                />
              </label>
            </div>
            {errors.thumbnail && <p className="text-xs text-red-500 dark:text-red-400">Thumbnail is required</p>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <LuLoader className="animate-spin mr-2 h-4 w-4" />}
              Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
