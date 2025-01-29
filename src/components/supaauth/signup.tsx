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
			className={`relative whitespace-nowrap p-5 space-x-5 overflow-hidden flex flex-col items-center align-top ${
				isPending ? "animate-pulse" : ""
			}`}
		>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className={cn(
						`space-y-3 inline-block w-full transform transition-all duration-300`,
						{
							"translate-x-0": !isConfirmed,
							"-translate-x-[110%] absolute": isConfirmed,
						}
					)}
				>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel className=" font-semibold  test-sm">
									{t('email')}
								</FormLabel>
								<FormControl>
									<Input
										className="h-8"
										placeholder="example@gmail.com"
										type="email"
										{...field}
									/>
								</FormControl>
								<FormMessage className="text-red-500" />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm font-semibold">
									{t('password')}
								</FormLabel>
								<FormControl>
									<div className=" relative">
										<Input
											className="h-8"
											type={
												passwordReveal
													? "text"
													: "password"
											}
											{...field}
										/>
										<div
											className="absolute right-2 top-[30%] cursor-pointer group"
											onClick={() =>
												setPasswordReveal(
													!passwordReveal
												)
											}
										>
											{passwordReveal ? (
												<FaRegEye className=" group-hover:scale-105 transition-all" />
											) : (
												<FaRegEyeSlash className=" group-hover:scale-105 transition-all" />
											)}
										</div>
									</div>
								</FormControl>
								<FormMessage className="text-red-500" />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="confirm-pass"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm font-semibold">
									{t('confirm-password')}
								</FormLabel>
								<FormControl>
									<div className=" relative">
										<Input
											className="h-8"
											type={
												passwordReveal
													? "text"
													: "password"
											}
											{...field}
										/>
										<div
											className="absolute right-2 top-[30%] cursor-pointer group"
											onClick={() =>
												setPasswordReveal(
													!passwordReveal
												)
											}
										>
											{passwordReveal ? (
												<FaRegEye className=" group-hover:scale-105 transition-all" />
											) : (
												<FaRegEyeSlash className=" group-hover:scale-105 transition-all" />
											)}
										</div>
									</div>
								</FormControl>
								<FormMessage className="text-red-500" />
							</FormItem>
						)}
					/>
					<Button
						type="submit"
						className="w-full h-8 bg-indigo-500 hover:bg-indigo-600 transition-all text-white flex items-center gap-2"
					>
						<AiOutlineLoading3Quarters
							className={cn(
								!isPending ? "hidden" : "block animate-spin"
							)}
						/>
						{t('continue')}
						<RiArrowRightSFill className=" size-4" />
					</Button>
					<div className="text-center text-sm">
						<h1>
							{t('already-have-an-account')}{' '}
							<Link
								href={`/${locale}/signin${formattedNext ? `?next=${formattedNext}` : ''}`}
								className="text-blue-400"
							>
								{t('sign-in')}
							</Link>
						</h1>
					</div>
				</form>
			</Form>
			{/* verify email */}
			<div
				className={cn(
					`w-full inline-block h-80 text-wrap align-top transform transition-all duration-300 space-y-3`,
					{
						"translate-x-[110%] absolute": !isConfirmed,
						"translate-x-0": isConfirmed,
					}
				)}
			>
				<div className="flex h-full items-center justify-center flex-col space-y-5">
					<SiMinutemailer className=" size-8" />

					<h1 className="text-2xl font-semibold text-center">
						{t('verify-email')}
					</h1>
					<p className="text-center text-sm">
						{t('verification-code-sent')}{' '}
						<span className="font-bold">
							{verify === "true"
								? existEmail
								: form.getValues("email")}
						</span>
					</p>

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
							<InputOTPSlot
								index={4}
								className={cn(inputOptClass)}
							/>
							<InputOTPSlot
								index={5}
								className={cn(inputOptClass)}
							/>
						</InputOTPGroup>
					</InputOTP>
					<div className="text-sm flex gap-2">
						<p>{t('didnt-work')} </p>
						<span
							className="text-blue-400 cursor-pointer hover:underline transition-all flex items-center gap-2 "
							onClick={async () => {
								if (!isSendAgain) {
									startSendAgain(async () => {
										if (!form.getValues("password")) {
											const json = await postEmail({
												email: form.getValues("email"),
												password:
													form.getValues("password"),
											});

											if (json.error) {
												toast.error(t('resend-code-failed'));
											} else {
												toast.success(t('resend-code-success'));
											}
										} else {
											router.replace(
												pathname || "/signup"
											);
											form.setValue(
												"email",
												existEmail || ""
											);
											form.setValue("password", "");
											setIsConfirmed(false);
										}
									});
								}
							}}
						>
							<AiOutlineLoading3Quarters
								className={`${
									!isSendAgain
										? "hidden"
										: "block animate-spin"
								}`}
							/>
							{t('send-another-code')}
						</span>
					</div>
					<Button
						type="submit"
						className="w-full h-8 bg-indigo-500 hover:bg-indigo-600 transition-all text-white flex items-center gap-2"
						onClick={async () => {
							setIsConfirmed(false);
						}}
					>
						<RiArrowDropLeftFill className=" size-5" />
						{t('change-email')}
					</Button>
				</div>
			</div>
		</div>
	);
}
