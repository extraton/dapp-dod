import {TonClient} from "@tonclient/core";
import {libWeb, libWebSetup} from "@tonclient/lib-web";
import semver from "semver";
import freeton from "freeton";

libWebSetup({
  binaryURL: "/tonclient_1.4.1.wasm",
});
TonClient.useBinaryLibrary(libWeb);

const _ = {
  client: null,
  provider: null,
  async getClient() {
    if (null === this.client ) {
      this.client = new TonClient({
        network: {
          server_address: 'main2.ton.dev'
        }
      });
    }
    return this.client;
  },
  getProvider() {
    if (typeof window.freeton === 'undefined') {
      throw 'Extension is not available';
    }
    if (null === this.provider) {
      this.provider = new freeton.providers.ExtensionProvider(window.freeton);
    }
    return this.provider;
  },
  async queryAddress(address) {
    const client = await this.getClient();
    const result = await client.net.query_collection({
      collection: 'accounts',
      filter: {id: {eq: address}},
      result: 'boc, code_hash, balance(format: DEC)',
    });
    return result.result;
  }
};

export default {
  async getAddressData(address) {
    const result = await _.queryAddress(address);
    return result[0];
  },
  async encodeGetMessage(abi, address, function_name, input = {}) {
    const client = await _.getClient();
    const signer = {type: 'None'};
    const call_set = {function_name, input};
    return await client.abi.encode_message({abi, address, call_set, signer});
  },
  async encodeMessageBody(abi, function_name, input = {}) {
    const client = await _.getClient();
    const signer = {type: 'None'};
    const call_set = {function_name, input};
    return await client.abi.encode_message_body({abi, call_set, signer, is_internal: true});
  },
  async runTvm(abi, boc, message) {
    const client = await _.getClient();
    //@TODO by doc if pass abi then run_tvm should decode message, but it doesn't occur.
    const resultOfRunTvm = await client.tvm.run_tvm({message, account: boc});
    const result = await client.abi.decode_message({abi, message: resultOfRunTvm.out_messages[0]});
    return result.value;
  },
  isExtensionAvailable() {
    return typeof window.freeton !== 'undefined';
  },
  async isExtensionAvailableWithMinimalVersion() {
    return new Promise(resolve => {
      if (!this.isExtensionAvailable()) {
        resolve(false);
      }
      const provider = _.getProvider();
      provider.getVersion().then(data => {
        const currentVersion = data.version || '0.0.0';
        resolve(semver.satisfies(currentVersion, '>=0.5.0'));
      }).catch(() => {
        resolve(false);
      });
    });
  },
  async getWallet(address) {
    const provider = _.getProvider();
    const signer = await provider.getSigner();
    return new freeton.Wallet(signer, address);
  },
}
