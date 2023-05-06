import { useState, useRef, useEffect } from 'react'
import './App.css'
import { Row, Container, Col, Form, Button } from "react-bootstrap"
import { Link } from "react-router-dom";
import hero_img from "./assets/hero-img.png"


function Home() {
    const [count, setCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const [opPath, setOpPath] = useState("")
    const vidRef = useRef()
    var videoSelect = null;
    var videoElement = useRef();
    const [imageData, setImageData] = useState(null);


    useEffect(() => {
        if (!vidRef.current) return
        videoSelect = vidRef.current
    }, [vidRef])


    function getDevices() {
        // AFAICT in Safari this only gets default devices until gUM is called :/
        return navigator.mediaDevices.enumerateDevices();
    }

    function gotDevices(deviceInfos) {
        window.deviceInfos = deviceInfos; // make available to console
        console.log('Available input and output devices:', deviceInfos);
        for (const deviceInfo of deviceInfos) {
            const option = document.createElement('option');
            option.value = deviceInfo.deviceId;
            if (deviceInfo.kind === 'videoinput') {
                option.text = deviceInfo.label || `Camera ${videoSelect.length + 1}`;
                videoSelect.appendChild(option);
            }
        }
    }

    function getStream() {
        if (window.stream) {
            window.stream.getTracks().forEach(track => {
                track.stop();
            });
        }

        const videoSource = videoSelect.value;
        const constraints = {
            video: { deviceId: videoSource ? { exact: videoSource } : undefined }
        };
        return navigator.mediaDevices.getUserMedia(constraints).
            then(gotStream).catch(handleError);
    }

    function gotStream(stream) {
        window.stream = stream; // make stream available to console
        videoSelect.selectedIndex = [...videoSelect.options].
            findIndex(option => option.text === stream.getVideoTracks()[0].label);
        videoElement.current.srcObject = stream;
        videoElement.current.style.display = "block"
        setInterval(() => {
            sendVideoSnapshot()
        }, 10000);


    }
    function sendVideoSnapshot() {
        // Create a canvas element to draw the video frame
        const canvas = document.createElement("canvas");
        canvas.width = videoElement.current.videoWidth;
        canvas.height = videoElement.current.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(videoElement.current, 0, 0, canvas.width, canvas.height);

        // Get the image data from the canvas and convert it to a Blob
        canvas.toBlob((blob) => {
            // Send the image to the server using fetch or XMLHttpRequest
            const formData = new FormData();
            formData.append("photo", blob, "VideoSnapshot.jpg");
            fetch("http://localhost:7000/detect/uploadFile", { method: "POST", body: formData })
                .then(response => {
                    // Handle response from server
                    response.json().then(res => {
                        console.log(res);
                        setOpPath(res.file_path);
                        console.log("Pah set to "+ opPath + "from video")
                    });

                })
                .catch(error => {
                    // Handle error from server
                    console.error(error);
                });
        }, "image/jpeg", 0.9);
    }

    function handleError(error) {
        console.error('Error: ', error);
    }
    function requestAccess(e) {
        e.currentTarget.style.display = "none"
        videoSelect.style.display = "block"
        videoSelect.onchange = getStream;
        videoSelect.onClick = getStream().then(getDevices).then(gotDevices);
    }
    async function handlePhotos(event) {

        setLoading(true)
        const file = event.target.files[0];

        // Check if uploaded file is an image
        if (!file.type.match('image.*')) {
            console.log('Please upload an image file.');
            return;
        }

        // Send image to backend server
        const formData = new FormData();
        formData.append('photo', file);

        fetch('http://localhost:7000/detect/uploadFile', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                // Handle response from server
                response.json().then(res => {
                    console.log(res);
                    setOpPath(res.file_path);
                    setLoading(false)
                });

            })
            .catch(error => {
                // Handle error from server
                console.error(error);
                setLoading(false)
            })

    }


    return (
        <div>
            {loading && <div className="overlay">Loading...</div>}

            <section className='hero-section'>
                <Container>
                    <Row>
                        <Col className='hero-text'>
                            <div>
                                Solid Waste<br /> Identification & Management
                            </div>
                        </Col>
                        <Col>
                            <img className='hero-img' src={hero_img} alt="" />
                        </Col>
                    </Row>
                </Container>

            </section>
            <section className="action-section">
                <Container>
                    <Row>
                        <Col className="upload-photo mx-3 my-3 py-3 px-3 rounded">
                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Label className='h3 my-3'>Upload Photo</Form.Label>
                                <Form.Control type="file" onChange={(e) => { handlePhotos(e) }} />
                            </Form.Group>
                        </Col>
                        <Col className='select-camera mx-3 my-3 py-3 px-3 rounded'>
                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Label className='h3 my-3'>Select Camera</Form.Label>
                                <div >
                                    <Button variant="primary w-100" onClick={(e) => requestAccess(e)}>Select Camera</Button>
                                    <select id="videoSource" ref={vidRef} className='form-select'></select>
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Link to="prev">
                        <Button variant="outline-light w-100" onClick={(e) => console.log("Redirect")}>View Previously Analysed Images</Button>
                    </Link>
                    <div className='outputs'>
                        <video autoPlay muted playsInline ref={videoElement}></video>
                        <img src={opPath} className='opImg' alt="" />
                    </div>
                </Container>
            </section>

        </div>
    )
}

export default Home
