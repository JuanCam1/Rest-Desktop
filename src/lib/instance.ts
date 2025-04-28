import { config } from "@/utils/config";
import axios from "axios";

const baseUrl = config.baseUrl;

export const instance = axios.create({
  baseURL: baseUrl,
})