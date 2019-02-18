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

    public readSecrets() : Promise<Map<string,string>>{
        
        return new Promise<Map<string,string>> (
            (resolve, reject) =>{

                let resultMap : Map<string,string> = new Map<string,string>();
        
                this.vaultConfig.secrets.forEach( (secret, idx) => {
                    let path =
                        secret.lastIndexOf('.') > 0 ? secret.substr(0,secret.lastIndexOf('.')) : secret;
        
                    let key = secret.lastIndexOf('.') > 0 ? secret.substr(secret.lastIndexOf('.')) : secret;
        
                    console.log('Lookup secret ' + path + ', key:' + key);
        
                    this.getSecret(path).then(
                        secretData => {
                            console.log(secretData);
                            resultMap.set(path+'.'+key, secretData);


                            if(idx === this.vaultConfig.secrets.length - 1 ){
                                resolve(resultMap);
                            }
                        }
                    )
        
        
                    
                    
                });

                

            }
        );
        
        
    }

    private getSecret(secretPath: string) {
        return this.vaultService.getSecret(secretPath);
    }


}
