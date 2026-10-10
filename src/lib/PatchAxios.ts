import axios, { type AxiosRequestConfig } from "axios";
import React from "react";
import { BaseURL } from "../constants";
import objectToFormData from "./ObjectToFormData";

export type IREST<RequestBody, ResponseBody> = {
  path: string;
  payload: RequestBody;
  objectId: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isFormData?: boolean;
  onUploadProgress?: (percentage: number) => void;
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

const PatchAxios = async function <RequestBody, ResponseBody>(
  props: IREST<RequestBody, ResponseBody>,
) {
  props.setLoading(true);

  try {
    const isMultipart = props.isFormData || props.payload instanceof FormData;

    // 2. Prepare payload: auto-convert object to FormData if needed
    let finalPayload: unknown = props.payload;
    if (isMultipart && !(props.payload instanceof FormData)) {
      finalPayload = objectToFormData(props.payload as Record<string, unknown>);
    }

    // 3. Configure request headers and optional progress tracking
    const config: AxiosRequestConfig = {};

    if (isMultipart) {
      config.headers = {
        "Content-Type": "multipart/form-data",
      };

      if (props.onUploadProgress) {
        config.onUploadProgress = (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            props.onUploadProgress!(percent);
          }
        };
      }
    }

    const path = props.path.concat("/").concat(props.objectId);
    const data = (await API.patch<ResponseBody>(
      path,
      finalPayload,
      config,
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

export default PatchAxios;
