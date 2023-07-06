# 프리온보딩 프론트앤드 챌린지 1
---
- React와 History API 사용하여 SPA Router 기능 구현하기

- [요구사항](#요구사항)
- [설계](#설계)
- [구현](#구현)
  - [main](#maintsx)
  - [Router](#react-router-domroutertsx)
  - [RouterProvider](#react-router-domcontextrouterprovidertsx)

## 요구사항
---
**1) 해당 주소로 진입했을 때 아래 주소에 맞는 페이지가 렌더링 되어야 한다.**
- `/` → `root` 페이지
- `/about` → `about` 페이지

**2) 버튼을 클릭하면 해당 페이지로, 뒤로 가기 버튼을 눌렀을 때 이전 페이지로 이동해야 한다.**

- 힌트) `window.onpopstate`, `window.location.pathname` History API(`pushState`)

**3) Router, Route 컴포넌트를 구현해야 하며, 형태는 아래와 같아야 한다.**

```tsx
ReactDOM.createRoot(container).render(
  <Router>
    <Route path="/" component={<Root />} />
    <Route path="/about" component={<About />} />
  </Router>
);
```

**4) 최소한의 push 기능을 가진 useRouter Hook을 작성한다.**

```tsx
const { push } = useRouter();
```


## 설계
---
1. `<Router />`  리랜더링을 최소화 하기 위해 하위 요소들을 포함하는 Map 생성하는 HOC
2. `<RouterProvider />` 
   1. `popstate` 이벤트는 `back()` 과 `forward()`를 감시하기 때문에, 2가지 케이스를 핸들링 필요
   2. `WebAPI` 의 Routing History를 추적하는 history context 생성
   3. `useRouter` 사용 시 `WebAPI`와 연동되지 않기 때문에, `CustomEvent` 실행


## 구현
---
### main.tsx
- 기존 라이브러리에서 BrowserRouter를 제외한 사용법과 같습니다. 
```tsx
import React from "react";
import ReactDOM from "react-dom/client";
// 실제 라이브러리를 사용할 때와 같이 사용할 수 있게 제작
import { Route, Router } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <Route path="" component={<Home />} />
      <Route path="about" component={<About />} />
    </Router>
  </React.StrictMode>
);
```
### react-router-dom/Router.tsx
- 자식요소들을 포함하는 map객체 생성

```tsx
import { Children, PropsWithChildren } from "react";
import RouterProvider, { LocationMap } from "../context/RouterProvider";

const Router = ({ children }: PropsWithChildren) => {
  const currentPathRoute: LocationMap = {};
  Children.forEach(children, (element) => {
    if (
      element &&
      typeof element === "object" &&
      "props" in element &&
      element.props.path !== undefined
    ) {
      currentPathRoute[element.props.path] = element;
    }
  });

  return <RouterProvider locationMap={currentPathRoute} />;
};

export default Router;
```

### react-router-dom/context/RouterProvider.tsx
- 라우터의 중요로직을 포함하는 파일
- `WebAPI`와 동기시키기 위해 모든 라우터 이동 액션에 `popstate` 이벤트가 일어나게끔 구현
- `back()` , `forward()` 시 해당 화면의 `history.state` 가 저장되어있는 것을 이용하여 `history` state와 동기화
```tsx
import {
  PropsWithChildren,
  ReactNode,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { routeContext } from "../context/RouteContext";
export type LocationMap = { [key in string]: ReactNode };
const RouterProvider = ({
  locationMap,
}: PropsWithChildren<{
  locationMap: LocationMap;
}>) => {
  const [history, setHistory] = useState<string[]>([window.location.pathname]);
  const pathname = window.location.pathname;
  const initialPath = useRef([window.location.pathname]).current;
  const renderItem = locationMap[pathname.replace("/", "")];
  const handleListener = useCallback(
    (event: PopStateEvent) => {
      event.preventDefault();
      setHistory(event.state?.history ?? initialPath);
    },
    [initialPath]
  );
  const push = useCallback(
    <T,>(location: string, state?: T) => {
      const newState = {
        ...(state || {}),
        history: [...(history || []), location],
      };
      window.history.pushState(newState, "", location);
      window.dispatchEvent(new PopStateEvent("popstate", { state: newState }));
    },
    [history]
  );
  const replace = useCallback(
    <T,>(location: string, state?: T) => {
      const newHistory = [...history];
      newHistory[newHistory.length - 1] = location;
      const newState = { ...(state || {}), history: newHistory };
      window.history.replaceState(newState, "", location);
      window.dispatchEvent(new PopStateEvent("popstate", { state: newState }));
    },
    [history]
  );
  const pop = useCallback(() => {
    window.history.back();
  }, []);

  useEffect(() => {
    window.addEventListener("popstate", handleListener);
    return () => {
      window.removeEventListener("popstate", handleListener);
    };
  }, [handleListener]);

  if (!isValidElement(renderItem)) {
    return <>Has No Route path.</>;
  }

  return (
    <routeContext.Provider
      value={{ history, setHistory, pathname, pop, push, replace }}
    >
      {cloneElement(renderItem, { pathname } as {
        pathname: string;
      })}
    </routeContext.Provider>
  );
};

export default RouterProvider;
```

### react-router-dom/hooks/useRouter.ts
- `context` 값 추상화 hook
```ts
import { useContext } from "react";
import { routeContext } from "../context/RouteContext";

const useRouter = () => {
  const { pop, replace, push } = useContext(routeContext);

  return { push, pop, replace };
};

export default useRouter;
```