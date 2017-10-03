import FormState from '@/modules/form/state'

const state = FormState({
  __name: 'project',

  uuid: '',

  name: '',
  description: '',
  client_uuid: null,

  errors: {}
})

state.__initial = JSON.parse(JSON.stringify(state))

export default state
