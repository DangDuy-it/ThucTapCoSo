import React from 'react';
import '../styles/Home.css'; 
import Notification from '../components/Notification';
import List from '../components/List';
import Header from '../components/Header';

function TheLoai(){
    return(
        <div>
            <div className="content">
                <Notification />
                <List />
            </div>
        </div>
    );
}

export default TheLoai;