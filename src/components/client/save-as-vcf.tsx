'use client';
import { PlusIcon } from 'lucide-react';
import { Button } from '../ui/button';
// import VCard from "vcard-creator";
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';

export const generateVCardString = (data: any): string => {
  const socialUrls = [
    data.twitter && `X-SOCIALPROFILE;TYPE=twitter:${data.twitter}`,
    data.linkedin && `X-SOCIALPROFILE;TYPE=linkedin:${data.linkedin}`,
  ].filter(Boolean);

  return `BEGIN:VCARD
  VERSION:3.0
  N:${data?.n}
  ORG:${data?.org}
  TITLE:${data?.title}
  TEL:${data?.tel}
  URL:${data?.url}
  EMAIL:${data?.email}
  ADR:${data?.adr}
  NOTE:${data?.note}
  ${socialUrls.join('\n')}
  END:VCARD`;
};

export const SaveVcf = ({
  data,
  // info,
  variant = 'default',
  cta,
}: {
  data: any;
  // info: any;
  variant?: 'icon' | 'default';
  cta?: string;
}) => {
  const vcardString = generateVCardString(data);

  console.log('vcf', { data });
  if (!data) return;
  const buttonStyles = cva(
    'flex items-center', // common styles
    {
      variants: {
        variant: {
          default: ' gap-2',
          icon: 'absolute bottom-0 right-0 z-10 size-8 p-1 rounded-full h-auto',
        },
      },
      defaultVariants: {
        variant: 'default',
      },
    },
  );

  // const myVCard = new VCard();

  // myVCard
  //   .addName(data.lastName, data.firstName)
  //   // // .addName(data.lastName, data.firstName, additional, prefix, suffix)
  //   // // Add work data
  //   .addCompany(data.organization)
  //   .addJobtitle(data.title)
  //   .addRole(data.role)
  //   .addEmail(info.email)
  //   .addPhoneNumber(info.workPhone, "PREF;WORK")
  //   // .addPhoneNumber(123456789, 'WORK')
  //   // .addAddress(null, null, 'street', 'worktown', null, 'workpostcode', 'Belgium')
  //   // .addSocial('https://twitter.com/desloovere_j', 'Twitter', 'desloovere_j')
  //   .addURL(info.website);

  //get as formatted string
  // const vCardString = myVCard.toString();

  return (
    <Button
      className={cn(buttonStyles({ variant }))}
      variant={variant == 'default' ? 'secondary' : 'default'}
      onClick={() =>
        window.open(
          `data:text/vcard;charset=utf-8,${encodeURIComponent(vcardString)}`,
          '_blank',
        )
      }
    >
      {variant == 'icon' || !cta ? <PlusIcon className="size-6" /> : null}
      {variant == 'default' && cta ? (
        <>
          <PlusIcon className="size-4" /> {cta}
        </>
      ) : null}
    </Button>
  );
};
