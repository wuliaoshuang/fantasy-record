'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { setCookie } from 'cookies-next';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import Link from "next/link"

const FormSchema = z.object({
  email: z.string()
    .min(1, { message: "邮箱不能为空" })
    .email({ message: "请输入有效的邮箱地址" }),
  password: z.string()
    .min(1, { message: "密码不能为空" })
    .min(6, { message: "密码至少需要6个字符" }),
})

function Login() {
    const router = useRouter()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange", // 添加实时验证
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
  console.log("表单验证通过，提交数据:", data);

  fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .then(res => {
      if (res.data?.token) {
        toast.success("登录成功");

        // ✅ 存入 Cookie
        setCookie('token', res.data.token, {
          maxAge: 60 * 60 * 24, // 1 天
          path: '/', // 所有路径都带上
        });

        // ✅ 可选：也保存在 localStorage 做持久化
        localStorage.setItem("token", res.data.token);

        // 触发自定义事件通知其他组件token已更新
        window.dispatchEvent(new Event('tokenUpdated'));

        router.push("/");
      }
    });
}

  return (
    <div className='flex h-[100vh] justify-center items-center'>
      <Card className='w-[400px]'>
        <CardHeader>
          <CardTitle>登录</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>邮箱</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="请输入邮箱" 
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
                    <FormLabel>密码</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="请输入密码" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className='w-full'
                disabled={!form.formState.isValid}
              >
                登录
              </Button>
            </form>
          </Form>
          
          <div className="mt-4 text-center text-sm">
            还没有账户？{" "}
            <Link href="/auth/register" className="text-primary hover:underline">
              立即注册
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login