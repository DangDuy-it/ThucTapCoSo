import React from 'react';
import '../styles/Home.css'; 
import Notification from '../components/Notification';
import List from '../components/List';
import Slider from "../components/Slider";
import Header from '../components/Header';

function Home() {
  return (
    <div>
      {/* <Header></Header> */}
      <div className="content">
        <Notification />
        <Slider />
        <List />
      </div>
    </div>
  );
}

export default Home;
