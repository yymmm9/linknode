"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { RiArrowRightSFill, RiArrowDropLeftFill } from "react-icons/ri";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { SiMinutemailer } from "react-icons/si";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/components/ui/input-otp";
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
import { useState, useTransition } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { verifyOtp } from "@/actions/auth";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";

export default function SignUp({ redirectTo }: { redirectTo: string }) {
	const queryString =
		typeof window !== "undefined" ? window.location.search : "";
	const urlParams = new URLSearchParams(queryString);

	const verify = urlParams.get("verify");
	const existEmail = urlParams.get("email");

	const [passwordReveal, setPasswordReveal] = useState(false);
	const [isConfirmed, setIsConfirmed] = useState(verify === "true");
	const [verifyStatus, setVerifyStatus] = useState<string>("");
	const [isPending, startTransition] = useTransition();
	const [isSendAgain, startSendAgain] = useTransition();
	const pathname = usePathname();
	const router = useRouter();
	const t = useTranslations('Auth');
	const locale = useLocale();
	const searchParams = useSearchParams();
	const next = searchParams.get('next');
  
    // Ensure next parameter is properly formatted
    const formattedNext = next?.startsWith('/') ? next : `/${next}`;

	const FormSchema = z
		.object({
			email: z.string().email({ message: t('invalid-email') }),
			password: z.string().min(6, { message: t('password-too-short') }),
			"confirm-pass": z.string().min(6, { message: t('password-too-short') }),
		})
		.refine(
			(data) => data["confirm-pass"] === data.password,
			{ message: t('passwords-dont-match'), path: ["confirm-pass"] }
		);

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			email: "",
			password: "",
			"confirm-pass": "",
		},
	});

	const postEmail = async ({
		email,
		password,
	}: {
		email: string;
		password: string;
	}) => {
		try {
			const requestOptions = {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			};
			
			const res = await fetch("/api/signup", requestOptions);
			if (!res.ok) {
				const errorData = await res.json().catch(() => ({ 
					error: { message: '请求失败', details: `状态码: ${res.status}` }
				}));
				return { error: errorData.error };
			}
			
			const data = await res.json().catch(() => null);
			if (!data) {
				return { error: { message: '解析响应失败', details: '服务器返回了无效的数据' } };
			}
			
			return data;
		} catch (error) {
			console.error('注册请求失败:', error);
			return { 
				error: { 
					message: '请求失败',
					details: error instanceof Error ? error.message : '未知错误'
				}
			};
		}
	};

	const sendVerifyEmail = async (data: z.infer<typeof FormSchema>) => {
		const response = await postEmail({
			email: data.email,
			password: data.password,
		});

		if (response.error) {
			toast.error(response.error.message);
			if (response.error.details) {
				console.error('详细错误:', response.error.details);
			}
			return;
		}

		router.replace(
			(pathname || "/") +
				"?verify=true&email=" +
				form.getValues("email")
		);
		setIsConfirmed(true);
	};

	const inputOptClass = cn({
		" border-green-500": verifyStatus === "success",
		" border-red-500": verifyStatus === "failed",
	});

	function onSubmit(data: z.infer<typeof FormSchema>) {
		if (!isPending) {
			startTransition(async () => {
				await sendVerifyEmail(data);
			});
		}
	}

	return (
		<div
			className={cn(`relative whitespace-nowrap p-5 space-x-5 overflow-hidden flex flex-col items-center align-top w-full sm:mx-auto sm:w-full sm:max-w-sm ${
				isPending ? "animate-pulse" : ""
			}`, 'shadow sm:p-5 border dark:border-zinc-800 rounded-md')}
		>

<div className="text-center space-y-3 w-full whitespace-normal">
							<h1 className="font-bold text-xl">{t('create-account')}</h1>
							<p className="text-sm text-gray-600">{t('welcome-message')}</p>
						</div>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className={cn(
						`space-y-3 inline-block w-full transform transition-all duration-300`,
						{
							"block": !isConfirmed,
							"hidden": isConfirmed,
						}
					)}
				>
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
					<FormField
						control={form.control}
						name="confirm-pass"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t('confirm-password')}</FormLabel>
								<FormControl>
									<div className="relative">
										<Input
											placeholder={t('confirm-password')}
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
						{isPending && <AiOutlineLoading3Quarters className="mr-2 animate-spin" />}
						{t('continue')}
					</Button>
				</form>
			</Form>

			{/* 验证邮箱部分 */}
			<div
				className={cn(
					`space-y-4`,
					{
						"hidden": !isConfirmed,
						"block": isConfirmed,
					}
				)}
			>
				<div className="flex flex-col items-center space-y-4">
					<SiMinutemailer className="h-12 w-12 text-violet-500" />

					<div className="text-center space-y-2">
						<h2 className="text-xl font-semibold">
							{t('verify-email')}
						</h2>
						<p className="text-sm text-gray-600">
							{t('verification-code-sent')}{' '}
							<span className="font-medium">
								{verify === "true" ? existEmail : form.getValues("email")}
							</span>
						</p>
					</div>

					<InputOTP
						pattern={REGEXP_ONLY_DIGITS}
						id="input-otp"
						maxLength={6}
						value=""
						onChange={async (value) => {
							if (value.length === 6) {
								document.getElementById("input-otp")?.blur();
								const res = await verifyOtp({
									email: verify === "true" ? existEmail || "" : form.getValues("email"),
									otp: value,
									type: "email",
								});
								const { error } = JSON.parse(res);
								if (error) {
									toast.error(t('verification-failed'));
									setVerifyStatus("failed");
								} else {
									toast.success(t('verification-success'));
									setVerifyStatus("success");
									router.push(redirectTo);
								}
							}
						}}
					>
						<InputOTPGroup>
							<InputOTPSlot index={0} className={inputOptClass} />
							<InputOTPSlot index={1} className={inputOptClass} />
							<InputOTPSlot index={2} className={inputOptClass} />
						</InputOTPGroup>
						<InputOTPSeparator />
						<InputOTPGroup>
							<InputOTPSlot index={3} className={inputOptClass} />
							<InputOTPSlot index={4} className={inputOptClass} />
							<InputOTPSlot index={5} className={inputOptClass} />
						</InputOTPGroup>
					</InputOTP>

					<div className="text-sm flex items-center gap-2">
						<span>{t('didnt-work')}</span>
						<button
							type="button"
							className="text-violet-600 hover:underline disabled:opacity-50"
							disabled={isSendAgain}
							onClick={async () => {
								if (!isSendAgain) {
									startSendAgain(async () => {
										if (!form.getValues("password")) {
											const json = await postEmail({
												email: form.getValues("email"),
												password: form.getValues("password"),
											});

											if (json.error) {
												toast.error(t('resend-code-failed'));
											} else {
												toast.success(t('resend-code-success'));
											}
										} else {
											router.replace(pathname || "/signup");
											form.setValue("email", existEmail || "");
											form.setValue("password", "");
											setIsConfirmed(false);
										}
									});
								}
							}}
						>
							{isSendAgain ? (
								<AiOutlineLoading3Quarters className="animate-spin" />
							) : (
								t('try-again')
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
