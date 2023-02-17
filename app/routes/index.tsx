import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import classNames from "classnames";
import { PaperPlaneTilt, Trash } from "phosphor-react";
import type { FormEvent } from "react";
import type { ValidationErrorResponseData } from 'remix-validated-form';
import { validationError } from 'remix-validated-form';
import { useFormState } from "~/form";
import type { RegistrationFormData } from "~/registration";
import { validator } from "~/registration";

export const action: ActionFunction = async ({ request }) => {
  const { error } = await validator.validate(await request.formData());
  if (error) {
    return validationError(error);
  }
  return redirect(`/confirmation`);
};

export default function Index() {
  const { data, submit } = useFetcher<ValidationErrorResponseData | undefined>();
  const { fieldErrors } = data ?? {};

  const [registrationForm, onChangeHandler, reset] = useFormState<Partial<RegistrationFormData>>({});

  const handleReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    reset();
  };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit(registrationForm, { method: 'post' });
  };

  return (<>
    <form onReset={handleReset} onSubmit={handleSubmit}>
      <h1>Register</h1>

      <p>Please fill out all form fields to complete your registration.</p>

      <div className={classNames('form-row', { 'has-error': fieldErrors?.firstName })}>
        <input type="text" name="firstName" placeholder="First Name" value={registrationForm.firstName ?? ''} onChange={onChangeHandler('firstName')} />
        <div className="feedback">{fieldErrors?.firstName}</div>
      </div>

      <div className={classNames('form-row', { 'has-error': fieldErrors?.lastName })}>
        <input type="text" name="lastName" placeholder="Last Name" value={registrationForm.lastName ?? ''} onChange={onChangeHandler('lastName')} />
        <div className="feedback">{fieldErrors?.lastName}</div>
      </div>

      <div className={classNames('form-row', { 'has-error': fieldErrors?.email })}>
        <input type="email" name="email" placeholder="Email Address" value={registrationForm.email ?? ''} onChange={onChangeHandler('email')} />
        <div className="feedback">{fieldErrors?.email}</div>
      </div>

      <div className={classNames('form-row', { 'has-error': fieldErrors?.password })}>
        <input type="password" name="password" placeholder="Password" value={registrationForm.password ?? ''} onChange={onChangeHandler('password')} />
        <div className="feedback">{fieldErrors?.password}</div>
      </div>

      <div className="form-actions">
        <button type="reset">
          <Trash weight="bold" />
          Reset Form
        </button>
        <button type="submit" className="primary">
          <PaperPlaneTilt weight="bold" />
          Register
        </button>
      </div>
    </form>
  </>);
}
