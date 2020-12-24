set -e

rm -rf build
mkdir build
cd ./build
git clone git@github.com:extraton/dapp-dod.git .
git checkout "${1}"
yarn install
yarn run build
docker build -f ../deploy/Dockerfile -t docker.pkg.github.com/extraton/dapp-dod/dapp-dod-nginx:${1}  .
docker push docker.pkg.github.com/extraton/dapp-dod/dapp-dod-nginx:${1}
cd ../
rm -rf build
