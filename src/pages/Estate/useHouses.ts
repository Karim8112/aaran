import GetAxios from "../../lib/GetAxios";
import GetOneAxios from "../../lib/GetOneAxios";
import { type House } from "../../Model/IHouse";
import { BaseURL } from "../../constants";
import { useState } from "react";
import type IApi from "../../Model/IApi";
import { type IFilter } from "../../Model/IApi";

interface getDataProps {
  filter?: IFilter;
  page?: number;
}

export function useHouse() {
  const [data, setData] = useState<IApi<House> | null>(null);
  const [oneHouse, setOneHouse] = useState<House | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [snackbarmsg, setSnackbarmsg] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarColor, setSnackbarColor] = useState<"success" | "danger">(
    "success",
  );

  interface IAPIforHouset extends IApi<House> {
    total: number;
  }

  const getOne = async function ({ id }: { id: string }) {
    GetOneAxios<House>({
      path: `${BaseURL}/house`,
      ObjectId: id,
      setLoading,
      onSuccess: (house) => setOneHouse(house),
      setSnackbarmsg,
      setSnackbarOpen,
      setSnackbarColor,
    });
  };

  const getData = async function (props: getDataProps) {
    GetAxios<IAPIforHouset>({
      filter: props.filter ? [{ ...props.filter }] : [],
      page: props.page,
      path: `${BaseURL}/house`,
      setLoading,
      onSuccess: (houses) => setData(houses),
      setSnackbarmsg,
      setSnackbarOpen,
      setSnackbarColor,
    });
  };

  return {
    getData,
    data,
    oneHouse,
    loading,

    snackbarmsg,
    snackbarOpen,
    snackbarColor,
    getOne,
  };
}
