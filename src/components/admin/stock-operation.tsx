"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { LuLoader, LuMoreVertical } from "react-icons/lu";
import axios from "@/lib/axios";
import { Stock } from "@/interfaces/stock";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import { Button } from "../ui/button";
import { convertBase64 } from "@/lib/utils";

import { Category } from "@/interfaces/stock";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface StockOperationsProps {
  stock: Stock;
  loadStocks?: () => Promise<void>;
}

interface FormInterface {
  name: string;
  description: string;
  price: number;
  thumbnail: FileList;
  stock: number;
  category: string;
}

export function StockOperation({ stock, loadStocks = async () => {} }: StockOperationsProps) {
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("");

  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm<FormInterface>({
    defaultValues: {
      name: stock.name,
      description: stock.description,
      price: stock.price,
      stock: stock.stock,
      category: stock.category
    }
  });

  const handleEdit = async (data: FormInterface) => {
    setIsEditing(true);
    const thumbnailBase64 = data.thumbnail[0] ? await convertBase64(data.thumbnail[0]) : "";
    axios
      .post(`/stocks/${stock.id}/update`, {
        name: data.name,
        description: data.description,
        price: data.price,
        thumbnail: thumbnailBase64,
        stock: data.stock,
        category: selectedCategory
      })
      .then(() => {
        loadStocks().then(() => {
          setIsEditing(false);
          setShowEditPopup(false);
          window.location.reload();
        });
      })
      .catch((err) => {
        setIsEditing(false);
        console.error(err);
      });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    axios
      .post(`/stocks/${stock.id}/delete`)
      .then(() => {
        loadStocks().then(() => {
          setIsDeleting(false);
          setShowDeletePopup(false);
          window.location.reload();
        });
      })
      .catch((err) => {
        setIsDeleting(false);
        console.error(err);
      });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted">
        <LuMoreVertical className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setShowEditPopup(true)}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setShowDeletePopup(true)} className="text-red-400">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
      <Dialog
        open={showEditPopup}
        onOpenChange={(e) => {
          if (!e) {
            reset();
            setShowEditPopup(false);
          } else {
            setShowEditPopup(true);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Stock</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleEdit)} className="space-y-3 max-h-[500px] overflow-y-scroll">
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
              <Select onValueChange={(value) => setSelectedCategory(value)} defaultValue={stock.category}>
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
              {(isEditing && !selectedCategory) && <p className="text-xs text-red-500 dark:text-red-400">Category is required</p>}
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
                  {Boolean(watch("thumbnail")?.[0]) && (
                    <Image
                      src={URL.createObjectURL(watch("thumbnail")[0])}
                      alt="thumbnail image"
                      layout="cover"
                      width={0}
                      height={0}
                      className="w-full h-full p-2 rounded-xl object-cover"
                    />
                  )}
                  {!Boolean(watch("thumbnail")?.[0]) && !stock.thumbnail && (
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
                  {!Boolean(watch("thumbnail")?.[0]) && stock.thumbnail && (
                    <Image
                      src={stock.thumbnail}
                      alt="thumbnail old image"
                      layout="cover"
                      width={500}
                      height={500}
                      className="w-full h-full p-2 rounded-xl object-cover"
                    />
                  )}
                  <Input
                    id="dropzone-file"
                    type="file"
                    multiple={false}
                    className="hidden"
                    {...register("thumbnail", {
                      required: false,
                      validate: (files) => {
                        const file = files?.[0];
                        if (!file) return true;
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
              <Button type="submit" disabled={isEditing}>
                {isEditing && <LuLoader className="animate-spin mr-2 h-4 w-4" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog open={showDeletePopup}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this stock?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove your stock from the
              system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeletePopup(false)} disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting && <LuLoader className="animate-spin mr-2 w-4 h-4" />}
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DropdownMenu>
  );
}
