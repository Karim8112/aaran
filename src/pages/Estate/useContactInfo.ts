import GetAxios from "../../lib/GetAxios";
import { type IContactInfo } from "../../Model/Landing";
import { useState } from "react";
import type IApi from "../../Model/IApi";
import { BaseURL } from "../../constants";
export function useContactInfo() {
  const [data, setData] = useState<IApi<IContactInfo> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarmsg, setSnackbarmsg] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarColor, setSnackbarColor] = useState<"success" | "danger">(
    "success",
  );
  const GetData = function () {
    GetAxios<IApi<IContactInfo>>({
      path: BaseURL.concat("/contact-info"),
      setLoading,
      onSuccess: (data) => setData(data),
      setSnackbarmsg,
      setSnackbarOpen,
      setSnackbarColor,
    });
  };

  return {
    GetData,
    data,
    loading,
    snackbarmsg,
    snackbarOpen,
    snackbarColor,
  };
}
