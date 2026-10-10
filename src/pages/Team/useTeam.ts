import GetAxios from "../../lib/GetAxios";
import type ITeam from "../../Model/ITeam";
import { useEffect, useState } from "react";
import type IApi from "../../Model/IApi";
import { BaseURL } from "../../constants";
export function useTeam() {
  const [data, setData] = useState<IApi<ITeam> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarmsg, setSnackbarmsg] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarColor, setSnackbarColor] = useState<"success" | "danger">(
    "success",
  );
  useEffect(() => {
    GetAxios<IApi<ITeam>>({
      path: BaseURL.concat("/team"),
      setLoading,
      onSuccess: (teams) => setData(teams),
      setSnackbarmsg,
      setSnackbarOpen,
      setSnackbarColor,
    });
  }, []);

  return { data, loading, snackbarmsg, snackbarOpen, snackbarColor };
}
