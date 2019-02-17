import { VaultConfig } from "./vault.config";
import * as request  from "request-promise";
import { Options, OptionsWithUrl } from "request";

export class VaultService {

    private vaultConfig: VaultConfig;
    private vaultToken: string = '';

    private readonly secretApi: string = '/v1/secret/data/';
    private readonly kubernetesApi: string = '/auth/kubernetes/login';

    constructor( vaultConfig: VaultConfig){
        this.vaultConfig = vaultConfig;
    }

    public login(){
        switch(this.vaultConfig.auth) {
            case '':
            case undefined:
                throw new Error('Auth Method must be specified!!');
                break;
            case 'TOKEN': 
                if(!this.vaultConfig.token){
                    throw new Error('With AUTH=TOKEN, vault token must be supplied');
                }

                this.vaultToken = this.vaultConfig.token;
                break;
            case 'KUBERNETES':
                throw 'Not Implemented!';
                break;
            case 'OPENSHIFT':
                throw 'Not Implemented!';
                break;
        }
    }

    public getSecret( secretPath: string ): Promise<string> {
        return new Promise( (resolve,reject) => {
            request(this.getRequest(secretPath)).then(
                (result)=>{
                    let json = JSON.parse(result);
                    console.log(result);
                    console.log(json.data);
                    resolve('bar');
                }
            ).catch(
                (err)=>{
                    console.log(err);
                    reject(err);
                }
            );
        } );
        
    }

    private getRequest(secretPath: string){
        let options : OptionsWithUrl =  {} as OptionsWithUrl

        options.url= this.vaultConfig.url + this.secretApi + secretPath;
        options.method = 'GET';
        options.rejectUnauthorized = false;
        options.headers = this.getHeader()

        return options;
    }

    private getHeader() : Headers{
        let header:any = {}
        header['X-Vault-Token']=this.vaultToken;
        
        return header as Headers;
    }



}