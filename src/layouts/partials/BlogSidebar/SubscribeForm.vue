<template>
  <un-form
    form-name="email-subscribe"
    :payload="payload"
    :error-message="content.errorMessage"
    :success-message="content.successMessage">

    <un-input
      v-model="payload.email"
      id="email"
      input-name="email"
      type="email"
      :required="true"
      :label="content.emailInput.label"
      :validation-message="content.emailInput.validationMessage"
    />

    <button
      class="un-button un-button--link"
      type="submit">
      <span
        class="u-font--bold"
        v-text="content.submitButtonLabel"
      />
    </button>

  </un-form>
</template>

<script>
  import Form from '~/components/Form'
  import Input from '~/components/Input'

  export default {
    props: {
      content: { type: Object, default: null },
    },
    data() {
      return {
        payload: {
          email: null,
        }
      }
    },
    components: {
      'un-form': Form,
      'un-input': Input,
    },
  }
</script>

<style lang="scss">
  // intentionally blank
</style>
