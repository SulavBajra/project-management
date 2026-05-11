import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { authService } from "@/services/authService"
import * as z from "zod"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import { useState } from "react"
import { toast } from "sonner"
import { EyeIcon, EyeOffIcon } from "lucide-react"

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  password_confirmation: z
    .string()
    .min(8, "Password must be at least 8 characters"),
})

type RegisterData = z.infer<typeof registerSchema>

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterData) => {
    try {
      await authService.register(data)

      navigate("/")
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message ?? "Invalid email or password.")
      } else {
        toast.error("Something went wrong. Please try again.")
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Register a new account</CardTitle>

          <CardDescription>
            Enter your email below to register a new account
          </CardDescription>

          <CardAction>
            <Button variant="link" asChild>
              <Link to="/login">Login In</Link>
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>

                <Input
                  id="email"
                  type="email"
                  placeholder="johndoe@gmail.com"
                  autoComplete="email"
                  {...register("email")}
                />

                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>

                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  autoComplete="name"
                  {...register("name")}
                />

                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>

                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    {...register("password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 h-full px-3 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password_confirmation">
                    Confirm Password
                  </Label>
                </div>

                <div className="relative">
                  <Input
                    id="password_confirmation"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    {...register("password_confirmation")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 h-full px-3 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {errors.password_confirmation && (
                  <p className="text-sm text-red-500">
                    {errors.password_confirmation.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Registering..." : "Register"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
