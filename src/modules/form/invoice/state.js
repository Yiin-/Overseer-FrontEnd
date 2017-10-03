import FormState from '@/modules/form/state'

const state = FormState({
  __name: 'invoice',

  uuid: '',

  client_uuid: '', // uuid
  invoice_date: undefined, // YYYY-MM-DD
  due_date: undefined, // YYYY-MM-DD
  partial: 0, // partial/deposit
  invoice_number: '',
  po_number: '',
  discount_type: 'percentage',
  discount_value: 0,

  items: [
    /* {
      product_uuid // uuid (products)
      product_name // new product
      price
      qty
      discount // %
      taxRate // uuid (tax_rates)
    } */
  ],
  documents: [
    /* array of document files */
  ],
  note_to_client: '',
  terms: '',
  footer: '',

  status: 'draft',

  tabs: [
    [
      'client_uuid'
    ],
    [
      'invoice_date',
      'due_date',
      'invoice_number',
      'po_number',
      'deposit',
      'currency_id',
      'discount_type',
      'discount_value'
    ],
    [
      'items'
    ],
    [
      'note_to_client',
      'terms',
      'footer'
    ]
  ],

  errors: {}
})

state.__initial = JSON.parse(JSON.stringify(state))

export default state
