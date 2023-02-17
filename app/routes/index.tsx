import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import classNames from "classnames";
import { PaperPlaneTilt, Trash } from "phosphor-react";
import { useId } from "react";
import { useField, useFormContext, ValidatedForm, validationError } from 'remix-validated-form';
import { validator } from "~/registration";

export const action: ActionFunction = async ({ request }) => {
  const { error } = await validator.validate(await request.formData());
  if (error) {
    return validationError(error);
  }
  return redirect(`/confirmation`);
};

export default function Index() {
  const headingId = useId();
  const formId = useId();

  const { fieldErrors } = useFormContext(formId)
  const firstName = useField('firstName', { formId });
  const lastName = useField('lastName', { formId });
  const email = useField('email', { formId });
  const password = useField('password', { formId });

  return (<>
    <ValidatedForm method="post" id={formId} aria-labelledby={headingId} validator={validator}>
      <h1 id={headingId}>Register</h1>

      <p>Please fill out all form fields to complete your registration.</p>

      <div className={classNames('form-row', { 'has-error': fieldErrors?.firstName })}>
        <label htmlFor="firstName">
          First Name
          <div className="hint">Required</div>
        </label>
        <input type="text" id="firstName" {...firstName.getInputProps()} />
        <div className="feedback">{fieldErrors?.firstName}</div>
      </div>

      <div className={classNames('form-row', { 'has-error': fieldErrors?.lastName })}>
        <label htmlFor="lastName">
          Last Name
          <div className="hint">Required</div>
        </label>
        <input type="text" id="lastName" {...lastName.getInputProps()} />
        <div className="feedback">{fieldErrors?.lastName}</div>
      </div>

      <div className={classNames('form-row', { 'has-error': fieldErrors?.email })}>
        <label htmlFor="email">
          Email Address
          <div className="hint">Required</div>
        </label>
        <input type="email" id="email" {...email.getInputProps()} />
        <div className="feedback">{fieldErrors?.email}</div>
      </div>

      <div className={classNames('form-row', { 'has-error': fieldErrors?.password })}>
        <label htmlFor="password">
          Password
          <div className="hint">Must contain 12+ characters<br />
            with at least 1 number and 1 uppercase letter.</div>
        </label>
        <input type="password" id="password" {...password.getInputProps()} />
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
    </ValidatedForm>
  </>);
}
