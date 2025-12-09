export function replaceTemplateVariables(
  template: string,
  variables: Record<string, string>
): string {
  let result = template

  // Replace all variables in the format {{variable_name}}
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g')
    result = result.replace(regex, value || '')
  })

  return result
}

export function extractVariables(template: string): string[] {
  const regex = /{{\s*(\w+)\s*}}/g
  const variables: string[] = []
  let match

  while ((match = regex.exec(template)) !== null) {
    if (!variables.includes(match[1])) {
      variables.push(match[1])
    }
  }

  return variables
}

