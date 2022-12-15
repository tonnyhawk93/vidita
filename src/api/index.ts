import axios from "axios";
import { createRandomDocument } from "./mocks";
import { documents1, documents2, cancel } from "./endpoints";
import MockAdapter from "axios-mock-adapter";

const mock = new MockAdapter(axios);

mock.onGet(documents1).reply(200, [...new Array(23)].map(createRandomDocument));
mock.onGet(documents2).reply(200, [...new Array(21)].map(createRandomDocument));
mock.onPost(cancel).reply(200);

const api = {
  getDocuments1() {
    return axios.get(documents1);
  },
  getDocuments2() {
    return axios.get(documents2);
  },
  cancel(ids: string[]) {
    return axios.post(cancel, ids);
  },
};

export default api;
