export function areAllRequiredFieldsSpecified(fields) {
  const notSpecified = fields.some(field => !field);
  return !notSpecified;
}

export function requiredField(name) {
  return [value => !!value || `${name} required`];
}

export function requiredNonEmptyArray(name) {
  return [v => !!v.length || `${name} required`];
}