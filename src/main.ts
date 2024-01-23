import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ConfigService } from '@nestjs/config';

// // Import firebase-admin
// import * as admin from 'firebase-admin';
// import { ServiceAccount } from 'firebase-admin';

// const firebase_params = {
//   type: serviceAccount.type,
//   projectId: serviceAccount.project_id,
//   privateKeyId: serviceAccount.private_key_id,
//   privateKey: serviceAccount.private_key,
//   clientEmail: serviceAccount.client_email,
//   clientId: serviceAccount.client_id,
//   authUri: serviceAccount.auth_uri,
//   tokenUri: serviceAccount.token_uri,
//   authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
//   clientC509CertUrl: serviceAccount.client_x509_cert_url
// }

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // const configService: ConfigService = app.get(ConfigService);

  // // Set the config options
  // const firebaseConfig: ServiceAccount = {
  //   projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
  //   privateKey: configService
  //     .get<string>('FIREBASE_PRIVATE_KEY')
  //     .replace(/\\n/g, '\n'),
  //   clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
  // };

  // // Initialize the firebase admin app
  // admin.initializeApp({
  //   credential: admin.credential.cert(firebaseConfig),
  //   databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`,
  //   storageBucket: `${firebaseConfig.projectId}.appspot.com`,
  // });

  await app.listen(3000);
}
// export default admin;
bootstrap();
