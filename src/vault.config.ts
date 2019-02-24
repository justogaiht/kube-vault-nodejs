export interface VaultConfig {
  /**
   * The url to Vault, with schema, host and port.
   *  I.E. https://my.vault:8200
   */
  url: string;

  /**
   * Authentication Method
   *  TOKEN: Use vault policy token. You need to set token value at 'token' field.
   *  KUBERNETES: Use if you are running your nodejs app in kubernetes cluster.
   *              You must configure vault with Kubernetes Auth.
   *  OPENSHIFT: Use if you are running your nodejs app in openshift cluster.
   *              You must configure vault with Openshift Auth.
   */
  auth: string;

  /**
   * Use if you defined Auth Method as TOKEN
   */
  token: string;

  kubernetes: {
    service: string | 'kubernetes';
    serviceAccount: string | 'default';
  };

  /**
   * List of all secrets your application will need.
   * These secrets are loaded at application startup and stored in a plain map.
   * I.E.
   *  Secrets in Vault:
   *   secret/mysecret
   *     key1: val1
   *     key2: val2
   *     key3: val3
   *   secret/other/secret:
   *     otherKey: otherValue
   *
   *  Lookup secrets list:
   *   ['mysecret.key1','mysecret.key2','other/secret.otherKey']
   *
   *  Lookup Map Result:
   *    {
   *      'mysecret.key1': 'val1',
   *      'mysecret.key2': 'val2'
   *      'other/secret.otherKey': 'otherValue'
   *    }
   */
  secrets: string[];
}
