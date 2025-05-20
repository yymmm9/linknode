"use client";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import VCard from "vcard-creator";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import type { DataProps } from "@/types";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export const SaveVcf = ({
  acc,
  variant = "default",
  cta,
  autoDownload = false,
}: {
  acc?: Partial<DataProps>;
  variant?: "icon" | "default";
  cta?: string;
  autoDownload?: boolean;
}) => {
  const searchParams = useSearchParams();
  const t = useTranslations("ProfileForm");

  // 将所有逻辑放在 if 条件之前
  const createVCard = (accData: Partial<DataProps>) => {
    const firstName = accData.n || accData.firstName || '';
    const lastName = accData.ln || accData.lastName || '';
    const organization = accData.o || accData.organization || '';
    const title = accData.ti || accData.title || '';
    const role = accData.r || accData.role || '';
    const email = accData.e || accData.email || '';
    const workPhone = accData.p || accData.workPhone || '';
    const website = accData.web || accData.website || '';
    const description = accData.d || '';
    const address = accData.addr || '';
    
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
    if (!acc) return;
    
    const firstName = acc.n || acc.firstName || '';
    const lastName = acc.ln || acc.lastName || '';
    const vCardString = createVCard(acc);
    const blob = new Blob([vCardString], { type: "text/vcard" });
    const link = document.createElement("a");
    
    link.href = URL.createObjectURL(blob);
    link.download = `${firstName}_${lastName}.vcf`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 检查URL参数是否有自动下载标志 - 确保 Hook 不在条件语句之后
  useEffect(() => {
    if (!acc) return;
    
    const autoAdd = searchParams?.get('a');
    if (autoAdd === 'true' || autoDownload) {
      // 延迟一点执行，确保组件已完全加载
      const timer = setTimeout(() => {
        downloadVCard();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchParams, acc, autoDownload]);
  
  if (!acc) return null;
  
  const buttonStyles = cn(
    variant === "default" ? "gap-2" : "absolute bottom-0 right-0 z-10 size-8 p-1 rounded-full h-fit"
  );

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