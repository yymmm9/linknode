"use client";
import { PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import VCard from "vcard-creator";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

export const SaveVcf = ({
  data,
  info,
  variant = "default",
  cta,
}: {
  data: {
    firstName: string;
    lastName: string;
    organization: string;
    title: string;
    role: string;
  };
  info: {
    email: string;
    workPhone: string;
    website: string;
  };
  variant?: "icon" | "default";
  cta?: string;
}) => {
  if (!data) return null;

  const buttonStyles = cva(
    "flex items-center", 
    {
      variants: {
        variant: {
          default: "gap-2",
          icon: "absolute bottom-0 right-0 z-10 size-8 p-1 rounded-full",
        },
      },
      defaultVariants: {
        variant: "default",
      },
    }
  );

  const createVCard = () => {
    const myVCard = new VCard();
    myVCard
      .addName(data.lastName, data.firstName)
      .addCompany(data.organization)
      .addJobtitle(data.title)
      .addRole(data.role)
      .addEmail(info.email)
      .addPhoneNumber(info.workPhone, "PREF;WORK")
      .addURL(info.website);

    return myVCard.toString();
  };

  const downloadVCard = () => {
    const vCardString = createVCard();
    const blob = new Blob([vCardString], { type: "text/vcard" });
    const link = document.createElement("a");
    
    link.href = URL.createObjectURL(blob);
    link.download = `${data.firstName}_${data.lastName}.vcf`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      className={cn(buttonStyles({ variant }))}
      variant={variant === "default" ? "secondary" : "default"}
      onClick={downloadVCard}
    >
      {variant === "icon" || !cta ? <PlusIcon className="size-6" /> : null}
      {variant === "default" && cta ? (
        <>
          <PlusIcon className="size-4" /> {cta}
        </>
      ) : null}
    </Button>
  );
};