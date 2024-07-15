// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  
  apiUrl: 'https://apidev2.digicoffer.com/professional',
  //apiUrl: 'http://localhost:9000/cors/professional',
  paymentgatway:"https://dev2.payment.digicoffer.com/",
  emailApi:"https://dev.utils.mail.digicoffer.com/api/v1",
  doc2pdf:"https://dev.utils.doc2pdf.digicoffer.com/api/v1/doc2pdf",
  DOC2FILE :'https://dev.utils.doc2pdf.digicoffer.com/api/v1/docfile2pdf',
  xmppDomain: 'devchat.vitacape.com',
  chatops:' https://dev.utils.chat.digicoffer.com',
  lateXAPI: 'https://devapi.latex.digicoffer.com',
  AVChat:'https://dev.testavchat.digicoffer.com/',
  product: 'lauditor',
  production: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
