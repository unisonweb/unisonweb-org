<template>
  <div
    ref="formWrapper"
    class="un-form__wrapper u-invisible animated fadeIn">

    <vue-simple-markdown
      v-show="showErrorMessage && errorMessage"
      class="un-form__error-message"
      :source="errorMessage"
    />

    <ValidationObserver
      tag="form"
      ref="observer"
      v-slot="{ invalid }"
      v-show="!showSuccessMessage"
      class="un-form"
      :name="formName"
      @submit.prevent="handleSubmit"
      :data-netlify="($isServer) ? true : false"
      :netlify-honeypot="($isServer) ? 'url' : null">

      <input
        v-show="false"
        type="text"
        name="url"
      />

      <slot />

    </ValidationObserver>

    <vue-simple-markdown
      v-show="showSuccessMessage && successMessage"
      class="un-form__success-message"
      :source="successMessage"
    />

  </div>
</template>

<script>
  import { ValidationObserver } from 'vee-validate'

  export default {
    props: {
      formName: { type: String, default: null },
      payload: { type: Object, default: null },
      errorMessage: { type: String, default: null },
      successMessage: { type: String, default: null },
    },
    data() {
      return {
        isLoading: true,
        showErrorMessage: false,
        showSuccessMessage: false,
      }
    },
    methods: {
      async handleSubmit() {
        const isValid = await this.$refs['observer'].validate()

        if (!isValid) {
          return
        }

        // fetch('/', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        //   body: this.encode({
        //     'form-name': this.formName,
        //     ...this.payload
        //   })
        // }).then(() => {
          this.showSuccessMessage = true
          this.$emit('success')
        // }).catch((err) => {
        //   console.err(err)
        //   this.showErrorMessage = true
        // })

      },
      encode(data) {
        return Object.keys(data)
          .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
          .join('&')
      }
    },
    mounted() {
      this.isLoading = false
      this.$refs['formWrapper'].classList.remove('u-invisible')
    },
    components: {
      ValidationObserver,
    },
  }
</script>

<style lang="scss">

  .un-form__wrapper {
    // intentionally blank
  }

  .un-form {

    .un-input__wrapper {
      margin-bottom: (rem(3) * 1/2);
    }
  }

  .un-form__error-message,
  .un-form__success-message {
    padding: (rem(0) * 2);

    font-weight: weight(bold);
    text-align: center;
  }

  .un-form__error-message {
    margin-bottom: rem(4);

    color: palette(white);
    background-color: palette(pink);
  }

  .un-form__success-message {
    color: palette(green, xx-dark);
    background-color: palette(green, x-light);
  }

</style>