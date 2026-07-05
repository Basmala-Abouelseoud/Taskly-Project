import { environment } from "../../../environments/environment.development";

export const APP_APIS = {
  AUTH: {
    signup: `${environment.baseUrl}signup`,
    login: `${environment.baseUrl}signin`,
  },
PROJECTS: {
    create: `${environment.baseUrl}rest/v1/projects`,
    getList: `${environment.baseUrl}rest/v1/rpc/get_projects`
  }
};