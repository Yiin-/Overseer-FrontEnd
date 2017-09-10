import * as types from './mutation-types'
import Echo from '@/echo'
import i18n from '@/i18n'
import Auth from '@/auth'
import { OVERVIEW } from '@/router/routes'
import router from '@/router'

export const LOGIN = ({ dispatch }, creds) => {
  Auth.login(creds)
    .then((response) => {
      const accessToken = response.body.access_token
      const user = response.body.user

      dispatch('AUTHENTICATE', { accessToken, user })
    })
}

export const REGISTER = ({ dispatch }, data) => {
  Auth.register(data)
    .then((response) => {
      const accessToken = response.body.access_token
      const user = response.body.user

      dispatch('AUTHENTICATE', { accessToken, user })
    })
}

export const AUTHENTICATE = ({ commit, state }, { accessToken, user }) => {
  commit(types.UPDATE_ACCESS_TOKEN, accessToken)
  commit(types.UPDATE_USER, user)

  localStorage.setItem('state', JSON.stringify({
    auth: state.auth,
    user: state.user,
    locale: state.locale
  }))

  router.push({
    name: OVERVIEW
  })

  Echo.connect()
}

export const LOGOUT = ({ commit }) => {
  commit(types.CLEAR_ALL_DATA)

  localStorage.removeItem('state')
  Echo.disconnect()

  router.push({ name: 'login' })
}

export const CHANGE_LOCALE = ({ commit, store }, locale) => {
  i18n.locale = locale
  commit(types.UPDATE_LOCALE, locale)
}
