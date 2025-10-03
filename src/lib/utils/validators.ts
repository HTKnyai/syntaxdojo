import { z } from 'zod';

export const emailSchema = z
  .string()
  .email('有効なメールアドレスを入力してください')
  .max(254, 'メールアドレスは254文字以内で入力してください');

export const passwordSchema = z
  .string()
  .min(8, 'パスワードは8文字以上で入力してください')
  .regex(
    /^(?=.*[A-Za-z])(?=.*\d)/,
    'パスワードは英字と数字を含む必要があります'
  );

export const displayNameSchema = z
  .string()
  .min(1, '表示名を入力してください')
  .max(50, '表示名は50文字以内で入力してください');

export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  displayName: displayNameSchema,
});

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;
