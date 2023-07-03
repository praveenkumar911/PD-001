
import React,  { useState, useEffect } from 'react';
import { Typography, Modal} from '@mui/material';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import Recorder from './Recorder';


export const Prompt = () => {
    var time = new Date()
    const date_time = time.getFullYear()+'-'+time.getMonth()+"-"+time.getDate()+"--"+time.getHours()+'-'+time.getMinutes()+'-'+time.getSeconds()
    const [data, setData] = useState({"id":"1234567890-"+date_time,"prompt":"Loading Text ..."})
    const [s3url, setS3url] = useState({})
    const handleRefresh = () => {
        window.location.reload()
    }
    useEffect(()=>{
        /// TO PRAVEEN: Change the backend ip , This doesnt have to be thru domain .... 
        /// iiit's private ip for the backend should work as the frotnend and bakcend is sitting in the same host machine.
        const fetchData = async () => {
            await axios.get("http://65.0.231.212/get_prompt")
            // await axios.get("http://localhost:8000/get_prompt")
            .then((res) => {
                setData(res.data)
                setS3url({})
            }).catch(err =>{
                    console.log(err)
                })
            }
        fetchData()
        },[])
    useEffect(()=>{
        const getPresignedURL = async () => {
            /// TO PRAVEEN: Change the backend ip , This doesnt have to be thru domain .... 
            /// iiit's private ip for the backend should work as the frotnend and bakcend is sitting in the same host machine.
            /// if the presignurl method is hard to implement , we can just dump to minio using privateip of minio
            await axios.get(`http://65.0.231.212/presigned_s3_post/${data.id}_${date_time}.wav`)
            // await axios.get(`http://localhost:8000/presigned_s3_post/${data.id}_${date_time}.wav`)
            .then((res)=>{
                setS3url(res.data)
            }).catch((err)=>{console.log(err)})

        }
        if (data.id !== "1234567890-"+date_time){
            getPresignedURL()
        }
    },[data])
  return (
    <div style={{marginTop:"1em", marginBottom:"1em",borderRadius:"8px"}}>
        <Paper variant="outlined" style={{justifyContent:"center", alignItems:'center'}}>
            <Typography variant='caption' align='center'>
                <h2>{data.prompt}</h2>
            </Typography>
        </Paper>
        <Recorder s3url={s3url} id={data.id} handleRefresh={handleRefresh}/>
    </div>
  )
}
