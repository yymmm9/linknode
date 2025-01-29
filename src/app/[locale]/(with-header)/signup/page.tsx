import Register from "@/components/supaauth/signup";
import { useLocale } from "next-intl";

export default function SignupPage() {
  // 获取当前语言环境
  const locale = useLocale();

  // 默认重定向到主页
  const redirectTo = `/${locale}`;

  return (
    <div className="w-full px-4 flex flex-col items-center">
      <Register redirectTo={redirectTo} />
    </div>
  );
}
