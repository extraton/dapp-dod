<template>
  <v-app>
    <v-snackbar v-model="snack.isShow">{{ snack.text }}</v-snackbar>
    <v-container>
      <v-alert type="error">
        Project Closed!
        <br/>See details in official <a href="https://extraton.io" target="_blank">site</a>.
      </v-alert>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  components: {},

  data: () => ({
    search: '',
    snack: {isShow: false, text: ''},
  }),
  created() {
    this.$snack.listener = function (text) {
      this.snack.text = text;
      this.snack.isShow = false;
      this.snack.isShow = true;
    }.bind(this);
  },
};
</script>

<style>
.content {
  width: 85%;
  margin: 30px auto;
}

@media screen and (max-width: 1100px) {
  .content {
    width: 95%;
  }
}
</style>
