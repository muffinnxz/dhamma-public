"use client";;
import LoginForm from "@/components/auth/login-form";
import HomeLayout from "@/components/layouts/home-layout";

export default function Page() {
  return (
    <HomeLayout>
      <div 
        id="section-1" 
        className="flex w-full h-[calc(100vh-80px)] items-center justify-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/images/thai_temple_bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex flex-col w-full justify-center items-center gap-4">
          <LoginForm />
        </div>
      </div>
    </HomeLayout>
  );
}
