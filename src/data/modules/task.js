import {debug} from "../../utils/logging";
import {UPDATE_AVAILABLE_TASKS} from "../constants/task_constants";
import taskApi from "../../api/taskApi";

const state = {
  availableTasks: []
};

const getters = {
  availableTasks: state => state.availableTasks
};

const actions = {
  async [UPDATE_AVAILABLE_TASKS]({commit}) {
    await taskApi.getTasks().then(response => {
      const tasksDto = response.data;
      debug(UPDATE_AVAILABLE_TASKS, "tasksDto", tasksDto);
      commit(UPDATE_AVAILABLE_TASKS, tasksDto.items);
    })
  }
};

const mutations = {
  [UPDATE_AVAILABLE_TASKS](state, availableTasks) {
    state.availableTasks = availableTasks;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};