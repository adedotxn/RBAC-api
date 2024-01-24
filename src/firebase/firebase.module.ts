import { Module, Global } from '@nestjs/common'
import * as admin from 'firebase-admin'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'FIREBASE_ADMIN',
      useFactory: async (configService: ConfigService) => {
        const serviceAccountParams = {
          type: configService.get<string>('TYPE'),
          projectId: configService.get<string>('PROJECT_ID'),
          privateKeyId: configService.get<string>('PROJECT_KEY_ID'),
          privateKey: configService.get<string>('PRIMARY_KEY'),
          clientEmail: configService.get<string>('CLIENT_EMAIL'),
          clientId: configService.get<string>('CLIENT_ID'),
          authUri: configService.get<string>('AUTH_URI'),
          tokenUri: configService.get<string>('TOKEN_URI'),
          authProviderX509CertUrl: configService.get<string>(
            'AUTH_PROVIDER_X509_CERT_URL'
          ),
          clientC509CertUrl: configService.get<string>('CLIENT_X509_CERT_URL'),
        }

        return admin.initializeApp({
          credential: admin.credential.cert(serviceAccountParams),
          databaseURL: `https://${serviceAccountParams.projectId}.firebaseio.com`,
          storageBucket: `gs://${serviceAccountParams.projectId}.appspot.com`,
        })
      },
      inject: [ConfigService],
    },
  ],
  exports: ['FIREBASE_ADMIN'],
})
export class FirebaseModule { }
