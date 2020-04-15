import api from "./api";

const namespacesMapping = "/namespaces";

export default {
  getNamespaces: () => api.get(namespacesMapping)
}