import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";

const hasUppercaseCharacter = /[A-Z]/;
const hasNumber = /\d/;

const registrationFormSchema = z.object({
    firstName: zfd.text(z
        .string({ errorMap: () => ({ message: 'Please enter your first name' }) })
        .min(2, { message: 'Your first name must be at least 2 characters long' })
    ),
    lastName: zfd.text(z
        .string({ errorMap: () => ({ message: 'Please enter your last name' }) })
        .min(2, { message: 'Your last name must be at least 2 characters long' })
    ),
    email: zfd.text(z
        .string({ errorMap: () => ({ message: 'Please enter your email address' }) })
        .email({ message: 'Please enter a valid email address' })
    ),
    password: zfd.text(z
        .string({ errorMap: () => ({ message: 'Please enter a password' }) })
        .min(12, { message: 'Your password must be at least 12 characters long' })
        .regex(hasUppercaseCharacter, { message: 'Your password must have at least one uppercase character' })
        .regex(hasNumber, { message: 'Your password must have at least one number' })
    ),
});

export const validator = withZod(registrationFormSchema);

export type RegistrationFormData = z.infer<typeof registrationFormSchema>;
