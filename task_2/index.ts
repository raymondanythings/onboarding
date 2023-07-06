import { findChangeValue } from "./utils";

type Action<T extends string = string> = {
  type: T;
};
interface UnknownAction extends Action {
  [extraProps: string]: unknown;
}
type Reducer<S, A extends Action = UnknownAction> = (state: S, action: A) => S;
type SubscribeFn = <T>(...args: T[]) => void;

const createStore = <S extends object, A extends Action = UnknownAction>(
  initialState: S,
  reducer: Reducer<S, A>
) => {
  let state = Object.freeze(initialState);
  let listners: { [key in keyof S]?: SubscribeFn[] } = {};

  const dispatch = (action: A) => {
    const nextState = reducer(getState(), action);
    const changedKey = findChangeValue(nextState, state);
    if (changedKey) {
      listners[changedKey]?.forEach((listner) => listner());
    }
    state = Object.freeze(nextState);
    return state;
  };
  const getState = () => {
    return { ...state };
  };

  const unsubscribe = (fn: SubscribeFn, keys: (keyof S)[]) => () => {
    keys.forEach((key) => {
      const targetListners = listners[key];
      if (targetListners) {
        const idx = targetListners.findIndex((f) => f === fn) ?? -1;
        if (idx > -1) {
          listners[key] = [
            ...targetListners.slice(0, idx),
            ...targetListners.slice(idx + 1, targetListners.length),
          ];
        }
      }
    });
  };
  const subscribe = (fn: SubscribeFn, keys: (keyof S)[]) => {
    keys.forEach((key) => {
      const targetListners = listners[key];
      if (!targetListners) {
        listners[key] = [];
      }
      if (typeof fn !== "function")
        return console.error("only contain function arg");
      listners[key]?.push?.(fn);
    });
    return unsubscribe(fn, keys);
  };
  return { subscribe, getState, dispatch };
};

export default createStore;
