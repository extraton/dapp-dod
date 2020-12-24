<template>
  <div>
    <v-dialog v-model="dialogInstall" max-width="500">
      <v-card>
        <v-card-title>
          Install extraTON extension
        </v-card-title>
        <v-card-text>
          <p>In order to sign you need to install extraTON extension with minimal version 0.5.0.</p>
          <p>Go to <a href="https://chrome.google.com/webstore/detail/extraton/hhimbkmlnofjdajamcojlcmgialocllm"
                      target="_blank">Chrome Store</a>.</p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialogInstall = false" color="primary" text>ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card class="home">
      <v-card-title>Sign FreeTON Declaration of Decentralization</v-card-title>
      <v-card-text>
        <div class="home__signatures text-center text-h3">
          <div>Signatures:</div>
          <div>
            <span v-if="null!==signatures">{{ signatures }}</span>
            <v-skeleton-loader v-else class="home__signatures__skeleton" type="heading" width="55"/>
          </div>
        </div>
        <div class="home__declaration" v-html="declaration"/>
        <div v-if="null===signatures" class="text-center">
          <v-progress-circular color="primary" indeterminate/>
        </div>
        <div v-else-if="signed" class="home__signed text-center">
          <div>
            <div>
              <v-icon color="primary" large>mdi-hand-peace</v-icon>
            </div>
            <div class="text-h6">Congratulations!</div>
          </div>
          <div>
            <div class="body-1">You signed declaration of decentralization!</div>
          </div>
        </div>
        <div v-else class="home__sign text-center">
          <v-btn @click="sign" :loading="signing" color="primary">
            <v-icon left>mdi-draw</v-icon>
            sign
          </v-btn>
          <div class="home__sign__cost text-caption">(1 TON + fee)</div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import showdown from 'showdown';
import dod from "@/lib/dod";
import declaration from "@/declaration";
import utils from '@/lib/utils';

export default {
  data: () => ({
    declaration: '',
    signatures: null,
    signers: [],
    dialogInstall: false,
    signing: false,
    signed: false,
  }),
  async mounted() {
    const showdownConverter = new showdown.Converter();
    this.declaration = showdownConverter.makeHtml(declaration);
    await this.loadSignatures();
  },
  methods: {
    async sign() {
      this.signing = true;
      try {
        if (!await utils.isExtensionAvailableWithMinimalVersion()) {
          this.dialogInstall = true;
        } else {
          await dod.sign();
          this.signed = true;
          this.signatures++;
        }
      } catch (e) {
        console.error(e);
        if (e.code !== 1000/*Canceled by user*/) {
          this.$snack.danger({text: undefined !== e.text ? e.text : 'Unknown error'})
        }
      } finally {
        this.signing = false;
      }
    },
    async loadSignatures() {
      this.signatures = null;
      this.signers = await dod.getSigners();
      this.signed = await dod.isSigned(this.signers);
      this.signatures = Object.keys(this.signers).length;
    },
  },
}
</script>
<style lang="scss">
.home {
  &__signatures {
    margin: 25px 0;
    display: flex;
    justify-content: center;

    > div:first-child {
      padding-right: 15px;
    }

    &__skeleton {
      padding-top: 15px;

      .v-skeleton-loader__heading {
        width: 100% !important;
      }
    }

    span {
      color: #2096f3;
    }
  }

  &__declaration {
    margin: 50px auto 30px;
    width: 97%;
    border: 1px solid #555555;
    border-radius: 4px;
    padding: 5px 12px;
    height: 300px;
    overflow: auto;
  }

  &__sign {
    &__cost {
      margin-top: 5px;
    }
  }

  &__signed {

  }
}
</style>
