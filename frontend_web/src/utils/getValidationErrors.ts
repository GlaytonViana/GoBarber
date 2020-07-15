import { ValidationError } from 'yup';

interface Errors {
  [key: string]: string;
}

export default function getValidationErrors(error: ValidationError): Errors {
  const validationsErrors: Errors = {};

  error.inner.forEach(err => {
    validationsErrors[err.path] = err.message;
  });

  return validationsErrors;
}
