import { environment } from "../../../environments/environment.development";

export const APP_APIS = {
  AUTH: {
    signup: `${environment.baseUrl}/signup`,
    login: `${environment.baseUrl}/signin`,
  },

};