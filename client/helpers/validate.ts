export enum ValidatorRules {
  notEmpty = 'notEmpty',
  emailPattern = 'emailPattern',
  minLength = 'minLength',
  maxLength = 'maxLength',
}

type ValidatorConfig = {
  [ValidatorRules.notEmpty]?: boolean;
  [ValidatorRules.emailPattern]?: boolean;
  [ValidatorRules.minLength]?: number;
  [ValidatorRules.maxLength]?: number;
};

type ValidatorOptions = {
  setErrorMessage: (errorMessage: string) => void;
};

const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const validate = (
  toValidate: string,
  config: ValidatorConfig,
  options?: ValidatorOptions,
) => {
  try {
    const isValid = (
      toValidate: string,
      validator: { rule: keyof typeof ValidatorRules; value: any },
    ) => {
      switch (validator.rule) {
        case ValidatorRules.notEmpty:
          if (toValidate.length === 0) {
            throw new Error('Это поле необходимо заполнить');
          }
          break;
        case ValidatorRules.emailPattern:
          if (!EMAIL_REGEX.test(toValidate)) {
            throw new Error('Некорректный вид');
          }
          break;
        case ValidatorRules.minLength:
          if (toValidate.length < validator.value) {
            throw new Error(`Минимальная длина ${validator.value}`);
          }
          break;
        case ValidatorRules.maxLength:
          if (toValidate.length > validator.value) {
            throw new Error(`Максимальная длина ${validator.value}`);
          }
          break;
        default:
          break;
      }
    };
    Object.entries(config).forEach((validator) =>
      isValid(toValidate, {
        rule: validator[0] as keyof typeof ValidatorRules,
        value: validator[1],
      }),
    );
    return true;
  } catch (error) {
    if (error instanceof Error) {
      options?.setErrorMessage(error.message);
    }
    return false;
  }
};
