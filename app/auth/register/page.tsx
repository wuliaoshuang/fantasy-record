"use client"

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import Link from "next/link"

const FormSchema = z.object({
  username: z.string()
    .min(1, { message: "用户名不能为空" })
    .min(2, { message: "用户名至少需要2个字符" }),
  email: z.string()
    .min(1, { message: "邮箱不能为空" })
    .email({ message: "请输入有效的邮箱地址" }),
  password: z.string()
    .min(1, { message: "密码不能为空" })
    .min(6, { message: "密码至少需要6个字符" }),
  confirmPassword: z.string()
    .min(1, { message: "请确认密码" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "两次输入的密码不一致",
  path: ["confirmPassword"],
})

function Register() {
  const router = useRouter()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("表单验证通过，提交数据:", data);

    const { confirmPassword, ...submitData } = data;

    fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submitData),
    })
      .then(res => res.json())
      .then(res => {
        if (res.data?.token) {
          toast.success("注册成功");

          // 存入 Cookie
          setCookie('token', res.data.token, {
            maxAge: 60 * 60 * 24, // 1 天
            path: '/',
          });

          // 保存在 localStorage
          localStorage.setItem("token", res.data.token);

          // 触发自定义事件通知其他组件token已更新
          window.dispatchEvent(new Event('tokenUpdated'));

          router.push("/");
        } else {
          toast.error(res.message || "注册失败");
        }
      })
      .catch(error => {
        console.error("注册错误:", error);
        toast.error("注册失败，请稍后重试");
      });
  }

  return (
    <div className='flex h-[100vh] justify-center items-center'>
      <Card className='w-[400px]'>
        <CardHeader>
          <CardTitle>注册</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>用户名</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="请输入用户名" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>确认密码</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="请再次输入密码" 
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
                注册
              </Button>
            </form>
          </Form>
          
          <div className="mt-4 text-center text-sm">
            已有账户？{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              立即登录
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Register