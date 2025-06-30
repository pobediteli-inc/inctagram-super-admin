"use client"

import {Button, Card, TextField, Toast, Typography} from "common/components";
import s from "./page.module.css";
import React, {useState} from "react";
import {useRouter} from "next/navigation";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {useMutation} from "@apollo/client";
import {LOGIN_ADMIN} from "apollo/mutations/admin";
import {updateLoginState} from "apollo/client";
import { useAppDispatch } from "common/hooks";
import { setStatus } from "store/services/slices";

const signInSchema = z
  .object({
    email: z
      .string({
        required_error: "Email is required.",
      })
      .email("Please enter a valid email address, like example@example.com."),
    password: z
      .string({
        required_error: "Password is required.",
      })
  })

export type SignInFormValues = z.infer<typeof signInSchema>;

export default function SingInAdmin() {
  const [toast, setToast] = useState<{
    type: "success" | "error" | "warning";
    message: string;
    open: boolean;
  } | null>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loginAdmin] = useMutation(LOGIN_ADMIN)

  const {
    control,
    formState: {isDirty, isValid, errors},
    handleSubmit,
    reset,
  } = useForm<SignInFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onTouched',
    resolver: zodResolver(signInSchema),
  })

  const onSubmitSignInForm = async (data: SignInFormValues) => {
    try {
      const res = await loginAdmin({variables: {email: data.email, password: data.password}})

      if (res.data.loginAdmin.logged) {
        updateLoginState(true);
        dispatch(setStatus({ status: "success", message: "Successfully logged in." }));
        reset()
        router.replace("/users-list")
      } else {
        reset()
        dispatch(setStatus({ status: "error", message: "You are not logged in as an administrator. Check the data you entered and try again." }));
      }
    } catch (error: any) {
      if (error.data) {
        setToast({ type: "error", message: "The email or password are incorrect. Try again please.", open: true });
      }
    }
  }

  return <div className={s.signInAdmin}>
    <Card className={s.card}>
      <form className={s.form} noValidate onSubmit={handleSubmit(onSubmitSignInForm)}>
        <Typography variant={"h1"} className={s.title}>Sign In</Typography>
        <Controller
          name={"email"}
          control={control}
          render={({field}) => (
            <TextField
              variant={"standard"}
              type={"email"}
              placeholder={"example@example.com"}
              label={"Email"}
              error={errors.email?.message}
              autoComplete={"email"}
              {...field}
            />
          )}
        />
        <Controller
          name={"password"}
          control={control}
          render={({field}) => (
            <TextField
              variant={"standard"}
              type={"password"}
              placeholder={"**********"}
              label={"Password"}
              error={errors.password?.message}
              autoComplete={"current-password"}
              {...field}
            />
          )}
        />
        <Button disabled={!isValid || !isDirty} type={"submit"}>
          Sign In
        </Button>
      </form>
    </Card>
    {toast && (
      <Toast
        type={toast.type}
        message={toast.message}
        open={toast.open}
        setOpen={(open) => setToast((prev) => (prev ? { ...prev, open } : null))}
      />
    )}
  </div>;
}
