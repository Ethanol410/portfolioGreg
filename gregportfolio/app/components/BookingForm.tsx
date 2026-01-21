"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";

const schema = z.object({
  name: z.string().min(2, { message: "Name is too short" }),
  email: z.string().email({ message: "Invalid email address" }),
  type: z.string().min(1, { message: "Please select a shoot type" }),
});

export default function BookingForm() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: any) => {
    console.log(data); // Ici tu brancheras ton envoi d'email plus tard
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="w-full max-w-md bg-white/5 p-8 border border-white/10 backdrop-blur-sm">
      <h3 className="text-2xl font-display uppercase mb-6 text-white">Quick Booking</h3>
      
      {submitted ? (
        <div className="text-green-500 text-center py-10 font-bold uppercase">Message Sent!</div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input {...register("name")} placeholder="YOUR NAME" className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-red-600 transition-colors" />
            {errors.name && <span className="text-red-500 text-xs mt-1 block">{String(errors.name.message)}</span>}
          </div>
          
          <div>
            <input {...register("email")} placeholder="YOUR EMAIL" className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-red-600 transition-colors" />
            {errors.email && <span className="text-red-500 text-xs mt-1 block">{String(errors.email.message)}</span>}
          </div>

          <div>
            <select {...register("type")} className="w-full bg-transparent border-b border-white/20 py-3 text-white/50 focus:outline-none focus:border-red-600 transition-colors [&>option]:text-black">
              <option value="">SELECT SHOOT TYPE</option>
              <option value="automotive">Automotive</option>
              <option value="portrait">Editorial Portrait</option>
              <option value="brand">Brand Content</option>
            </select>
            {errors.type && <span className="text-red-500 text-xs mt-1 block">{String(errors.type.message)}</span>}
          </div>

          <button type="submit" className="w-full bg-white text-black font-bold uppercase py-4 mt-4 hover:bg-red-600 hover:text-white transition-all duration-300 tracking-widest">
            Send Request
          </button>
        </form>
      )}
    </div>
  );
}