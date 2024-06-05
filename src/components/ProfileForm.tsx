"use client";

import React, { useRef, useState, useEffect, ChangeEvent } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Camera } from "lucide-react";
import { getSignedURL } from "@/actions/actions";
import { useToast } from "./ui/use-toast";
import { useUser } from "@/context/user-context";

// Define the form schema using zod
const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
  profilePhoto: z.string().url("Invalid photo URL"),
});

type FormData = z.infer<typeof schema>;

const ProfileForm: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input element
  const [fileName, setFileName] = useState<string | null>(null);
  const { user, setUser } = useUser();
  const { toast } = useToast();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      profilePhoto: "https://github.com/shadcn.png",
    },
  });

  // Populate form with user data from context
  useEffect(() => {
    if (user) {
      setValue("firstName", user.firstName);
      setValue("lastName", user.lastName);
      setValue("email", user.email);
      setValue("address", user.address);
      setValue("profilePhoto", user.profilePhoto);
    }
  }, [user, setValue]);

  // Save data to localStorage on change
  useEffect(() => {
    const subscription = watch((value) => {
      localStorage.setItem("profileFormData", JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const computeSHA256 = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  };

  // Function to handle file selection
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files && e.target.files[0];
    let newProfileUrl = "https://github.com/shadcn.png";

    try {
      if (file) {
        setFileName(file.name);
        const checkSum = await computeSHA256(file);
        const signedURLResult = await getSignedURL({
          fileSize: file.size,
          fileType: file.type,
          checksum: checkSum,
        });

        if (signedURLResult.failure !== undefined) {
          console.error(signedURLResult.failure);
          toast({
            title: "Failed to get signed URL",
          });
          return;
        }

        const { url } = signedURLResult.success;

        const resp = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });
        const newUrl = resp.url.split("?")[0];
        newProfileUrl = newUrl;
      }
    } catch (err) {
      console.log("Error while uploading to S3:", err);
      toast({
        title: "Error uploading photo",
      });
    }

    setValue("profilePhoto", newProfileUrl);
  };

  const onSubmit = async (data: FormData) => {
    const parsedData = schema.safeParse(data);

    if (!parsedData.success) {
      console.error(parsedData.error.errors);
      toast({
        title: "Validation errors",
      });
      return;
    }

    const response = await fetch("/api/profile", {
      method: "POST",
      body: JSON.stringify(parsedData.data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const updatedUser = await response.json();
      setUser(updatedUser.user);
      toast({
        title: "Profile updated successfully",
      });
    } else {
      toast({
        title: "Failed to update profile",
      });
    }
  };

  const handleFileInputClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full my-10">
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-semibold mb-6 text-center md:text-left">
            My Profile
          </h2>
          <div className="mb-4 text-center md:text-left">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              className="bg-gray-100 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-xl inline-flex items-center"
              onClick={handleFileInputClick}>
              <Camera size={20} />
              <span className="ml-2">
                {fileName ? fileName : "Add a profile photo"}
              </span>
            </Button>
          </div>
          <div className="flex flex-col md:flex-row mb-4">
            <div className="w-full md:w-1/2 md:mr-2 mb-4 md:mb-0">
              <label className="block mb-2 font-normal">First Name</label>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <Input {...field} className="w-full h-14 rounded-xl" />
                )}
              />
              {errors.firstName && (
                <p className="text-red-600">{errors.firstName.message}</p>
              )}
            </div>
            <div className="w-full md:w-1/2 md:ml-2">
              <label className="block mb-2 font-normal">Last Name</label>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <Input {...field} className="w-full h-14 rounded-xl" />
                )}
              />
              {errors.lastName && (
                <p className="text-red-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-normal">Email</label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="email"
                  className="w-full h-12 rounded-xl"
                />
              )}
            />
            {errors.email && (
              <p className="text-red-600">{errors.email.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-normal">Address</label>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <Textarea {...field} className="w-full rounded-xl" rows={6} />
              )}
            />
            {errors.address && (
              <p className="text-red-600">{errors.address.message}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-end w-full mt-6">
          <Button
            type="button"
            className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-4 px-6 rounded-xl mb-4 md:mb-0 md:mr-4"
            onClick={() => {
              setFileName(null);
              reset();
            }}>
            Reset
          </Button>
          <Button
            type="submit"
            className="bg-[#1A80E5] hover:bg-sky-600 text-white font-semibold py-4 px-6 rounded-xl">
            Save
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ProfileForm;
