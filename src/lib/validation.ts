export type FieldErrors<T> = Partial<Record<keyof T, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_REGEX = /^[\p{L}][\p{L}' -]*$/u;
const PHONE_REGEX = /^\+?[0-9 ]{8,15}$/;

export type LoginValues = {
  email: string;
  password: string;
};

export function validateLogin(values: LoginValues): FieldErrors<LoginValues> {
  const errors: FieldErrors<LoginValues> = {};
  const email = values.email.trim();

  if (!email) errors.email = "L'email est obligatoire.";
  else if (!EMAIL_REGEX.test(email)) errors.email = "Format d'email invalide.";

  if (!values.password) errors.password = 'Le mot de passe est obligatoire.';
  else if (values.password.length < 6)
    errors.password = 'Le mot de passe doit contenir au moins 6 caractères.';

  return errors;
}

export type StudentFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  program: string;
  phone: string;
};

export function validateStudent(
  values: StudentFormValues,
  existingEmails: string[]
): FieldErrors<StudentFormValues> {
  const errors: FieldErrors<StudentFormValues> = {};

  const nameError = (value: string, label: string) => {
    const v = value.trim();
    if (!v) return `${label} est obligatoire.`;
    if (v.length < 2) return `${label} doit contenir au moins 2 caractères.`;
    if (!NAME_REGEX.test(v)) return `${label} ne doit contenir que des lettres.`;
  };
  errors.firstName = nameError(values.firstName, 'Le prénom');
  errors.lastName = nameError(values.lastName, 'Le nom');

  const email = values.email.trim().toLowerCase();
  if (!email) errors.email = "L'email est obligatoire.";
  else if (!EMAIL_REGEX.test(email)) errors.email = "Format d'email invalide.";
  else if (existingEmails.includes(email)) errors.email = 'Cet email est déjà utilisé.';

  const age = values.age.trim();
  if (!age) errors.age = "L'âge est obligatoire.";
  else if (!/^\d+$/.test(age)) errors.age = "L'âge doit être un nombre entier.";
  else if (Number(age) < 15 || Number(age) > 99) errors.age = "L'âge doit être compris entre 15 et 99.";

  if (!values.program.trim()) errors.program = 'La filière est obligatoire.';

  const phone = values.phone.trim();
  if (phone && !PHONE_REGEX.test(phone)) errors.phone = 'Numéro de téléphone invalide.';

  return removeEmpty(errors);
}

export function hasErrors<T>(errors: FieldErrors<T>) {
  return Object.keys(errors).length > 0;
}

function removeEmpty<T>(errors: FieldErrors<T>): FieldErrors<T> {
  return Object.fromEntries(Object.entries(errors).filter(([, v]) => v)) as FieldErrors<T>;
}
