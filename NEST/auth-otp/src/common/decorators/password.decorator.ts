import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

export function ConfirmPassword(property: string, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: ConfirmPasswordConstrains,
    });
  };
}

@ValidatorConstraint({
  name: "ConfirmPassword",
})
export class ConfirmPasswordConstrains implements ValidatorConstraintInterface {
  validate(value: any, args?: ValidationArguments) {
    const { object, constraints } = args!;
    const [property] = constraints;

    const relatedValue = object[property];
    return value === relatedValue;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return "password and confirm password must be equals!";
  }
}
