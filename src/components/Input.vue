<template>
  <div class="un-input__wrapper">

    <input
      ref="input"
      class="un-input"
      :type="type"
      :id="id"
      :name="inputName"
      :required="required"
      :disabled="disabled"
      v-model="input"
    />

    <label
      v-if="label"
      class="un-input__label"
      :for="id">
      <span
        class="u-truncate"
        v-html="label"
      />
    </label>

    <slot />

  </div>
</template>

<script>
  export default {
    props: {
      value: { type: String, default: null },
      label: { type: String, default: null },
      id: { type: String, default: null },
      type: { type: String, default: 'text' },
      inputName: { type: String, default: null },
      disabled: { type: Boolean, default: false },
      required: { type: Boolean, default: false },
    },
    data() {
      return {
        input: null,
      }
    },
    watch: {
      input(v) {
        const vm = this

        vm.$emit('input', v)
      },
      value(v) {
        const vm = this

        vm.input = v
      },
    },
    created() {
      const vm = this

      vm.input = vm.value
    },
    mounted() {
      const vm = this

      vm.$refs['input'].addEventListener('focus', () => {
        vm.$emit('focus')
      }, false)

      vm.$refs['input'].addEventListener('blur', () => {
        vm.$emit('blur')
      }, false)

    }
  }
</script>

<style lang="scss">

  $paddingTop: rem(0);
  $paddingHorizontal: 0;
  $fontSize: rem(1);
  $labelSize: rem(-1);

  .un-input__wrapper {
    $this: &;
    position: relative; // for positioning __label
    width: 100%;

    display: flex;
    align-items: stretch;
    flex-wrap: nowrap;
    justify-content: space-between;
  }

  .un-input {
    $this: &;

    @include reset-input;

    // keep this above the __label
    // so that <select> elements can
    // be clicked
    position: relative;
    z-index: 2;

    // default styling
    width: 100%;
    padding:
      ($paddingTop + ($labelSize * 1/2))
      $paddingHorizontal
      ($paddingTop - ($labelSize * 1/2));

    color: inherit;
    font-size: $fontSize;

    &:focus {
      outline: none;
      background: none;
    }
  }

  .un-input__label {
    position: absolute;
    z-index: 0; // keep this below .un-input
    top: $paddingTop;
    left: $paddingHorizontal;

    font-family: font(bold);
    line-height: line-height(base);

    transition:
      font-size .1s ease-in-out,
      transform .1s ease-in-out;
    font-size: inherit;
    transform: translate3d(0, 0, 0);

    @at-root {

      .un-input:focus ~ &,
      .un-input.is-dirty ~ & {
        transform: translate3d(0, -#{ms(-3) / ms(0) * 100%}, 0);
        font-size: $labelSize;
      }
    }
  }

</style>
