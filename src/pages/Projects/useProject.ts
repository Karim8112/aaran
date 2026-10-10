import GetAxios from "../../lib/GetAxios";
import { type IProject } from "../../Model/IProject";
import { useEffect, useState } from "react";
import type IApi from "../../Model/IApi";
import { BaseURL } from "../../constants";
export function useProject() {
  const [data, setData] = useState<IApi<IProject> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarmsg, setSnackbarmsg] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarColor, setSnackbarColor] = useState<"success" | "danger">(
    "success",
  );
  useEffect(() => {
    GetAxios<IApi<IProject>>({
      path: BaseURL.concat("/project"),
      setLoading,
      onSuccess: (teams) => setData(teams),
      setSnackbarmsg,
      setSnackbarOpen,
      setSnackbarColor,
    });
  }, []);

  return { data, loading, snackbarmsg, snackbarOpen, snackbarColor };
}
