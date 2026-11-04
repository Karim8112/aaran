import GetAxios from "../../lib/GetAxios";
import { type ILanding } from "../../Model/Landing";
import { BaseURL } from "../../constants";
import { useState } from "react";
import type { IApi2 } from "../../Model/IApi";

export function useLanding() {
  const [data, setData] = useState<IApi2<ILanding> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [snackbarmsg, setSnackbarmsg] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarColor, setSnackbarColor] = useState<"success" | "danger">(
    "success",
  );

  const getData = async function () {
    GetAxios<IApi2<ILanding>>({
      path: `${BaseURL}/landing-page`,
      setLoading,
      onSuccess: (data: IApi2<ILanding>) => setData(data),
      setSnackbarmsg,
      setSnackbarOpen,
      setSnackbarColor,
    });
  };

  return {
    getData,
    data,
    loading,
    snackbarmsg,
    snackbarOpen,
    snackbarColor,
  };
}
