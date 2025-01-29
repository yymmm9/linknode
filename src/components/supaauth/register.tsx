"use client";
import React from "react";
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from "next/navigation";
import SignUp from "./signup";
import Social from "./social";
import Link from "next/link";

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
			<div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center justify-center">
				{/* <Logo className="text-violet-500 h-5 mb-3" /> */}


				<div className="w-full sm:w-[26rem] shadow sm:p-5 border dark:border-zinc-800 rounded-md">
					<div className="p-5 space-y-5">
						<div className="text-center space-y-3">
							<h1 className="font-bold text-xl">{t('create-account')}</h1>
							<p className="text-sm text-gray-600">{t('welcome-message')}</p>
						</div>
						<SignUp redirectTo={redirectPath} />

						<div className="flex items-center gap-5 my-4">
							<div className="flex-1 h-[0.5px] w-full bg-zinc-400 dark:bg-zinc-800"></div>
							<div className="text-sm text-gray-500">{t('or')}</div>
							<div className="flex-1 h-[0.5px] w-full bg-zinc-400 dark:bg-zinc-800"></div>
						</div>

						<Social redirectTo={redirectPath} />

						<div className="text-center text-sm mt-4">
							<p className="text-gray-600">
								{t('already-have-account')}{' '}
								<Link 
									href={`/${locale}/signin`} 
									className="text-violet-600 hover:underline"
								>
									{t('sign-in')}
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
