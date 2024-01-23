/* eslint-disable prettier/prettier */
import { Module, Global } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { serviceAccountParams } from './serviceAccountParams';



@Global()
@Module({
    providers: [
        {
            provide: 'FIREBASE_ADMIN',
            useValue: admin.initializeApp({
                credential: admin.credential.cert(serviceAccountParams),
                databaseURL: `https://${serviceAccountParams.projectId}.firebaseio.com`,
                storageBucket: `gs://${serviceAccountParams.projectId}.appspot.com`,
            }),
        },
    ],
    exports: ['FIREBASE_ADMIN'],
})
export class FirebaseModule { }
