"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TypographyH2, TypographyMedium } from "@/components/ui/typography";
import { useToast } from "@/components/ui/use-toast";
import { resetPassword } from "@/lib/firebase-auth";
import { Link } from "@/lib/router-events";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LuChevronLeft, LuLoader } from "react-icons/lu";

interface FormInterface {
  email: string;
}

export default function ResetPasswordForm() {
  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm<FormInterface>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const onSubmit = handleSubmit((data) => {
    setIsLoading(true);
    resetPassword(data.email)
      .then(() => {
        toast({
          title: "An email has been sent.",
          description: `Please check your email. (${data.email})`
        });
        setIsLoading(false);
      })
      .catch((error) => {
        toast({
          title: "An error occurred.",
          description: error.message
        });
        setIsLoading(false);
      });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex flex-col items-start justify-center h-full w-fit border p-8 bg-background rounded-lg gap-2">
        <TypographyH2>Reset Password</TypographyH2>
        <Input
          type="email"
          placeholder="Email..."
          {...register("email", { required: true })}
          width={300}
          className="w-[300px]"
        />
        {errors.email && <span className="text-xs text-red-500">Email is required</span>}
        <Button type="submit" disabled={isLoading} className="items-center gap-2 w-full">
          {isLoading && <LuLoader className="animate-spin" />}
          Send email
        </Button>
        <Link href="/auth">
          <div className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground/80">
            <LuChevronLeft />
            <span>Back to login</span>
          </div>
        </Link>
      </div>
    </form>
  );
}
