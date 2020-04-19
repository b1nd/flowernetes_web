import api from "./api";

const containerizationMapping = "/containerization";

export default {
  getBaseImages: () => api.get(`${containerizationMapping}/images`)
}