import { useState } from 'react'
import './App.css'
import { Row, Container, Col, Form } from "react-bootstrap"
import hero_img from "./assets/hero-img.png"


function App() {
  const [count, setCount] = useState(0)

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
              <img className='hero-img' src={hero_img} alt="" srcset="" />
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
                <Form.Control type="file" />
              </Form.Group>
            </Col>
          </Row>
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
