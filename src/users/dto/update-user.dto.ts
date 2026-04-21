import {
  IsEmail,
  IsNotEmpty,
  Length,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ name: "isPasswordsMatching", async: false })
export class IsPasswordsMatchingConstraint implements ValidatorConstraintInterface {
  validate(confirmPassword: string, args: ValidationArguments) {
    const object = args.object as UpdateUserPasswordDto;
    return confirmPassword === object.password;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(args: ValidationArguments) {
    return "Password and confirm password do not match";
  }
}

export class UpdateUserPasswordDto {
  @IsNotEmpty()
  @Length(8, 128)
  password!: string;

  @IsNotEmpty()
  @Length(8, 128)
  oldPassword!: string;

  @IsNotEmpty()
  @Length(8, 128)
  @Validate(IsPasswordsMatchingConstraint)
  confirmPassword!: string;
}
export class UpdateUserPasswordByAdminDto {
  @IsNotEmpty()
  @Length(8, 128)
  password!: string;
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}
export class UpdateUsername {
  @IsNotEmpty()
  @Length(3, 50)
  username!: string;
}
