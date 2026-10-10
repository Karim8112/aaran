export default interface IApi<Type> {
  status: string
  results: number
  data: Type[]
}
