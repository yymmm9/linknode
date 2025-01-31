'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useData } from '@/lib/context/link-context';
import { useTranslations } from 'next-intl';

type InputChangeEvent = React.ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement
>;

export default function ProfileForm() {
  const { data, updateProfileInfo } = useData();
  const t = useTranslations('ProfileForm');

  const handleInputChange = (event: InputChangeEvent) => {
    const { name, value } = event.target;
    updateProfileInfo(name, value);
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">{t('Title')}</CardTitle>
        <CardDescription>{t('Description')}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="grid gap-2 grid-cols-2">
          <div>
            <Label htmlFor="name">{t('Name')}</Label>
            <Input
              id="name"
              name="n"
              type="text"
              placeholder={t('NamePlaceholder')}
              value={data.n}
              onChange={handleInputChange}
              autoComplete="name"
            />
          </div>
          <div>
            <Label htmlFor="lastname">{t('Lastname')}</Label>
            <Input
              id="lastname"
              name="ln"
              type="text"
              placeholder={t('LastnamePlaceholder')}
              value={data.ln}
              onChange={handleInputChange}
              autoComplete="family-name"
            />
          </div>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          <div>
            <Label htmlFor="phone">{t('Phone')}</Label>
            <Input
              id="phone"
              name="p"
              type="text"
              placeholder="+34 ..."
              value={data.p}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="email">{t('Email')}</Label>
            <Input
              id="email"
              name="em"
              type="email"
              placeholder="https://example.com"
              value={data.em}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          <div>
            <Label htmlFor="title">{t('Title')}</Label>
            <Input
              id="title"
              name="ti"
              type="text"
              placeholder={t('TitlePlaceholder')}
              value={data.ti}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="organization">{t('Organization')}</Label>
            <Input
              id="organization"
              name="o"
              type="text"
              placeholder={t('OrganizationPlaceholder')}
              value={data.o}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          <div>
            <Label htmlFor="role">{t('Role')}</Label>
            <Input
              id="role"
              name="r"
              type="text"
              placeholder={t('RolePlaceholder')}
              value={data.r}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="about">{t('About')}</Label>
          <Textarea
            id="about"
            name="d"
            placeholder={t('About')}
            value={data.d}
            onChange={handleInputChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
