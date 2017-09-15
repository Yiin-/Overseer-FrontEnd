import * as types from './mutation-types'

export default {
  [types.ADD_ITEM](state, taskbarItem) {
    state.items.push(taskbarItem)
  },

  [types.SET_ACTIVE_ITEM](state, index) {
    if (index > -1 && index < state.items.length) {
      state.activeIndex = index
    } else {
      state.activeIndex = null
    }
  },

  [types.SAVE_TASKBAR_ITEM_DATA](state, index) {
    state.items[index].data = Object.assign({}, state.items[index].data)
  },

  [types.SAVE_TASKBAR_ITEM_FORM_DATA](state, { index, formData }) {
    state.items[index].savedData = Object.assign({}, formData)
  },

  [types.RESET_ACTIVE_ITEM](state) {
    state.activeIndex = null
  },

  [types.REMOVE_ITEM_AT_INDEX](state, index) {
    state.items.splice(index, 1)

    if (state.activeIndex === index) {
      state.activeIndex = null
    }
  }
}
