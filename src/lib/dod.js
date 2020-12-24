import ton from '@/lib/ton';
import abi from '@/contracts/dodDebot.abi.json';
import freeton from 'freeton';

const _ = {
  address: '0:52a955ec2c5a80cf6a4c42c9ec00dcb70fde2bd319d88e38edd5013749978113',
  getProvider() {
    return new freeton.providers.ExtensionProvider(window.freeton);
  }
}

export default {
  async getSigners() {
    const data = await ton.getAddressData(_.address);
    const getSignaturesMessage = await ton.encodeGetMessage(abi, _.address, 'signers');
    return (await ton.runTvm(abi, data.boc, getSignaturesMessage.message)).signers;
  },
  async sign() {
    const provider = _.getProvider();
    const signer = await provider.getSigner();
    const wallet = signer.getWallet();
    const payload = (await ton.encodeMessageBody(abi, 'sign')).body;
    const contractMessageProcessing = await wallet.transfer(_.address, '1000000000', true, payload);
    await contractMessageProcessing.wait();
  },
  async isSigned(signatures) {
    if (!await ton.isExtensionAvailableWithMinimalVersion()) {
      return false;
    }
    const provider = _.getProvider();
    const signer = await provider.getSigner();
    const wallet = signer.getWallet();
    const address = wallet.getAddress();
    return signatures[address] === true;
  }
}
