import { VaultConfig } from './vault.config';
import { VaultService } from './vault.service';

export class Vault {

    private vaultConfig: VaultConfig;
    private vaultService: VaultService;

    private vaultToken: string = '';

    constructor( _vaultConfigJson: VaultConfig ) {
        this.vaultConfig = _vaultConfigJson;
        this.vaultService = new VaultService(this.vaultConfig);
    }

    public init() : Boolean {
        console.log('Initialize vault service');
        this.vaultService.login();
        return true;
    }

    public getSecret(secretPath: string) {
        return this.vaultService.getSecret(secretPath);
    }


}
