import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";

@ValidatorConstraint({ name: "isEndTimeAfterStartTime", async: false })
export class IsEndTimeAfterStartTime implements ValidatorConstraintInterface {
  validate(endTime: Date, args: ValidationArguments) {
    const { startTime } = args.object as { startTime: string | Date };
    return new Date(endTime) > new Date(startTime);
  }

  defaultMessage() {
    return "endTime must be after startTime";
  }
}
