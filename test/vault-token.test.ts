import { Vault } from '../src';
import { VaultConfig } from '../src/vault.config';

const tokenConfigInvalid: VaultConfig = {
  auth: 'TOKEN',
  url: ''
} as VaultConfig;

const tokenConfigValid: VaultConfig = {
  auth: 'TOKEN',
  url: 'https://192.168.0.23:8200',
  token: 'HMcBB7KqGY7PQRKQWVQnQw5E',
  secrets: [
    'myplainsecret.token',
    'mySecretFolder/app.pass',
    'mySecretFolder/app.token'
  ]
} as VaultConfig;

const tokenConfigValidKubernetes: VaultConfig = {
  auth: 'KUBERNETES',
  url: 'https://192.168.0.23:8200',
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

it('Default Token AUTH: Invalid Token', () => {
  const vault: Vault = new Vault( tokenConfigInvalid);

  expect.assertions(1);

  return expect( vault.init() ).rejects.toEqual('With AUTH=TOKEN, vault token must be supplied');
});

test('Default Token AUTH: Valid Token', () => {
  const vault: Vault = new Vault( tokenConfigValid);
  expect( () => vault.init() ).toBeTruthy();
});

it('Default Token AUTH: Read a secret', () => {
  const vault: Vault = new Vault( tokenConfigValid);
  vault.init();

  expect.assertions(1);

  return expect(
    vault.readSecrets()
  ).resolves.toBeDefined();
});

it('Kubernetes as Backend Auth', async () => {
  expect.assertions(1);

  const vault: Vault = new Vault( tokenConfigValidKubernetes);
  const init = await vault.init();

  return expect ( vault.readSecrets() ).resolves.toBeDefined();

});
