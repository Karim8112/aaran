import { type IFilter, filterOperations } from "../Model/IApi";

const urlParams = function ({
  filter,
  page,
}: {
  filter?: IFilter[];
  page?: number;
}) {
  if (filter?.length == 0 && !page) return;
  //
  let paramString;
  let filterString = "";
  //
  if (filter) {
    filterString = filter
      ?.map((filter) => {
        return `/?${filter.name}${filterOperations[filter.operator]}${filter.value}`;
      })
      .join("&");
  }

  if (page) {
    paramString =
      filterString != "" ? `${filterString}&page=${page}` : `?page=${page}`;
  } else paramString = filterString;
  //
  console.log("this is the param string, ", paramString);
  //
  return paramString;
};

export default urlParams;
