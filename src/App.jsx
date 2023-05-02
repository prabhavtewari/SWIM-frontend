import { useState,useRef,useEffect } from 'react'
import './App.css'
import { Row, Container, Col, Form,Button } from "react-bootstrap"
import hero_img from "./assets/hero-img.png"


function App() {
  const [count, setCount] = useState(0)
  const vidRef = useRef()
  var videoSelect = null;
  var videoElement = useRef();

  useEffect(()=>{
    if(!vidRef.current) return
    videoSelect=vidRef.current

  },[vidRef])



  

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
    videoElement.current.style.display = "inline-block"

  }

  function handleError(error) {
    console.error('Error: ', error);
  }
  function requestAccess(e){
    e.currentTarget.style.display = "none"
    videoSelect.style.display="block"
    videoSelect.onchange = getStream;
    videoSelect.onClick = getStream().then(getDevices).then(gotDevices);
  }

  return (
    <div className="App">
      <section className='hero-section'>
        <Container>
          <Row>
            <Col className='hero-text'>
              <div>
                Solid Waste<br /> Identification & Management
              </div>
            </Col>
            <Col>
              <img className='hero-img' src={hero_img} alt=""  />
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
                <Form.Control type="file" />
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
          <video autoPlay muted playsInline ref={videoElement}></video>
        </Container>
      </section>
      {/* <Container>
        <Row>
          <Col>1 of 1</Col>
          <Col>2 of 2</Col>
          <Col>2 of 2</Col>
        </Row>
      </Container> */}

    </div>
  )
}

export default App
