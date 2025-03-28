import React from "react";
import "./Table.css";

const Table = () => {
  // Define the static data for the 5x5 table
  const tableData = [
    ["CODE", "B", "H", "L", "SLOOP"],
    ["1530500303", "15", "30", "50", "3/3"],
    ["1525500303", "15", "25", "50", "3/3"],
    ["2025500303", "20", "25", "50", "3/3"],
    ["1015500202", "10", "15", "50", "2/2"],
  ];

  return (
    <table className="custom-table">
      <tbody>
        {tableData.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, colIndex) => (
              <td key={colIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
