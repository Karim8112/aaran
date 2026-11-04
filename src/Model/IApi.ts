export default interface IApi<Type> {
  status: string;
  results: number;
  data: Type[];
  total?: number;
}

export interface IApi2<Type> {
  status: string;
  results: number;
  total?: number;
  data: Type;
}

export const filterOperations = {
  equal: "=",
  not_equal: "!=",
  greater: ">",
  greater_equal: ">=",
  less: "<",
  less_equal: "<=",
} as const;

// type filterOperators =
//   | 'equal'
//   | 'not_equal'
//   | 'greater'
//   | 'greater_than'
//   | 'less'
//   | 'less_than'

export interface IFilter {
  name: string;
  value: string;
  operator: keyof typeof filterOperations;
}
