import FormState from '../base/state'

const state = FormState('expense', {
  fields: {
    uuid: '',

    vendor_uuid: '', // uuid
    client_uuid: '', // uuid
    category_uuid: '', // uuid

    // Details
    amount: 0,
    currency_code: '', // id (currencies)
    date: null, // YYYY-MM-DD

    // Documents
    documents: []
  },

  tabs: [
    [
      'vendor_uuid'
    ],
    [
      'client_uuid'
    ],
    [
      'amount',
      'currency_code',
      'date'
    ],
    [
      'documents'
    ]
  ],

  errors: {}
})

export default state
