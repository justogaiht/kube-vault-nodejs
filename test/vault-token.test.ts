import { Vault } from "../src";
import { VaultConfig } from "../src/vault.config";

const tokenConfigInvalid: VaultConfig = {
  auth:'TOKEN',
  url: ''
} as VaultConfig;

const tokenConfigValid: VaultConfig = {
  auth:'TOKEN',
  url: 'https://192.168.0.23:8200',
  token:'HMcBB7KqGY7PQRKQWVQnQw5E'
} as VaultConfig;

test('Default Token AUTH: Invalid Token', () => {
  let vault: Vault = new Vault( tokenConfigInvalid);
  expect( () => { vault.init() } ).toThrow(Error);
});

test('Default Token AUTH: Valid Token', () => {
  let vault: Vault = new Vault( tokenConfigValid);
  expect( () => { vault.init() } ).toBeTruthy();
});

it('Default Token AUTH: Read a secret', () => {
  let vault: Vault = new Vault( tokenConfigValid);
  vault.init();

  expect.assertions(1);

  return expect(  
    vault.getSecret('foo')
  ).resolves.toEqual('bar');
});