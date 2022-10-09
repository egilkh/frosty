const hasOwnProperty = <X extends object, Y extends PropertyKey>(
  obj: X | null,
  prop: Y,
): obj is X & Record<Y, unknown> => obj?.hasOwnProperty(prop) ?? false;

export default hasOwnProperty;
