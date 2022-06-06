// それぞれのInputを配列で貰ってフォーム全体のバリデーションをする
interface StateType {
  input: string;
  isValid: boolean;
}

export const useFormValidation = (args: StateType[]): boolean => {

  const inputArray = args.map(arg => arg.input);
  const isValidArray = args.map(arg => arg.isValid);

  if (inputArray.includes('') || isValidArray.includes(false)) {
    return false;
  }
  else {
    return true;
  }
}