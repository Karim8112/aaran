import GetAxios from "../../lib/GetAxios";
import { type ProjectType } from "../../Model/IProject";
import { BaseURL } from "../../constants";
import { useEffect, useState } from "react";
import type IApi from "../../Model/IApi";
export function useProjectTypes() {
  const [data, setData] = useState<IApi<ProjectType> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarmsg, setSnackbarmsg] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarColor, setSnackbarColor] = useState<"success" | "danger">(
    "success",
  );
  useEffect(() => {
    GetAxios<IApi<ProjectType>>({
      path: BaseURL.concat("/project_type"),
      setLoading,
      onSuccess: (projects) => setData(projects),
      setSnackbarmsg,
      setSnackbarOpen,
      setSnackbarColor,
    });
  }, []);

  const Refresh = function () {
    GetAxios<IApi<ProjectType>>({
      path: BaseURL.concat("/project_type"),
      setLoading,
      onSuccess: (projects) => setData(projects),
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
