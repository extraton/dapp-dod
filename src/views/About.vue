<template>
  <v-card class="about">
    <v-card-title>About</v-card-title>
    <v-card-text>
      <div>
        ExtraTON.Dod is decentralized application (DApp) made by
        <a href="https://extraton.io" target="_blank">extraton.io</a> team.
        <br/>The DApp helps you easily and securely sign Declaration of Decentralization in FreeTON network.
        <br/>It's non-commercial, <a href="https://github.com/extraton/dapp-dod" target="_blank">open-source</a>
        project.
        <br/>In order to use DApp install
        <a href="https://chrome.google.com/webstore/detail/extraton/hhimbkmlnofjdajamcojlcmgialocllm" target="_blank">
          extraTON extension
        </a> to your Google Chrome browser.
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data: () => ({}),
}
</script>

<style lang="scss">
.about {
  .v-card__text > div:not(:first-child) {
    margin-top: 20px;
  }
}
</style>
