export function toBoolean(value: any) {
  return [true, 'true'].includes(value)
    ? true
    : [false, 'false'].includes(value)
      ? false
      : null;
}
