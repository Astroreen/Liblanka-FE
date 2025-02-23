export enum LoginStatus {
  INPUTTING,
  LOADING,
  SUCCESS,
  ERROR,
}

export type LoginState = {
  email: string;
  password: string;
  status: LoginStatus;
  message: string;
};

export type LoginAction =
  | {
      type: "COMPLETE_STEP";
      payload: { step: "email" | "password"; input: string };
    }
  | { type: "LOGIN_BEGIN" }
  | { type: "LOGIN_SUCCESS" }
  | { type: "LOGIN_ERROR"; payload: { message: string } }
  | { type: "LOGIN_INPUTTING" };

export const initialLoginState: LoginState = {
  email: "",
  password: "",
  status: LoginStatus.INPUTTING,
  message: "",
};

export const loginReducer = (
  state: LoginState,
  action: LoginAction
): LoginState => {
  switch (action.type) {
    case "COMPLETE_STEP": {
      const { step, input } = action.payload;
      return { ...state, [step]: input };
    }
    case "LOGIN_BEGIN":
      return { ...state, status: LoginStatus.LOADING, message: "" };
    case "LOGIN_SUCCESS":
      return { ...state, status: LoginStatus.SUCCESS };
    case "LOGIN_ERROR": {
      const { message } = action.payload;
      return {
        ...initialLoginState,
        status: LoginStatus.ERROR,
        message: message,
      };
    }
    case "LOGIN_INPUTTING":
      return { ...state, status: LoginStatus.INPUTTING };
    default:
      return state;
  }
};
