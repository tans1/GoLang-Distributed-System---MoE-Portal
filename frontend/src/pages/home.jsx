import React from "react";
import Navbar from "../components/navbar";
import "../styles/home.css";
import bubble from "../bubble.json";
import books from "../books.json";
import Lottie from "lottie-react";
import CountUp from "react-countup";
export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="home-main">
        <div className="lottie-left">
          <Lottie animationData={books} loop={true} />
        </div>

        <div className="item one">
          <p className="text-bold">Better Education For Better World</p>
          <p className="text-normal">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Voluptatibus id, explicabo libero odio quaerat molestias ex atque
          </p>
        </div>
        <div className="item two">
          <img src="edustar-main-img.png" alt="" />
        </div>
      </div>
      <div className="lottie-right">
        <Lottie animationData={bubble} loop={true} />
      </div>
      <div className="counter-cards">
        <div className="card one">
          <img src="school.png" alt="" />
          <div className="card-body">
            <div>
              <p>Schools</p>

              <div className="counter">
                <CountUp end={52202} duration={5} />
              </div>
            </div>
          </div>
        </div>
        <div className="card two">
          <img src="students.png" alt="" />
          <div className="card-body">
            <div>
              <p>Students</p>

              <div className="counter">
                <CountUp end={26457127} duration={5} />
              </div>
            </div>
          </div>
        </div>
        <div className="card three">
          <img src="teacher.png" alt="" />
          <div className="card-body">
            <div>
              <p>Teachers</p>

              <div className="counter">
                <CountUp end={752580} duration={5} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="home-main-two">
        <div className="second-item one">
          <img src="edustar-about-us-img1.png" alt="" />
        </div>
        <div className="second-item two">
          <p className="text-bold">
            Inspiring The Next Generation Engineers
          </p>
          <p className="text-normal">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially.Lorem Ipsum is simply dummy text of the
            printing and typesetting industry. Lorem Ipsum has been the
            industry's standard dummy text ever since the 1500s, when an unknown
            printer took a galley of type and scrambled it to make a type
            specimen book. It has
          </p>
          <button>Contact us</button>
        </div>
      </div>
    </div>
  );
}
