import { VaultConfig } from './vault.config';
import * as request from 'request-promise';
import { Options, OptionsWithUrl } from 'request';
import * as fs from 'fs';

export class VaultService {

  private vaultConfig: VaultConfig;
  private vaultToken: string = '';

  private readonly secretApi: string = '/v1/secret/';
  private readonly kubernetesApi: string = '/v1/auth/kubernetes/login';
  private readonly saTokenPath = '/var/run/secrets/kubernetes.io/serviceaccount/token';

  constructor(vaultConfig: VaultConfig) {
    this.vaultConfig = vaultConfig;
  }

  public login(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      switch (this.vaultConfig.auth) {
        case '':
        case undefined:
          reject('Auth Method must be specified!!');
          break;
        case 'TOKEN':
          if (!this.vaultConfig.token) {
            reject('With AUTH=TOKEN, vault token must be supplied');
          }

          this.vaultToken = this.vaultConfig.token;
          resolve(true);
          break;
        case 'KUBERNETES':
          // Read Token
          const content = fs.readFileSync(this.saTokenPath, 'utf8');

          // Login with role and token
          const options: OptionsWithUrl = {} as OptionsWithUrl;
          options.url = this.vaultConfig.url + this.kubernetesApi;
          options.method = 'POST';
          options.rejectUnauthorized = false;
          options.body = { role: this.vaultConfig.kubernetes.serviceAccount, jwt: content };
          options.json = true;

          request(options).then(
            (result) => {
              // Get ClientId as Token
              this.vaultToken = result.auth.client_token;
              resolve(true);
            }
          ).catch(
            (err) => {
              reject(err);
            }
          );
          break;
        case 'OPENSHIFT':
          throw new Error('Not Implemented!');
          break;
      }
    });

  }

  public getSecret(secretPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      request(this.getRequest(secretPath)).then(
        (result) => {
          const json = JSON.parse(result);
          resolve(json.data);
        }
      ).catch(
        (err) => {
          reject(err);
        }
      );
    });

  }

  private getRequest(secretPath: string): OptionsWithUrl {
    const options: OptionsWithUrl = {} as OptionsWithUrl;

    options.url = this.vaultConfig.url + this.secretApi + secretPath;
    options.method = 'GET';
    options.rejectUnauthorized = false;
    options.headers = this.getHeader();

    return options;
  }

  private getHeader(): Headers {
    const header: any = {};
    header['X-Vault-Token'] = this.vaultToken;

    return header as Headers;
  }
}
