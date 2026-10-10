import GetAxios from "../../lib/GetAxios";
import type ITeam from "../../Model/ITeam";
import { useEffect, useState } from "react";
export function useOneTeam(memberId: string) {
  const [data, setData] = useState<ITeam | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarmsg, setSnackbarmsg] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarColor, setSnackbarColor] = useState<"success" | "danger">(
    "success",
  );

  useEffect(() => {
    GetAxios<ITeam>({
      path: `/team/${memberId}`,
      setLoading,
      onSuccess: (teams) => setData(teams),
      setSnackbarmsg,
      setSnackbarOpen,
      setSnackbarColor,
    });
  }, [memberId]);

  return { data, loading, snackbarmsg, snackbarOpen, snackbarColor };
}
