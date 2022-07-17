import React from 'react';
import Carousel from 'react-bootstrap/Carousel';

function HeroSlider() {
  return (
    <Carousel fade>
      <Carousel.Item>
        <img
        className="b-img"
        src="https://cdn.pixabay.com/photo/2017/06/20/22/14/man-2425121_960_720.jpg"          
        alt="First slide"
        />
        <Carousel.Caption>
          <h3>Häng med i det senaste modet</h3>
          <p>Vi har det senaste inom Modet för män och kvinnor</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="b-img"
    src='https://cdn.pixabay.com/photo/2015/02/19/12/59/man-642063_960_720.jpg'          alt="Second slide"
        />

        <Carousel.Caption>
          <h3>Dags för bröllop?</h3>
          <p>Köp din kostym hos oss</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="b-img"
          src="https://images.unsplash.com/photo-1580657018950-c7f7d6a6d990?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
          alt="Third slide"
        />

        <Carousel.Caption>
          <h3>Det senaste ifrån Kända märken</h3>
          <p>
            Hugo Boss - J - LindBergh
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default HeroSlider;