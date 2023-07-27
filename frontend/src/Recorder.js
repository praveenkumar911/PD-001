import React,{useEffect, useState} from 'react';
import { useReactMediaRecorder } from "react-media-recorder"; 
import { Container, Paper, Typography,Backdrop, Button  } from '@mui/material';
import axios from 'axios';
import { Minio } from 'minio';

var FormData = require('form-data');


export default function Recorder(props) {
    const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ video: false, audio:true, askPermissionOnMount:true });
    const [uploaded, setUploaded] = useState(false)
    const nextPrompt = () => {
        setUploaded(!uploaded);
        // window.location.reload();
        props.handleRefresh()
    }
    const minioClient = new Minio({
        endPoint: 'http://10.8.0.15',
        port: 9000,
        useSSL: false,
        accessKey: 'SEpDeVcMFcCPxSMU',
    MINIO_SECRET_KEY : "VLC6Cze0ecdFAtKK7FRvkbhTjVnPkZRu"
      });
        const s3uploader = async (file) => {
            const bucketName = 'rcts-audio-data-ncert';
            const objectName = `audio/${file.name}`;
          
            try {
              await minioClient.putObject(bucketName, objectName, file.path, (err, etag) => {
                if (err) {
                  console.error('Error uploading file to MinIO:', err);
                } else {
                  console.log('File uploaded to MinIO:', etag);
                }
              });
            } catch (error) {
              console.error('Error uploading file to MinIO:', error);
            }
          };
          const handleUpload = async () => {
            console.log("Uploading audio to MinIO...");
            const audioBlob = await fetch(mediaBlobUrl).then((r) => r.blob());
            const audioFile = new File([audioBlob], `test.wav`, { type: "audio/wav" });
            await s3uploader(audioFile);
            setUploaded(!uploaded);
          };
    let session_name = sessionStorage.getItem('name')
    let session_mobile = sessionStorage.getItem('mobile')
    useEffect(()=>{
        const UploadS3_db = async () => {
            if (uploaded)
             await fetch(`http://localhost:5601/insert_audio_url/${props.id}`,{
           // await fetch(`https://pl-api.iiit.ac.in/rcts/speech-collection/insert_audio_url/${props.id}`,{
                method:"POST",
                mode:"cors",
                body:JSON.stringify({url:props.s3url.split('?')[0],name:session_name,mobile:session_mobile}),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).catch((err)=>{console.log(err)})
        }
        UploadS3_db()
    },[uploaded, props.id,props.s3url ])
  return (

  <div style={{
    display: 'flex',
    justifyContent: 'center',
    flexDirection: "column",
    alignItems: 'center',
    marginBottom:"2em",
    marginTop:"2em"
  }}>
    <p style={{fontFamily:"courier", fontSize:"11px"}}>Recorder is <b>{status}</b> </p>
    <div>
    {status==="recording" ?
        <Button variant="outlined" onClick={stopRecording} style={{marginLeft:"10px", marginRight:"10px", cursor:"pointer"}}>Stop</Button>
        :
        <Button variant="outlined" color="error" onClick={startRecording} style={{marginLeft:"10px", marginRight:"10px", cursor:"pointer"}}>Record</Button>
    }
    {status==="stopped" &&
        <Button variant="contained" color="success" onClick={handleUpload} style={{marginLeft:"10px", marginRight:"10px", cursor:"pointer"}}>Upload</Button>
    }
    </div>
    <div>
        {status==="stopped" && 
        <audio style={{marginTop:"15px", marginBottom:"0px",border:"red"}} src={mediaBlobUrl} controls></audio>
        }
    </div>
    <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={uploaded}
            onClick={()=>{nextPrompt()}}>
            <Paper elevation={0} variant="outlined" style={{justifyContent:"center", alignItems:'center',padding:"2em",backgroundColor:"#A5F1E9",borderRadius:"8px"}}>
            <Typography variant='caption' align='center' style={{color:"#111436"}}>
                <h2>Upload Successful !</h2>
            </Typography>
            </Paper>
    </Backdrop>
</div>
  )
}
