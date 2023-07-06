# 프리온보딩 프론트앤드 챌린지 2
---
- Redux 레포지토리에서 코드 분석하고 직접 scratch 작성해보기
- createStore의 최소 구현체를 직접 작성해본다.

- [요구사항](#요구사항)
- [설계](#설계)
- [구현](#구현)
  - [main](#maintsx)
  - [Router](#react-router-domroutertsx)

## 요구사항
---
- 1) `createStore`는 `reducer`를 인자로 받아 `store`를 리턴하는 함수다
    
    ```tsx
    const store = createStore((state, action) => {
    	if (action.type === "ADD") {
    		return {...state, todos: [...state.todos, action.payload]}
    	}
    	return state
    })
    ```
    
- 2) `store`는 `subscribe()`, `dispatch()`, `getState()`를 메서드로 가진 객체다
- 3) `reducer`는 createStore의 내부 상태인 state와, action 객체를 인자로 받아 action type에 따라 로직을 처리한 후 새로운 state를 리턴하는 함수다


## 설계
---
1. 간단하게 구현할 수 있을 것 같지만, 실제 `redux`의 기능을 최대한 구현해보려 함.
2. `redux`의 특징은 store는 불변객체이고, 상태를 변경하기 위해 `dispatch`를 호출해야 함.
3. `getState`는 항상 최신화 된 `state`를 반환하는 함수
4. `subscribe`는 v4버전까지 `dispatch`를 감지하는 함수였으나, 특정 키값을 구독하고 해당 데이터의 변경을 감지하는 함수여야 함.(`zustand` 기능 차용)


## 구현
---
### index.ts
- `mutation` 은 `dispatch`를 통해 이루어 지기 때문에, `initialState`를 freeze함.
- subscribe listners는 key,value 쌍으로 `state`의 키값의 변화를 감지하는 함수들의 배열을 저장
- 항상 최신화 된 상태를 사용해야 하기 때문에 `clousure`를 적극 활용
```ts

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
```

### utils.ts

- 특정 키값에 해당하는 데이터의 변화를 감지하기 위한 함수
- `state`는 무조건 object이기 때문에, `Array`, `Object`, `string`, `number`의 케이스 핸들링 (사실 Symbol도 추가될 수 있을 것 같은데, 구현방법이 떠오르지 않음.)
- 2가지의 object를 비교하여 변경된 키가 있을경우 해당 키를 return, 아닐경우 false를 리턴하는 함수

```ts
const isArray = Array.isArray;
const keyList = Object.keys;

export function findChangeValue<T extends any>(
  a: T,
  b: T,
  obKey?: keyof T
): keyof T | boolean {
  if (a === b) {
    return false;
  }
  if (isArray(a) && isArray(b)) {
    for (let i = a.length; i-- === 0; ) {
      if (a[i] !== b[i]) {
        return obKey ?? false;
      }
    }
  } else if (a && b && typeof a === "object" && typeof b === "object") {
    const keys = keyList(a);
    for (let i = keys.length; i-- !== 0; ) {
      const key = keys[i] as keyof T;
      if (findChangeValue(a[key], b[key], key)) {
        return key;
      }
    }
  }

  return a === b ? false : obKey ?? false;
}

```