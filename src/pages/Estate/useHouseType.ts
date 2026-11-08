import GetAxios from "../../lib/GetAxios";
import { type HouseType } from "../..//Model/IHouse";
import { useEffect, useState } from "react";
import { BaseURL } from "../../constants";
import type IApi from "../../Model/IApi";
export function useHouseTypes() {
  const [data, setData] = useState<IApi<HouseType> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarmsg, setSnackbarmsg] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarColor, setSnackbarColor] = useState<"success" | "danger">(
    "success",
  );
  useEffect(() => {
    GetAxios<IApi<HouseType>>({
      path: BaseURL.concat(`/house_type`),
      setLoading,
      onSuccess: (housesTypes) => setData(housesTypes),
      setSnackbarmsg,
      setSnackbarOpen,
      setSnackbarColor,
    });
  }, []);

  const Refresh = function () {
    GetAxios<IApi<HouseType>>({
      path: `/house_type`,
      setLoading,
      onSuccess: (housesTypes) => setData(housesTypes),
      setSnackbarmsg,
      setSnackbarOpen,
      setSnackbarColor,
    });
  };

  return {
    data,
    loading,
    snackbarmsg,
    snackbarOpen,
    snackbarColor,
    Refresh,
  };
}
