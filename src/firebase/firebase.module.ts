/* eslint-disable prettier/prettier */
import { Module, Global } from '@nestjs/common';
import * as admin from 'firebase-admin';
// import { serviceAccountParams } from './serviceAccountParams';
import * as params from "./firebase_service_account.json"


export const firebaseParams = {
    type: params.type,
    projectId: params.project_id,
    privateKeyId: params.private_key_id,
    privateKey: params.private_key,
    clientEmail: params.client_email,
    clientId: params.client_id,
    authUri: params.auth_uri,
    tokenUri: params.token_uri,
    authProviderX509CertUrl: params.auth_provider_x509_cert_url,
    clientC509CertUrl: params.client_x509_cert_url
}

@Global()
@Module({
    providers: [
        {
            provide: 'FIREBASE_ADMIN',
            useValue: admin.initializeApp({
                credential: admin.credential.cert(firebaseParams),
                databaseURL: `https://${firebaseParams.projectId}.firebaseio.com`,
                storageBucket: `gs://${firebaseParams.projectId}.appspot.com`,
            }),
        },
    ],
    exports: ['FIREBASE_ADMIN'],
})
export class FirebaseModule { }
