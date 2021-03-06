import FormState from '../base/state'

const state = FormState('vendor', {
  fields: {
    uuid: '',

    // Organization
    name: '',
    registration_number: '',
    vat_number: '',
    website: '',
    phone: '',
    logo: null,

    // Address
    address1: '',
    address2: '',
    city: '',
    postal_code: '',
    state: '',
    country_id: null, // id

    // Contacts
    contacts: [
      {
        first_name: '',
        last_name: '',
        job_title: '',
        email: '',
        phone: ''
      }
    ],

    currency_code: '', // id
    notes: ''
  },

  tabs: [
    [
      'name',
      'registration_number',
      'vat_number',
      'website',
      'phone',
      'logo'
    ],
    [
      'address1',
      'address2',
      'city',
      'postal_code',
      'state',
      'country_id'
    ],
    [
      'contacts'
    ],
    [
      'currency_code'
    ]
  ],

  errors: {}
})

export default state
