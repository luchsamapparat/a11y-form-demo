import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import classNames from "classnames";
import { isEmpty, isUndefined, keys } from "lodash-es";
import { PaperPlaneTilt, Trash } from "phosphor-react";
import { useId } from "react";
import type { FieldErrors } from 'remix-validated-form';
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

  const { fieldErrors, hasBeenSubmitted } = useFormContext(formId)
  const firstName = useField('firstName', { formId });
  const lastName = useField('lastName', { formId });
  const email = useField('email', { formId });
  const password = useField('password', { formId });

  return (<>
    <ValidatedForm method="post" id={formId} aria-labelledby={headingId} validator={validator}>
      <h1 id={headingId}>Register</h1>

      <p>Please fill out all form fields to complete your registration.</p>
      <p className="legend" aria-hidden="true">Fields marked with a <strong className="required">*</strong> are required.</p>

      {hasBeenSubmitted ? (<p className="global-error" aria-live="assertive">{getGlobalErrorMessage(fieldErrors)}</p>) : null}

      <div className={classNames('form-row', { 'has-error': fieldErrors?.firstName })}>
        <label htmlFor="firstName">First Name<span className="required" title="Required" aria-hidden>*</span></label>
        <input type="text" id="firstName" {...firstName.getInputProps()} aria-required="true" aria-invalid={!isUndefined(fieldErrors?.firstName)} aria-describedby="firstNameFeedback" />
        <div className="feedback" id="firstNameFeedback">{fieldErrors?.firstName}</div>
      </div>

      <div className={classNames('form-row', { 'has-error': fieldErrors?.lastName })}>
        <label htmlFor="lastName">Last Name<span className="required" title="Required" aria-hidden>*</span></label>
        <input type="text" id="lastName" {...lastName.getInputProps()} aria-required="true" aria-invalid={!isUndefined(fieldErrors?.lastName)} aria-describedby="lastNameFeedback" />
        <div className="feedback" id="lastNameFeedback">{fieldErrors?.lastName}</div>
      </div>

      <div className={classNames('form-row', { 'has-error': fieldErrors?.email })}>
        <label htmlFor="email">Email Address<span className="required" title="Required" aria-hidden>*</span></label>
        <input type="email" id="email" {...email.getInputProps()} aria-required="true" aria-invalid={!isUndefined(fieldErrors?.email)} aria-describedby="emailFeedback" />
        <div className="feedback" id="emailFeedback">{fieldErrors?.email}</div>
      </div>

      <div className={classNames('form-row', { 'has-error': fieldErrors?.password })}>
        <label htmlFor="password">Password<span className="required" title="Required" aria-hidden>*</span></label>
        <input type="password" id="password" {...password.getInputProps()} aria-required="true" aria-invalid={!isUndefined(fieldErrors?.password)} aria-describedby="passwordHint passwordFeedback" />
        <div className="feedback" id="passwordFeedback">{fieldErrors?.password}</div>
        <div className="hint" id="passwordHint">Your password must contain 12+ characters with at least 1 number and 1 uppercase letter.</div>
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

const getGlobalErrorMessage = (fieldErrors: FieldErrors) => {
  if (isEmpty(fieldErrors)) {
    return null;
  }

  if (keys(fieldErrors).length === 1) {
    return "Failed to submit registration because one field has an error.";
  } else {
    return `Failed to submit registration because ${keys(fieldErrors).length} fields have errors.`;
  }
}
