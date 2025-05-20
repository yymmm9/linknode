'use client';

import React, { useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useTranslations } from 'next-intl';
import { useData } from '@/lib/context/link-context';

type InputChangeEvent = React.ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement
>;

export default function ProfileForm() {
  const { data, updateProfileInfo } = useData();
  const t = useTranslations('ProfileForm');
  const handleInputChange = (event: InputChangeEvent) => {
    const { name, value } = event.target;
    updateProfileInfo(name, value);
  }
  
  const handleSwitchChange = (checked: boolean) => {
    updateProfileInfo('autoAddContact', checked);
  }


  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">{t('Title')}</CardTitle>
        <CardDescription>{t('Description')}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="grid gap-2 grid-cols-2">
          <div>
            <Label htmlFor="firstName">{t('FirstName')}</Label>
            <Input
              id="firstName"
              name="n"
              placeholder={t('FirstNamePlaceholder')}
              value={data.n}
              onChange={handleInputChange}
              autoComplete="given-name"
            />
          </div>
          <div>
            <Label htmlFor="lastName">{t('LastName')}</Label>
            <Input
              id="lastName"
              name="ln"
              placeholder={t('LastNamePlaceholder')}
              value={data.ln}
              onChange={handleInputChange}
              autoComplete="family-name"
            />
          </div>
        
          <div>
            <Label htmlFor="phone">{t('Phone')}</Label>
            <Input
              id="phone"
              name="p"
              type="tel"
              placeholder="+34 ..."
              value={data.p}
              onChange={handleInputChange}
              autoComplete="tel"
            />
          </div>
        
        
          <div>
            <Label htmlFor="title">{t('formTitle')}</Label>
            <Input
              id="title"
              name="ti"
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
          <div>
            <Label htmlFor="address">{t('Address')}</Label>
            <Input
              id="address"
              name="addr"
              type="text"
              placeholder={t('AddressPlaceholder')}
              value={data.addr}
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
        <div className="flex items-center space-x-2 pt-2">
          <Switch 
            id="auto-add-contact"
            checked={data.autoAddContact || false}
            onCheckedChange={handleSwitchChange}
          />
          <Label htmlFor="auto-add-contact">{t('AutoAddContact') || '自动添加为联系人'}</Label>
        </div>
      </CardContent>
    </Card>
  );
}
