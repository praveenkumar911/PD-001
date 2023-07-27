import React, { useEffect, useState } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { Container, Paper, Typography, Backdrop, Button } from '@mui/material';
import axios from 'axios';
import AWS from 'aws-sdk'; // Import the AWS SDK

// Update these values with your MinIO configuration
const minioEndpoint = 'http://10.8.0.15:9000'; 
const accessKey = 'minioadmin';
const secretKey = 'Minio@0710';
const bucketName = 'rcts-audio-data-ncert';

AWS.config.update({
  accessKeyId: accessKey,
  secretAccessKey: secretKey,
  endpoint: minioEndpoint,
  s3ForcePathStyle: true,
  signatureVersion: "v4"
});

const s3 = new AWS.S3();

const minioUploader = async (file, fileName) => {
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: file,
    ContentType: 'audio/wav'
  };

  try {
    await s3.putObject(params).promise();
  } catch (error) {
    // Handle any error that might occur during the upload process
    console.error('Error uploading to MinIO:', error);
    throw error;
  }
};

export default function Recorder(props) {
  const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({
    video: false,
    audio: true,
    askPermissionOnMount: true,
  });
  const [uploaded, setUploaded] = useState(false);
  const nextPrompt = () => {
    setUploaded(!uploaded);
    // window.location.reload();
    props.handleRefresh();
  };

  const generateFileName = () => {
    const timestamp = new Date().getTime();
    return `audio_${timestamp}.wav`;
  };

  const handleUpload = async () => {
    const audioBlob = await fetch(mediaBlobUrl).then((r) => r.blob());
    const fileName = generateFileName(); // Generate a unique file name
    await minioUploader(audioBlob, fileName); // Use MinIO uploader with the unique file name
    setUploaded(!uploaded);
  };

  let session_name = sessionStorage.getItem('name');
  let session_mobile = sessionStorage.getItem('mobile');

  useEffect(() => {
    const UploadMinIO_db = async () => {
      if (uploaded) {
       // await fetch(`http://localhost:5601/insert_audio_url/${props.id}`, {
           await fetch(`https://pl-api.iiit.ac.in/rcts/speech-collection/insert_audio_url/${props.id}`,{
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify({
            url: `${minioEndpoint}/${bucketName}`, // Use the MinIO URL without the file name
            name: session_name,
            mobile: session_mobile,
            fileName: generateFileName(), // Pass the unique file name to the server
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }).catch((err) => {
          console.log(err);
        });
      }
    };
    UploadMinIO_db();
  }, [uploaded, props.id]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '2em',
        marginTop: '2em',
      }}
    >
      <p style={{ fontFamily: 'courier', fontSize: '11px' }}>Recorder is <b>{status}</b> </p>
      <div>
        {status === 'recording' ? (
          <Button variant="outlined" onClick={stopRecording} style={{ marginLeft: '10px', marginRight: '10px', cursor: 'pointer' }}>Stop</Button>
        ) : (
          <Button variant="outlined" color="error" onClick={startRecording} style={{ marginLeft: '10px', marginRight: '10px', cursor: 'pointer' }}>Record</Button>
        )}
        {status === 'stopped' && (
          <Button variant="contained" color="success" onClick={handleUpload} style={{ marginLeft: '10px', marginRight: '10px', cursor: 'pointer' }}>Upload</Button>
        )}
      </div>
      <div>
        {status === 'stopped' && (
          <audio style={{ marginTop: '15px', marginBottom: '0px', border: 'red' }} src={mediaBlobUrl} controls></audio>
        )}
      </div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={uploaded}
        onClick={() => { nextPrompt(); }}
      >
        <Paper elevation={0} variant="outlined" style={{ justifyContent: 'center', alignItems: 'center', padding: '2em', backgroundColor: '#A5F1E9', borderRadius: '8px' }}>
          <Typography variant='caption' align='center' style={{ color: '#111436' }}>
            <h2>Upload Successful !</h2>
          </Typography>
        </Paper>
      </Backdrop>
    </div>
  );
}
