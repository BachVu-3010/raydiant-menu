import React from 'react';
import deepEqual from 'lodash.isequal';


export default function useDeepMemo<F extends (...args: any[]) => any>(factory: F, args: Parameters<F>): ReturnType<F> {
  const groupsRef = React.useRef({ args: null, result: null });
  return React.useMemo(() => {
    if (!deepEqual(args, groupsRef.current.args)) {
      groupsRef.current = { result: factory(...args), args };
    }
    return groupsRef.current.result;
  }, [factory, args]);
};
