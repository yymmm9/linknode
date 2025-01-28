"use client";
import React, { useState, useTransition } from "react";
import Social from "./social";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Logo } from "../brand";

// 使用国际化验证消息
const FormSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

export default function SignIn() {
	const t = useTranslations('Auth');
	const locale = useLocale();
	const searchParams = useSearchParams();
	
	// 防御性编程：安全获取查询参数
	const next = searchParams.get('next') ?? '';
	const queryString = typeof window !== "undefined" ? window.location.search : "";
	const urlParams = new URLSearchParams(queryString);

	// 安全处理重定向路径
	const formattedNext = next.startsWith('/') 
		? `/${locale}${next}` 
		: `/${locale}/${next || ''}`.replace(/\/+/g, '/');

	const [passwordReveal, setPasswordReveal] = useState(false);
	const [isPending, setIsPending] = useState(false);
	const router = useRouter();

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	// 安全的登录处理函数
	const onSubmit = async (data: z.infer<typeof FormSchema>) => {
		setIsPending(true);
		try {
			const supabase = createSupabaseBrowser();
			const { error } = await supabase.auth.signInWithPassword({
				email: data.email,
				password: data.password,
			});

			if (error) {
				toast.error(error.message);
				return;
			}

			toast.success(t('welcome-back'));
			router.push(formattedNext || `/${locale}`);
		} catch (error) {
			console.error('登录失败:', error);
			toast.error(t('sign-in-failed'));
		} finally {
			setIsPending(false);
		}
	};

	return (
		<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-sm">
				<Logo className="text-violet-500 h-5 mx-auto mb-3" />
				<div className="w-full sm:w-[26rem] shadow sm:p-5 border dark:border-zinc-800 rounded-md">
					<div className="p-5 space-y-5">
						<div className="text-center space-y-3">
							<h1 className="font-bold text-xl">{t('sign-in')}</h1>
							<p className="text-sm text-gray-600">{t('welcome-back')}</p>
						</div>

						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t('email')}</FormLabel>
											<FormControl>
												<Input 
													placeholder={t('email')} 
													type="email" 
													{...field} 
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t('password')}</FormLabel>
											<FormControl>
												<div className="relative">
													<Input 
														placeholder={t('password')} 
														type={passwordReveal ? "text" : "password"} 
														{...field} 
													/>
													<button
														type="button"
														className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
														onClick={() => setPasswordReveal(!passwordReveal)}
													>
														{passwordReveal ? <FaRegEye /> : <FaRegEyeSlash />}
													</button>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Button 
									type="submit" 
									className="w-full" 
									disabled={isPending}
								>
									{isPending ? (
										<AiOutlineLoading3Quarters className="mr-2 animate-spin" />
									) : null}
									{t('continue')}
								</Button>
							</form>
						</Form>

						<div className="flex items-center gap-5 my-4">
							<div className="flex-1 h-[0.5px] w-full bg-zinc-400 dark:bg-zinc-800"></div>
							<div className="text-sm text-gray-500">{t('or')}</div>
							<div className="flex-1 h-[0.5px] w-full bg-zinc-400 dark:bg-zinc-800"></div>
						</div>

						<Social redirectTo={formattedNext} />

						<div className="text-center text-sm mt-4">
							<p className="text-gray-600">
								{t('dont-have-account')}{' '}
								<Link 
									href={`/${locale}/register`} 
									className="text-violet-600 hover:underline"
								>
									{t('sign-up')}
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
