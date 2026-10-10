export function objectToFormData<T extends Record<string, unknown>>(
  obj: T,
  formData: FormData = new FormData(),
  parentKey?: string
): FormData {
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue

    const value = obj[key]

    // Omit undefined and null values
    if (value === undefined || value === null) {
      continue
    }

    const formKey = parentKey ? `${parentKey}[${key}]` : key

    if (
      value !== null &&
      typeof value === 'object' &&
      ((value as unknown) instanceof File || (value as unknown) instanceof Blob)
    ) {
      // Append File or Blob instances directly
      formData.append(formKey, value as unknown as Blob)
    } else if (Array.isArray(value)) {
      // Handle array items
      value.forEach((item: unknown, index: number) => {
        if (
          typeof item === 'object' &&
          item !== null &&
          (item instanceof File || item instanceof Blob)
        ) {
          formData.append(formKey, item)
        } else if (typeof item === 'object' && item !== null) {
          objectToFormData(
            item as Record<string, unknown>,
            formData,
            `${formKey}[${index}]`
          )
        } else if (item !== undefined && item !== null) {
          formData.append(`${formKey}[${index}]`, String(item))
        }
      })
    } else if (typeof value === 'object') {
      // Recursively flatten nested objects
      objectToFormData(value as Record<string, unknown>, formData, formKey)
    } else {
      // Append primitive types (string, number, boolean)
      formData.append(formKey, String(value))
    }
  }

  return formData
}

export default objectToFormData
