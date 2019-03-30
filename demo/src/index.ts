import { Vault, VaultConfig } from '@ummagumma/kube-vault/dist';
import express = require('express');


// Create a new express application instance
const app: express.Application = express();

const vaultConfig: VaultConfig = {
  auth: 'KUBERNETES',
  url: 'https://192.168.1.142:8200',
  kubernetes: {
    service: 'localhost:8081',
    serviceAccount: 'default'
  },
  secrets: [
    'myplainsecret.token',
    'mySecretFolder/app.pass',
    'mySecretFolder/app.token'
  ]
} as VaultConfig;

const vaultValues  = async () => {
  let vault = new Vault(vaultConfig);
  const vaultAuth = await vault.init();
  const secretsValues = await vault.readSecrets();
  return secretsValues;
};

app.listen(3000,  async () => {
  console.log(await vaultValues());
  console.log(`Started on port 3000`);
});
