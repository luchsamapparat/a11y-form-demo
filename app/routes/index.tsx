import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import classNames from "classnames";
import { PaperPlaneTilt, Trash } from "phosphor-react";
import type { FormEvent } from "react";
import { useId } from "react";
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

  const headingId = useId();

  return (<>
    <form aria-labelledby={headingId} onReset={handleReset} onSubmit={handleSubmit}>
      <h1 id={headingId}>Register</h1>

      <p>Please fill out all form fields to complete your registration.</p>

      <div className={classNames('form-row', { 'has-error': fieldErrors?.firstName })}>
        <label htmlFor="firstName">
          First Name
          <div className="hint">Required</div>
        </label>
        <input type="text" name="firstName" id="firstName" value={registrationForm.firstName ?? ''} onChange={onChangeHandler('firstName')} />
        <div className="feedback">{fieldErrors?.firstName}</div>
      </div>

      <div className={classNames('form-row', { 'has-error': fieldErrors?.lastName })}>
        <label htmlFor="lastName">
          Last Name
          <div className="hint">Required</div>
        </label>
        <input type="text" name="lastName" id="lastName" value={registrationForm.lastName ?? ''} onChange={onChangeHandler('lastName')} />
        <div className="feedback">{fieldErrors?.lastName}</div>
      </div>

      <div className={classNames('form-row', { 'has-error': fieldErrors?.email })}>
        <label htmlFor="email">
          Email Address
          <div className="hint">Required</div>
        </label>
        <input type="email" name="email" id="email" value={registrationForm.email ?? ''} onChange={onChangeHandler('email')} />
        <div className="feedback">{fieldErrors?.email}</div>
      </div>

      <div className={classNames('form-row', { 'has-error': fieldErrors?.password })}>
        <label htmlFor="password">
          Password
          <div className="hint">Must contain 12+ characters<br />
            with at least 1 number and 1 uppercase letter.</div>
        </label>
        <input type="password" name="password" id="password" value={registrationForm.password ?? ''} onChange={onChangeHandler('password')} />
        <div className="feedback">{fieldErrors?.password}</div>
      </div>

      <div className="form-actions">
        <button type="submit" className="primary">
          <PaperPlaneTilt weight="bold" />
          Register
        </button>
        <button type="reset">
          <Trash weight="bold" />
          Reset Form
        </button>
      </div>
    </form>
  </>);
}
