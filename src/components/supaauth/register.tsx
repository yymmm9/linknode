"use client";
import React from "react";
import SignUp from "./signup";
import Social from "./social";
import Image from "next/image";
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from "next/navigation";
import { Logo } from "../brand";

export default function Register() {
	const locale = useLocale();
	const t = useTranslations('Auth');
	const queryString =
		typeof window !== "undefined" ? window?.location.search : "";
	const urlParams = new URLSearchParams(queryString);

	// Get the value of the 'next' parameter
	const next = urlParams.get("next");
	const verify = urlParams.get("verify");

	// Add locale to the redirect path
	const redirectPath = next ? `/${locale}${next}` : `/${locale}`;

	return (
		<div className="w-full sm:w-[26rem] shadow sm:p-5  border dark:border-zinc-800 rounded-md">
			<div className="p-5 space-y-5">
				<div className="text-center space-y-3">
				<Logo className="text-violet-500 h-5 mx-auto mb-3" />

					<h1 className="font-bold">{t('create-account')}</h1>
					<p className="text-sm">
						{t('welcome-message')}
					</p>
				</div>
				<Social redirectTo={redirectPath} />
				<div className="flex items-center gap-5">
					<div className="flex-1 h-[0.5px] w-full bg-zinc-400 dark:bg-zinc-800"></div>
					<div className="text-sm">{t('or')}</div>
					<div className="flex-1 h-[0.5px] w-full bg-zinc-400 dark:bg-zinc-800"></div>
				</div>
			</div>
			<SignUp redirectTo={redirectPath} />
		</div>
	);
}
