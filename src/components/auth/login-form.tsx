"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TypographyH2, TypographyMedium } from "@/components/ui/typography";
import { useToast } from "@/components/ui/use-toast";
import { signIn } from "@/lib/firebase-auth";
import { Link } from "@/lib/router-events";
import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { useState } from "react";
import { LuLoader } from "react-icons/lu";

interface FormInterface {
  email: string;
  password: string;
}

export default function LoginForm() {
  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm<FormInterface>();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = handleSubmit((data) => {
    setIsLoading(true);
    signIn(data.email, data.password)
      .then(() => {
        toast({
          title: "You are logged in."
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
    <form onSubmit={onSubmit}>
      <div className="flex flex-col items-start justify-center h-full w-fit border p-8 bg-background rounded-lg gap-2">
        <TypographyH2>Login to dhamma</TypographyH2>
        <Label>Email</Label>
        <Input
          type="email"
          placeholder="Email..."
          {...register("email", { required: true })}
          width={300}
          className="w-[300px]"
        />
        {errors.email && <span className="text-xs text-red-500">Email is required</span>}
        <Label>Password</Label>
        <Input
          type="password"
          placeholder="Password..."
          {...register("password", { required: true })}
          className="w-[300px]"
        />
        {errors.password && <span className="text-xs text-red-500">Passowrd is required</span>}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <LuLoader className="animate-spin mr-2" />}
          Login
        </Button>
        <Link href="/auth/reset-password" className="text-sm text-foreground/60 hover:text-foreground/80">
          Forgot your password?
        </Link>
        <TypographyMedium className="mt-4">
          {"Don't have an account?"}
          <Link href="/auth/register" className="text-foreground/80 hover:text-foreground">
            {" Register"}
          </Link>
        </TypographyMedium>
      </div>
    </form>
  );
}
