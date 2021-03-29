import React from "react";
import { useMutation, gql } from "@apollo/client";

const SINGLE_UPLOAD = gql`
  mutation SingleUpload($file: Upload!) {
    singleUpload(file: $file) {
      url
    }
  }
`;

export default function UploadForm() {
  const [singleUpload] = useMutation(SINGLE_UPLOAD, {
    onCompleted: (data) => console.log(data),
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    singleUpload({ variables: { file } });
  };

  return (
    <div>
      <h1>Upload File</h1>
      <input type="file" onChange={handleFileChange} />
    </div>
  );
}
