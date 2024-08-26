"use client"

import "./Header.css";

import React from 'react';
import './Header.css';
import  { useCell} from "../AppStore";

export default function Header({ onFormatChange }) {

  const changeAlignment = useCell((state)=>state.setAlignValue);
  const setFontSize = useCell((state)=>state.setFontSize);

  const handleTextAlignChange = (e) => {
    console.log(e.target.value);
    changeAlignment(e.target.value);
  };

  const handleFontSizeChange = (e) => {
    setFontSize(e.target.value);
  };

  return (
    <div className="header">
      <div className="formatting-options">
        <label>Align:</label>
        <select onChange={handleTextAlignChange}>
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
        &nbsp;&nbsp;&nbsp;<label>Font Size:</label> 
        <select onChange={handleFontSizeChange}>
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
        </select>

      </div>
    </div>
  );
}
