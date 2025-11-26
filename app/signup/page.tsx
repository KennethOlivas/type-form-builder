"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, ControllerRenderProps } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signUp } from "@/server/users";
import { toast } from "sonner";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignupValues = z.infer<typeof signupSchema>;

function TextField(props: {
  form: ReturnType<typeof useForm<SignupValues>>;
  name: keyof SignupValues;
  label: string;
  type?: string;
  placeholder?: string;
}) {
  const { form, name, label, type = "text", placeholder } = props;
  return (
    <FormField
      control={form.control}
      name={name}
      render={({
        field,
      }: {
        field: ControllerRenderProps<SignupValues, typeof name>;
      }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              id={name}
              type={type}
              placeholder={placeholder}
              className="mt-2 min-h-12"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default function SignupPage() {
  const router = useRouter();
  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (values: SignupValues) => {
    const { email, name, password } = values;
    // check if passwords match
    // if (values.password !== values.confirmPassword) {
    //   form.setError("confirmPassword", {
    //     type: "manual",
    //     message: "Passwords do not match",
    //   });
    //   return;
    // }

    try {
      const res = await signUp(name, email, password);
      if (res.user) {
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error(
        "Failed to sign up. Please try again." +
        (error instanceof Error ? ` ${error.message}` : ""),
      );
    }

    // router.push("/dashboard");
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card backdrop-blur-xl border border-border rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Get started</h1>
            <p className="text-muted-foreground">
              Create your FormFlow account
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <TextField
                form={form}
                name="name"
                label="Name"
                type="text"
                placeholder="Your name"
              />
              <TextField
                form={form}
                name="email"
                label="Email"
                placeholder="you@example.com"
              />

              <TextField
                form={form}
                name="password"
                label="Password"
                type="password"
                placeholder="Create a password"
              />

              <TextField
                form={form}
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 min-h-12"
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
