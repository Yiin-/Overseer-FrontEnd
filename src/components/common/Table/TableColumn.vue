<template lang="pug">
  .column(
    :style='columnStyle'
    :class='columnClasses'
  )
    span(
      :title='getText()'
    )
      slot

</template>

<script>
export default {
  name: 'column',

  props: ['width', 'copy'],

  data() {
    return {
      justCopied: false
    }
  },

  computed: {
    columnStyle() {
      return {
        width: this.cssWidth
      }
    },

    columnClasses() {
      return {
        copied: this.justCopied
      }
    },

    cssWidth() {
      const value = parseFloat(this.width.replace('%', '')) / 100

      return `calc((100% - 63px) * ${value})`
    }
  },

  methods: {
    getText() {
      if (!this.$slots) {
        return
      }
      if (!this.$slots.default) {
        return
      }
      if (!this.$slots.default.length) {
        return
      }
      if (!this.$slots.default[0].elm) {
        return
      }
      return this.$slots.default[0].elm.textContent
    },

    onCopy: function () {
      this.justCopied = true
      setTimeout(() => {
        this.justCopied = false
      }, 500)
    },

    onError: function () {
      alert('Failed to copy texts')
    }
  }
}
</script>

<style>
.copied {
  background: #5867c2;
  color: white;
  font-weight: 600;
  transition: all 0.5s;
}
</style>