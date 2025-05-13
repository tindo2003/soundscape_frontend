'use client';

import React, {useState, useEffect} from 'react'
import ReactStars from 'react-stars'
import { Star } from "lucide-react";


export default function Test() {


  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

 return (
  <div>
    {domLoaded && (
      <ReactStars count={5} size={24} color2={'#ffd700'} value={2} edit={false}/>
    )}

  </div>

 );
}