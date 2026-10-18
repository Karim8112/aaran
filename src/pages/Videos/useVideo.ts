import GetAxios from "../../lib/GetAxios";
import type IVideo from "../../Model/IVideo";
import { useEffect, useState } from "react";
import { BaseURL } from "../../constants";
import type IApi from "../../Model/IApi";
export function useVideos() {
  const [data, setData] = useState<IApi<IVideo> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarmsg, setSnackbarmsg] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarColor, setSnackbarColor] = useState<"success" | "danger">(
    "success",
  );
  useEffect(() => {
    GetAxios<IApi<IVideo>>({
      path: BaseURL.concat("/video"),
      setLoading,
      onSuccess: (videos) => setData(videos),
      setSnackbarmsg,
      setSnackbarOpen,
      setSnackbarColor,
    });
  }, []);

  return { data, loading, snackbarmsg, snackbarOpen, snackbarColor };
}
