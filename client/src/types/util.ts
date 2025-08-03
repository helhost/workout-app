export type DeepOmit<T, K extends keyof any> = {
  [P in keyof T as P extends K ? never : P]:       // 1. Remove key if it's in K (e.g., 'id')
  T[P] extends Array<infer U>                      // 2. If it's an array...
  ? Array<DeepOmit<U, K>>                          // ...recursively DeepOmit each item
  : T[P] extends object                            // 3. If it's a nested object (not array)...
  ? DeepOmit<T[P], K>                              // ...recursively DeepOmit that too
  : T[P];                                          // 4. Otherwise just keep the value as-is
};

