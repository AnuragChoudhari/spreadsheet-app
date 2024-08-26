"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import "./Spreadsheet.css";
import Header from "./Header";
import { useCell } from "../AppStore";
//import { FixedSizeGrid as Grid } from 'react-window'; // Uncomment for virtualization

export default function Spreadsheet({ format }) {
  const cellContentAlignment = useCell((state) => state.alignValue);
  const cellFontSize = useCell((state) => state.fontSizeVal);

  const initialGrid = useMemo(() => {
    return Array.from({ length: 1000 }, () =>
      Array.from({ length: 10 }, () => ({ value: "", format: {} }))
    );
  }, []);

  const [grid, setGrid] = useState(initialGrid);
  const [selectedCell, setSelectedCell] = useState({
    rowIndex: null,
    colIndex: null,
  });
  const inputRefs = useRef([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleCellChange = useCallback((rowIndex, colIndex, value) => {
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      const newRow = [...newGrid[rowIndex]];
      newRow[colIndex] = { ...newRow[colIndex], value };
      newGrid[rowIndex] = newRow;
      return newGrid;
    });
  }, []);

  const handleCellClick = useCallback((rowIndex, colIndex) => {
    setSelectedCell({ rowIndex, colIndex });
  }, []);

  const applyFormatting = useCallback((rowIndex, colIndex, format) => {
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      const newRow = [...newGrid[rowIndex]];
      newRow[colIndex] = {
        ...newRow[colIndex],
        format: { ...newRow[colIndex].format, ...format },
      };
      newGrid[rowIndex] = newRow;
      return newGrid;
    });
  }, []);

  useEffect(() => {
    if (selectedCell.rowIndex !== null && selectedCell.colIndex !== null) {
      applyFormatting(selectedCell.rowIndex, selectedCell.colIndex, format);
    }
  }, [format, selectedCell, applyFormatting]);

  const handleKeyDown = useCallback((e, rowIndex, colIndex) => {
    let nextRowIndex = rowIndex;
    let nextColIndex = colIndex;

    switch (e.key) {
      case "Enter":
      case "ArrowDown":
        nextRowIndex = Math.min(rowIndex + 1, grid.length - 1); // Move down
        break;
      case "ArrowUp":
        nextRowIndex = Math.max(rowIndex - 1, 0); // Move up
        break;
      case "ArrowLeft":
        nextColIndex = Math.max(colIndex - 1, 0); // Move left
        break;
      case "ArrowRight":
        nextColIndex = Math.min(colIndex + 1, grid[0].length - 1); // Move right
        break;
      default:
        return; // Ignore other keys
    }

    setSelectedCell({ rowIndex: nextRowIndex, colIndex: nextColIndex });
    inputRefs.current[nextRowIndex * grid[0].length + nextColIndex].focus();
  }, [grid.length]);

  const handleSearch = useCallback(() => {
    for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
      for (let colIndex = 0; colIndex < grid[0].length; colIndex++) {
        if (grid[rowIndex][colIndex].value === searchTerm) {
          setSelectedCell({ rowIndex, colIndex });
          inputRefs.current[rowIndex * grid[0].length + colIndex].focus();
          return;
        }
      }
    }
    alert("Value not found!");
  }, [searchTerm, grid]);

  const renderedGrid = useMemo(() => {
    return grid.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <input
          key={`${rowIndex}-${colIndex}`}
          type="text"
          value={cell.value}
          onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
          onClick={() => handleCellClick(rowIndex, colIndex)}
          onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
          ref={(el) => (inputRefs.current[rowIndex * grid[0].length + colIndex] = el)}
          style={{
            textAlign: cellContentAlignment || cell.format.textAlign,
            fontSize: cellFontSize || cell.format.fontSize,
          }}
          className="cell"
        />
      ))
    );
  }, [grid, cellContentAlignment, cellFontSize, handleCellChange, handleCellClick, handleKeyDown]);

  return (
    <>
      <Header />
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch} id="searchBtn">Search</button>
      </div>
      <div className="spreadsheet">
        {renderedGrid}
      </div>
    </>
  );
}
