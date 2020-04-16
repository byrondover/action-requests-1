import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import * as hash from 'object-hash';

import { Upload } from './upload.model';
import { async } from '@angular/core/testing';

@Injectable()
export class UploadService {
  private basePath = '/uploads';

  constructor() {}

  push(upload: Upload) {
    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef
      .child(`${this.basePath}/${upload.name}`)
      .put(upload.file);

    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot: any) => {
        // upload in progress
        upload.progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        // upload failed
        console.log(error);
      },
      (): any => {
        // upload success

        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          upload.url = downloadURL;
        });
      }
    );
  }
}
