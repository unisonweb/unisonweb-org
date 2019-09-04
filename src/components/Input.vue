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
      v-validate="rules"
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

    <ul
      v-if="errors.collect(inputName)"
      class="un-input__errors__container">
      <li
        v-for="(error, i) in errors.collect(inputName)" :key="i"
        v-text="error.validationMessage"
      />
    </ul>

  </div>
</template>

<script>
  import isEmpty from 'lodash.isempty'
  import set from 'lodash.set'

  export default {
    props: {
      value: { type: String, default: null },
      label: { type: String, default: null },
      id: { type: String, default: null },
      type: { type: String, default: 'text' },
      inputName: { type: String, default: null },
      disabled: { type: Boolean, default: false },
      required: { type: Boolean, default: false },
      validationMessage: { type: String, default: null },
    },
    data() {
      return {
        input: null,
        rulesArray: [],
      }
    },
    computed: {
      rules() {
        return this.rulesArray.join('|')
      },
    },
    watch: {
      input(v) {
        this.$emit('input', v)
      },
      value(v) {
        this.input = v
      },
    },
    created() {

      // update the v-model
      this.input = this.value

      // create rules
      const dict = {}

      if (this.required) {
        this.rulesArray.push('required')
        set(dict, `custom[${this.inputName}].required.validationMessage`, this.validationMessage)
      }

      if (this.type === 'email') {
        this.rulesArray.push('email')
        set(dict, `custom[${this.inputName}].email.validationMessage`, this.validationMessage)
      }

      if (!isEmpty(dict)) {
        this.$validator.localize('en', dict)
      }

    },
    mounted() {

      this.$refs['input'].addEventListener('focus', () => {
        this.$emit('focus')
      }, false)

      this.$refs['input'].addEventListener('blur', () => {
        this.$emit('blur')
      }, false)

    }
  }
</script>

<style lang="scss">

  $verticalPadding: rem(0);
  $horizontalPadding: rem(0);
  $fontSize: rem(0);
  $labelSize: rem(-3);

  .un-input__wrapper {
    $this: &;
    position: relative; // for positioning __label
    width: 100%;
    font-size: rem(0);
  }

  .un-input {
    $this: &;

    @include reset-input;

    // default styling
    width: 100%;
    padding:
      ($verticalPadding + ($labelSize * 2/3))
      $horizontalPadding
      ($verticalPadding - ($labelSize * 2/3));

    color: palette(black);
    font-family: font(system);
    font-size: $fontSize;

    border-radius: 8px;
    border-width: 0;
    border-style: solid;
    border-color: palette(gray, x-light);
    background-color: palette(gray, xxx-light);

    &:focus {
      outline: none;
      background: none;
      border-color: palette(blue, xx-light);
      background-color: palette(blue, xxx-light);
    }
  }

  .un-input__label {
    position: absolute;
    z-index: 0; // keep this below .un-input
    top: $verticalPadding;
    left: $horizontalPadding;

    color: palette(gray);
    font-family: font(sans);
    line-height: line-height(base);

    transition:
      font-size .1s ease-in-out,
      transform .1s ease-in-out;
    font-size: $fontSize;
    transform: translate3d(0, 0, 0);

    @at-root {

      .un-input:focus ~ &,
      .un-input.is-dirty ~ & {
        transform: translate3d(0, -#{$labelSize * 2/3}, 0);
        font-size: $labelSize;
      }
    }
  }

  .un-input__errors__container {

    @at-root ul#{&} {
      // <ul> reset
      margin: 0;
      padding: 0;
      list-style: none;

      color: palette(pink);
      line-height: line-height(base);

      font-size: $labelSize;
      text-align: left;

      &:empty {
        display: none;
      }

      > li {
        // <li> reset
        margin-top: (rem(-3) * 1/2);
      }
    }
  }

</style>
