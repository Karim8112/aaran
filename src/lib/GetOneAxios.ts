import axios from "axios";
import React from "react";
import { BaseURL } from "../constants";

export type IREST<ResponseBody> = {
  path: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  ObjectId: string;

  onSuccess?: (data: ResponseBody) => void;
  onError?: (error: unknown) => void;
  setSnackbarmsg?: React.Dispatch<React.SetStateAction<string>>;
  setSnackbarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setSnackbarColor?: React.Dispatch<React.SetStateAction<"success" | "danger">>;
};

export const API = axios.create({
  baseURL: BaseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    const authInfo = JSON.parse(localStorage.getItem("token") || "{}");

    if (authInfo) config.headers.Authorization = `Bearer ${authInfo}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const errorMessage =
      error.response?.data?.message || error.message || "Something went wrong";

    console.log("Logging the error", errorMessage);

    if (status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    } else {
      console.error("API Error:", errorMessage);
    }
    return Promise.reject(error);
  },
);

const GetOneAxios = async function <ResponseBody>(props: IREST<ResponseBody>) {
  props.setLoading(true);

  try {
    const data = (await API.get<ResponseBody>(
      props.path.concat("/").concat(props.ObjectId),
    )) as unknown as ResponseBody;
    let successMsg = "Success";
    if (data !== null && typeof data === "object" && "message" in data) {
      successMsg = String(data.message);
    }

    if (props.setSnackbarmsg && props.setSnackbarOpen) {
      props.setSnackbarmsg(successMsg);
      props.setSnackbarOpen(true);
      if (props.setSnackbarColor) props.setSnackbarColor("success");
    }

    if (props.onSuccess) {
      props.onSuccess(data);
    }
  } catch (error) {
    let errorMessage = "Something went wrong";
    if (typeof error === "object" && error !== null && "message" in error) {
      const apiError = error as {
        response?: { data?: { message?: unknown } };
        message?: unknown;
      };
      errorMessage = String(
        apiError.response?.data?.message ||
          apiError.message ||
          "Something went wrong",
      );
    }

    if (props.setSnackbarmsg && props.setSnackbarOpen) {
      props.setSnackbarmsg(errorMessage);
      props.setSnackbarOpen(true);
      if (props.setSnackbarColor) props.setSnackbarColor("danger");
    }

    if (props.onError) {
      props.onError(error);
    }
  } finally {
    props.setLoading(false);
  }
};

export default GetOneAxios;
