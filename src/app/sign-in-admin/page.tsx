"use client"

import {Button, Card, ControlledTextField, TextField, Typography} from "common/components";
import s from "./page.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";

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
  const [textFieldError, setTextFieldError] = useState<string>()

  const router = useRouter();

  const {
    control,
    formState: { isDirty, isValid, errors },
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

  const onSubmitSignInForm = async (data: SignInFormValues) => {}

  return <div className={s.signInAdmin}>
    <Card className={s.card}>
      <form className={s.form} noValidate onSubmit={handleSubmit(onSubmitSignInForm)}>
        <Typography variant={"h1"} className={s.title}>Sign In</Typography>
        <ControlledTextField
          autoComplete={"email"}
          control={control}
          error={textFieldError}
          label={"email"}
          name={"email"}
          type={"email"}
        />
        <ControlledTextField
          autoComplete={'current-password'}
          control={control}
          error={textFieldError}
          label={"password"}
          name={"password"}
          type={"password"}
        />
        <Controller
          name={"email"}
          control={control}
          render={({ field }) => (
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
          render={({ field }) => (
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
  </div>;
}
