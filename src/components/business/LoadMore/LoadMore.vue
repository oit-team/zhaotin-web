<template>
  <div class="vc-load-more">
    <div :style="`height: 1px; width: 100%; background: red; position: absolute; transform: translateY(-${offset}px)`"></div>
    <div ref="trigger" class="vc-load-more__trigger"></div>
    <div class="vc-load-more__tips">
      <div :class="statusClass" class="vc-load-more__status" @click="onClick">
        <slot v-bind="scope"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export const LOAD_STATUS = {
  INACTIVE: 0,
  LOADING: 1,
  DONE: 2,
  FAIL: 3,
}

export default {
  name: 'LoadMore',

  props: {
    offset: {
      type: Number,
      default: 300,
    },
    firstLoad: Boolean,
  },

  data: () => ({
    status: 0,
    active: false,
  }),

  computed: {
    scope() {
      return {
        status: this.status,
        ...this.booleanStatus,
      }
    },
    booleanStatus() {
      return {
        inactive: this.status === LOAD_STATUS.INACTIVE,
        loading: this.status === LOAD_STATUS.LOADING,
        done: this.status === LOAD_STATUS.DONE,
        fail: this.status === LOAD_STATUS.FAIL,
      }
    },
    statusClass() {
      const status = Object
        .entries(this.booleanStatus)
        .find(([, value]) => value)[0]

      return `vc-load-more--${status}`
    },
  },

  mounted() {
    this.root = null
    const observer = new IntersectionObserver((entries) => {
      const canTrigger = !this.firstLoad ? this.active : true

      if (entries[0].isIntersecting && canTrigger) {
        if (this.status === LOAD_STATUS.INACTIVE || this.status === LOAD_STATUS.FAIL) {
          this.load()
        }
      }
    }, {
      root: this.root,
      rootMargin: `${this.offset}px`,
      threshold: [1],
    })

    observer.observe(this.$refs.trigger)

    const rootEl = this.root ?? document
    const onActive = () => {
      this.active = true
      rootEl.removeEventListener('scroll', onActive)
    }
    rootEl.addEventListener('scroll', onActive)
  },

  methods: {
    load() {
      this.status = LOAD_STATUS.LOADING

      this.$emit('load', {
        next: this.next,
        done: this.done,
        fail: this.fail,
      })
    },
    next() {
      this.status = LOAD_STATUS.INACTIVE
    },
    done() {
      this.status = LOAD_STATUS.DONE
    },
    fail() {
      this.status = LOAD_STATUS.FAIL
    },
    onClick(e) {
      if ([LOAD_STATUS.FAIL, LOAD_STATUS.INACTIVE].includes(this.status)) {
        this.load()
      }
      this.$emit('click', e)
    },
  },
}
</script>

<style scoped>

</style>
