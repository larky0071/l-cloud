import { useState } from 'react';

function App() {
  const [state, setState] = useState<{ selectedFile: null | File[] }>({
    selectedFile: null,
  });

  // On file select (from the pop up)
  const onFileChange = (event: any) => {
    // Update the state

    const files: null | File[] = state.selectedFile || [];

    for (const file of event.target.files) files.push(file);

    setState({ selectedFile: files });

    //console.log(state.selectedFile?.length);
  };

  // On file upload (click the upload button)
  const onFileUpload = () => {
    // Create an object of formData
    const formData = new FormData();
    // Update the formData object

    // formData.append(
    //   "myFile",
    //   state.selectedFile,
    //   state.selectedFile.name
    // );

    // Details of the uploaded file
    console.log('=>', state.selectedFile);

    // Request made to the backend api
    // Send formData object
    //axios.post("api/uploadfile", formData);
  };

  const sliceFileData = () => {
    const file = state.selectedFile![state.selectedFile!.length - 1] && state.selectedFile![state.selectedFile!.length - 1];
    console.log('file slice starting => ', file.name);
    const chunks = [];
    const chunkSize = 1024 * 1024; // 1 MB (adjust as needed)
    let start = 0;
    let loopCount = 0;
    let end = Math.min(chunkSize, file.size);

    console.log('file size => ', file.size);

    while (start < file.size) {
      console.log('end (chunkSize, file.size) => ', end, chunkSize, file.size);
      loopCount++;
      console.log('file slicing loop ' + loopCount);
      const blob = file.slice(start, end);

      start = end;
      end = Math.min(start + chunkSize, file.size);

      chunks.push(blob);
      if (loopCount > 1000) break;
    }

    console.log(chunks);

    return chunks;
  };

  const fileConcatenate = (blobs: Blob[]) => {
    var file = new Blob(blobs);
    return file;
  };

  // File content to be displayed after
  // file upload is complete
  const fileData = () => {
    if (state.selectedFile) {
      return (
        <div>
          <h2>File Details:</h2>
          <p>File Name: {state.selectedFile[state.selectedFile.length - 1].name}</p>

          <p>File Type: {state.selectedFile[state.selectedFile.length - 1].type}</p>

          <p>Last Modified: {new Date(state.selectedFile[state.selectedFile.length - 1].lastModified).toDateString()}</p>
        </div>
      );
    } else {
      return (
        <div>
          <br />
          <h4>Choose before Pressing the Upload button</h4>
        </div>
      );
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
      <div>
        <h1>File Upload using React!</h1>
        <div>
          <input type="file" onChange={onFileChange} />
          <button onClick={onFileUpload}>Upload!</button>
        </div>
        {fileData()}
      </div>
      <div>
        {state.selectedFile && (
          <img style={{ maxHeight: '400px', maxWidth: '400px' }} src={URL.createObjectURL(state.selectedFile![state.selectedFile.length - 1])}></img>
        )}
      </div>
      <div>
        <h1 style={{ textAlign: 'center' }}>{'=>'}</h1>
      </div>
      <div>
        {state.selectedFile && (
          <img
            style={{
              textAlign: 'center',
              maxHeight: '400px',
              maxWidth: '400px',
            }}
            src={URL.createObjectURL(fileConcatenate(sliceFileData()))}
          ></img>
        )}
      </div>
    </div>
  );
}

export default App;
