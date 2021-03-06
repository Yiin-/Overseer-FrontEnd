<template>
  <div>
    <template v-if="!availableItems.length">
      <div class="placeholder-area">
        <div class="placeholder placeholder--invoices"></div>
        <div class="placeholder placeholder--line"></div>
        <div class="placeholder__text">
          Here you can create and manage invoices, <br>
          E-Mail them to clients and save drafts.
        </div>
        <button v-if="canCreateInvoice" @click="create" class="button button--create">
          <span class="icon-new-invoice-btn-icon"></span>
          {{ $t('actions.new_invoice') }}
        </button>
      </div>
    </template>
    <template v-else>
      <div class="table__heading">
        <button v-if="canCreateInvoice" @click="create" class="button button--create">
          <span class="icon-new-invoice-btn-icon"></span>
          {{ $t('actions.new_invoice') }}
        </button>

        <div class="table__dropdowns">
          <filter-by ref="filterByComponent" :watch="{ clients, invoice_products: products }" :name="name" :options="filterBy"></filter-by>
          <search-by :name="name" :options="searchBy"></search-by>
        </div>
      </div>

      <documents-table
        @apply-filters-to-show-hidden-results="applyFiltersToShowHiddenResults"
        :data="list"
        :context-menu-builder="contextMenuBuilder"
      >
        <template slot="head">
          <column width="16%">{{ $t('fields.invoice_number') }}</column>
          <column width="20%">{{ $t('fields.client_name') }}</column>
          <column width="13%">{{ $t('fields.date') }}</column>
          <column width="13%">{{ $t('fields.due_date') }}</column>
          <column width="12%">{{ $t('fields.amount') }}</column>
          <column width="12%">{{ $t('fields.paid_in') }}</column>
          <column width="14%" class="column--center">{{ $t('fields.status') }}</column>
        </template>
        <template slot="columns" slot-scope="{ row }">
          <column width="16%">
            <a href="#" @click="edit(row)">
              {{ row.invoiceNumber }}
            </a>
          </column>
          <column width="20%">
            <a href="#" @click.prevent="editDocument(row.client, 'client')">
              {{ row.client.name }}
            </a>
          </column>
          <column width="13%">
            <span>{{ row.date | date }}</span>
          </column>
          <column width="13%">
            <span>{{ row.dueDate | date }}</span>
          </column>
          <column width="12%">
            <span class="currency">{{ row.amount.currency | currencySymbol }}</span>
            <span class="currency currency--primary">{{ row.amount.amount | currency }}</span>
          </column>
          <column width="12%">
            <span class="currency">{{ row.paidIn.currency | currencySymbol }}</span>
            <span class="currency"
                  :class="{
                    'currency--secondary': row.paidIn.amount < row.amount.amount,
                    'currency--primary': row.paidIn.amount >= row.amount.amount
                  }"
            >
              {{ row.paidIn.amount | currency }}
            </span>
          </column>
          <column width="14%" class="column--center">
            <statuses-list type="invoice" :document-uuid="row.uuid"></statuses-list>
          </column>
        </template>
      </documents-table>

      <table-footer
        :table-name="name"
        :calculator-options="[
          { text: $t('fields.amount'), value: 'amount', type: 'money' },
          { text: $t('fields.paid_in'), value: 'paidIn', type: 'money' }
        ]"
      ></table-footer>
    </template>
  </div>
</template>

<script>
import TableMixin from '@/mixins/TableMixin'

import {
  IsActiveFilter,
  IsArchivedFilter,
  IsDeletedFilter,
  IsDraftFilter,
  IsSentFilter,
  IsViewedFilter,
  IsPartialFilter,
  IsPaidFilter,
  IsOverdueFilter,
  CurrenciesFilter,
  ClientsFilter,
  InvoiceProductsFilter,

  // Search By
  SearchByText,
  SearchByValue,
  SearchByDate,
  SearchByItemsProduct
} from '@/modules/table/filters'

import TableCmItems from '@/modules/table/contextmenu/items'

