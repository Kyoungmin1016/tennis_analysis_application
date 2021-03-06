import React, {useState} from 'react';
import './VideoUpload.css';
import AWS from 'aws-sdk';
import { Row, Col, Button, Input, Alert } from 'reactstrap';


function VideoUpload() {
    const [Progress , setProgress] = useState('')
    const [SelectedFile, setSelectedFile] = useState(null);
    const [ShowAlert, setShowAlert] = useState(false);

    const ACCESS_KEY = 'AKIAYXOGVMBMLIUBZKXF';
    const SECRET_ACCESS_KEY = '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';
    const REGION = "ap-northeast-2";
    const S3_BUCKET = 'tukorea-tennis-video-file-upload';

    AWS.config.update({
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_ACCESS_KEY
    });

    const myBucket = new AWS.S3({
        params: { Bucket: S3_BUCKET},
        region: REGION,
    });



    const handleFileInput = (e) => {
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        if(file.type !== 'video/mp4' || fileExt !=='mp4'){
            alert('mp4 파일만 Upload 가능합니다.');
            return;
        }
        setProgress(0);
        setSelectedFile(e.target.files[0]);
        }


    const uploadFile = (file) => {
        const params = {
            ACL: 'public-read',
            Body: file,
            Bucket: S3_BUCKET,
            Key: "upload/" + file.name
        };
        
        myBucket.putObject(params)
            .on('httpUploadProgress', (evt) => {
            setProgress(Math.round((evt.loaded / evt.total) * 100))
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
                setSelectedFile(null);
            }, 3000)
            })
            .send((err) => {
            if (err) console.log(err)
            })
        }

    return (
    <div className='App'>
    <div className="App-header">
        <Row>
            <Col><h1>File Upload</h1></Col>
        </Row>
        </div>
        <div className="App-body">
        <Row>
            <Col>
            { ShowAlert?
                <Alert color="primary">업로드 진행률 : {Progress}%</Alert>
                : 
                <Alert color="primary">파일을 선택해 주세요.</Alert> 
            }
            </Col>
        </Row>
        <Row>
            <Col>
            <Input color="primary" type="file" onChange={handleFileInput}/>
            {SelectedFile?(
                <Button color="primary" onClick={() => uploadFile(SelectedFile)}> Upload to S3</Button>
            ) : null }
            </Col>
        </Row>
        </div>
    </div>
    );
        }
export default VideoUpload;