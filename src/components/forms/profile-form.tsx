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

type InputChangeEvent = React.ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement
>;

export default function ProfileForm() {
  const { data, updateProfileInfo } = useData();

  const handleInputChange = (event: InputChangeEvent) => {
    const { name, value } = event.target;
    updateProfileInfo(name, value);
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Profile Information</CardTitle>
        <CardDescription>
          Enter your profile or title information here.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="grid gap-2 grid-cols-2">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="n"
              type="text"
              placeholder="John"
              value={data.n}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="lastname">Lastname</Label>
            <Input
              id="lastname"
              name="ln"
              type="text"
              placeholder="Doe"
              value={data.ln}
              onChange={handleInputChange}
            />
          </div>
          {/* <div>
            <Label htmlFor="Profile-url">Profile Url</Label>
            <Input
              id="Profile-url"
              name="i"
              type="url"
              placeholder="https://example.com"
              value={data.i}
              onChange={handleInputChange}
            />
          </div> */}
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          <div>
            <Label htmlFor="phone">Phone</Label>
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
            <Label htmlFor="email">Email</Label>
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
        <div>
          <Label htmlFor="description">About yourself</Label>
          <Textarea
            id="description"
            name="d"
            placeholder="type something here..."
            value={data.d}
            onChange={handleInputChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