export default {
  mixins: [
    TableMixin
  ],

  props: {
    currentLayout: {
      type: String
    }
  },

  computed: {
    name() {
      return 'invoices'
    },

    searchBy() {
      return [
        SearchByText.extend({ key: 'invoiceNumber', name: 'invoice_number', placeholder: this.$t('search_by.invoice_number') }),
        SearchByDate.extend({ key: 'date', name: 'invoice_date', placeholder: this.$t('search_by.invoice_date') }),
        SearchByDate.extend({ key: 'dueDate', name: 'due_date', placeholder: this.$t('search_by.due_date') }),
        SearchByValue.extend({ key: 'amount', name: 'invoice_amount', placeholder: this.$t('search_by.invoice_amount') }),
        { type: 'separator' },
        SearchByText.extend({ key: 'client.name', name: 'client_name', placeholder: this.$t('search_by.client_name') }),
        SearchByItemsProduct.extend({ name: 'product_name', placeholder: this.$t('search_by.product_name') })
      ]
    },

    contextMenuBuilder() {
      return this.$contextMenu.init({
        tableStateName: this.name
      }).addItem(TableCmItems.SELECTED_ROWS)
        .addItem(TableCmItems.ARCHIVE_MANY)
        .addItem(TableCmItems.UNARCHIVE_MANY)
        .addItem(TableCmItems.DELETE_MANY)
        .addItem(TableCmItems.RECOVER_MANY)
        .addSeparator()
        .addItem(TableCmItems.TABLE_NAME)
        .addItem(TableCmItems.CREATE_DOCUMENT.extend({
          title: this.$t('actions.new_invoice')
        }))
        .addItem(TableCmItems.SELECTED_DOCUMENT)
        .addItem(TableCmItems.PREVIEW)
        .addItem(TableCmItems.EDIT_DOCUMENT)
        .addItem(TableCmItems.HISTORY_LIST)
        .addSeparator()
        .addItem(TableCmItems.CLONE_DOCUMENT.extend({
          title: this.$t('actions.clone_invoice')
        }))
        .addItem(TableCmItems.PRINT_DOCUMENT.extend({
          title: this.$t('actions.print_invoice')
        }))
        .addSeparator()
        .addItem(TableCmItems.ENTER_PAYMENT)
        .addSeparator({
          filter(builder) {
            return !builder.selectedMoreThanOneRow()
          }
        })
        .addItem(TableCmItems.ARCHIVE)
        .addItem(TableCmItems.UNARCHIVE)
        .addItem(TableCmItems.DELETE)
        .addItem(TableCmItems.RECOVER)
    },

    filterBy() {
      return [
        IsActiveFilter,
        IsArchivedFilter,
        IsDeletedFilter,
        { type: 'separator' },
        IsDraftFilter,
        IsSentFilter,
        IsViewedFilter,
        IsPartialFilter,
        IsPaidFilter,
        IsOverdueFilter,
        { type: 'separator' },
        CurrenciesFilter.make(this.currencies),
        { type: 'separator' },
        ClientsFilter.make(this.clients),
        InvoiceProductsFilter.make(this.products)
      ]
    },

    clients() {
      const clients = this.$store.getters[`table/${this.name}/activeItems`]
        .map((invoice) => invoice.client)
        .filter((client) => client)

      return this.filterAndOrder(clients, {
        filterBy: 'uuid',
        orderBy: 'name'
      })
    },

    currencies() {
      const currencies = this.$store.getters[`table/${this.name}/activeItems`]
        .map((invoice) => invoice.currency)
        .filter((currency) => currency)

      return this.filterAndOrder(currencies, {
        filterBy: 'code',
        orderBy: 'name'
      })
    },

    products() {
      let products = []

      // Get all invoices products
      this.$store.getters[`table/${this.name}/activeItems`].forEach((invoice) => {
        if (!invoice.items) {
          return
        }
        invoice.items.forEach((item) => {
          if (!item.product) {
            return
          }
          products.push(item.product)
        })
      })

      return this.filterAndOrder(products, {
        filterBy: 'uuid',
        orderBy: 'name'
      })
    }
  },

  methods: {
    create() {
      this.createDocument('invoice')
    },

    edit(data) {
      this.editDocument(data, 'invoice')
    }
  }
}
</script>