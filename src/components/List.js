
import { useState, useEffect } from 'react';
import {AnimeList} from './Datalist';
import '../styles/AnimeList.css'; 
import anime1 from '../picture/anime1.jpg';

function List(){
    console.log(AnimeList);
    return(
        <div className="list-main">
            <div className="tag">
                <li>MỚI CẬP NHẬT</li>
            </div>
            <div className="list">
            {AnimeList.map((item,index)=>
                <AnimeItem key={item.id} title={item.title} image={item.image}></AnimeItem>
            )}
            </div>
            <div className="more">
                <ul>
                    <li><a href="#">1</a></li>
                    <li><a href="#">2</a></li>
                </ul>
            </div>
        </div>
    )
}
export default List;

function AnimeItem(props){
    console.log(props);
    return(
        <div className="anime-item">
            <div className="anime-image">
                <img src={props.image} alt="" />
            </div>
            <div className="anime-info">
                <h3 className="title">{props.title}</h3>
            </div>
        </div>
    )
}
