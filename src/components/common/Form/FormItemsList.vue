<template>
  <div>
    <div v-if="!readonly" class="items-list__new-item">
      <form-inputs-group>
        <slot name="fields" :form="form"></slot>
        <div class="field--actions">
          <button class="button button--positive" @click="addItem">ADD</button>
        </div>
      </form-inputs-group>
    </div>

    <!--
      Added items list
    -->
    <div class="items-list" :class="{ scrollable: items.length > 5 }">
      <div v-for="(item, index) in items" :key="index" class="items-list__item">
        <slot name="preview" :item="item" :index="index"></slot>
        <div v-if="!readonly" class="list-item__field field--actions">
          <div class="remove-item-btn">
            <div class="remove-item-btn__icon" @click="removeItem(item)"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="items-list__summary">
      <slot name="summary"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'form-items-list',

  props: {
    name: {
      type: String,
      default: undefined
    },

    model: {
      type: Object,
      required: true
    },

    value: {
      default: []
    },

    readonly: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      form: { ...this.model },
      items: this.value
    }
  },

  computed: {
    itemsWithoutValueText() {
      return this.items.map((item) => {
        const _item = {}

        for (let key in item) {
          if (item.hasOwnProperty(key)) {
            if (typeof item[key] === 'object' && item[key] !== null) {
              if (typeof item[key].id !== 'undefined') {
                _item[key + '_id'] = item[key].id
              } else if (typeof item[key].uuid !== 'undefined') {
                _item[key + '_uuid'] = item[key].uuid
              }
            } else {
              _item[key] = item[key]
            }
          }
        }
        return _item
      })
    }
  },

  watch: {
    items: function () {
      if (this.$parent) {
        this.$parent.$emit('input:field', {
          name: this.name,
          value: this.itemsWithoutValueText
        })
      }
    }
  },

  methods: {
    addItem() {
      const item = { ...this.form }

      this.items.push(item)
    },

    removeItem(item) {
      const index = this.items.indexOf(item)

      if (index > -1) {
        this.items.splice(index, 1)
        this.$forceUpdate()
      }
    },

    setItemAttribute(key, value) {
      this.form[key] = value
    }
  }
}
</script>

<style lang="scss">
.field--actions {
  min-width: 15%;
  margin-top: 20px;
  &.list-item__field {
    margin-top: 0;
    min-width: 10%;
  }
}
.form__inputs-group {
  display: flex;
  align-items: center;
  .field--actions {
    margin-top: 0;
  }
}
.items-list__new-item {
    margin-top: 1px;
}
.items-list.scrollable {
    padding-right: 14px;
}
</style>