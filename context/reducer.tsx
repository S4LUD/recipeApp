import { ACTION_TYPES, Action } from "./action";

export interface State {
  status: boolean;
}

export const initialState: State = {
  status: false,
};

export const Reducer = (prevState: any, action: Action): State => {
  switch (action.type) {
    case ACTION_TYPES.signIn:
      return {
        ...prevState,
        status: true,
      };
    case ACTION_TYPES.signOut:
      return {
        ...prevState,
        status: false,
      };
    default:
      return prevState;
  }
};
