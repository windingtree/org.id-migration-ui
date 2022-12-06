// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getDeepValue = (obj: Record<string, any>, path: string): unknown =>
  path.split('.').reduce((res, prop) => {
    const arrProp = prop.match(/(\w+)\[(\d+)\]$/i);
    if (arrProp) {
      return res && Object.keys(res).length > 0
        ? res[arrProp[1]][Number(arrProp[2])]
        : undefined;
    }
    return res && Object.keys(res).length > 0 ? res[prop] : undefined;
  }, obj);
