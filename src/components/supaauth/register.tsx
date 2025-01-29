"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from "next/navigation";
import { Logo } from "../brand";
import SignUp from "./signup";
import Social from "./social";

export default function Register() {
	const locale = useLocale();
	const t = useTranslations('Auth');
	const searchParams = useSearchParams();
	const email = searchParams.get('email') || '';
	const queryString =
		typeof window !== "undefined" ? window?.location.search : "";
	const urlParams = new URLSearchParams(queryString);

	// Get the value of the 'next' parameter
	const next = urlParams.get("next");
	const verify = urlParams.get("verify");

	// Add locale to the redirect path
	const redirectPath = next ? `/${locale}${next}` : `/${locale}`;

	return (
		<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col itens-center justify-center">
				{/* <Logo className="text-violet-500 h-5 mx-auto mb-3" /> */}
				<div className="w-full sm:w-[26rem] shadow sm:p-5  border dark:border-zinc-800 rounded-md">
					<div className="p-5 space-y-5">
						<div className="text-center space-y-3">
							<h1 className="font-bold">{t('create-account')}</h1>
							<p className="text-sm">
								{t('welcome-message')}
							</p>
						</div>
						<SignUp redirectTo={redirectPath} />
						<Social redirectTo={redirectPath} />
						<div className="text-center text-sm">
							<p>{t('or')}</p>
							<div className="mt-2 space-x-2">
								{/* 其他注册方式 */}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
