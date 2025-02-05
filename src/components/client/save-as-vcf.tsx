"use client";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import VCard from "vcard-creator";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import type { DataProps } from "@/types";

export const SaveVcf = ({
  acc,
  variant = "default",
  cta,
}: {
  acc?: Partial<DataProps>;
  variant?: "icon" | "default";
  cta?: string;
}) => {
  const t = useTranslations("ProfileForm");

  if (!acc) return null;

  const firstName = acc.n || acc.firstName || '';
  const lastName = acc.ln || acc.lastName || '';
  const organization = acc.o || acc.organization || '';
  const title = acc.ti || acc.title || '';
  const role = acc.r || acc.role || '';
  const email = acc.e || acc.email || '';
  const workPhone = acc.p || acc.workPhone || '';
  const website = acc.web || acc.website || '';
  const description = acc.d || '';
  const address = acc.addr || '';

  const buttonStyles = cn(
    variant === "default" ? "gap-2" : "absolute bottom-0 right-0 z-10 size-8 p-1 rounded-full h-fit"
  );

  const createVCard = () => {
    const myVCard = new VCard();

    myVCard
      .addName(lastName, firstName)
      .addCompany(organization)
      .addJobtitle(title)
      .addRole(role)
      .addEmail(email)
      .addPhoneNumber(workPhone, "PREF;WORK")
      .addURL(website)
      .addNote(description)
      .addAddress(address);

    return myVCard.toString();
  };

  const downloadVCard = () => {
    const vCardString = createVCard();
    const blob = new Blob([vCardString], { type: "text/vcard" });
    const link = document.createElement("a");
    
    link.href = URL.createObjectURL(blob);
    link.download = `${firstName}_${lastName}.vcf`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      variant={variant === "default" ? "secondary" : "default"}
      onClick={downloadVCard}
      className={buttonStyles}
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