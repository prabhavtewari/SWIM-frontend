import React, { useEffect, useState } from "react";

const TableRow = ({ filename, timestamp, detected_URL}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => setIsOpen(!isOpen);

  return (
    <>
      <tr onClick={handleClick}>
        <td>{filename}</td>
        <td>{timestamp}</td>
      </tr>
      {isOpen && (
        <tr>
          <td colSpan="3">
            <img
              src={detected_URL}
              
              style={{ maxHeight: "200px", maxWidth: "200px",minHeight: "200px", minWidth: "200px" }}
            />
          </td>
          
        </tr>
      )}
    </>
  );
};

const Table = ({ data }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Filename</th>
          <th>Timestamp</th>
          <th>Detected Image</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <TableRow key={index} {...item} />
        ))}
      </tbody>
    </table>
  );
};

const Prev = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:7000/detect/viewImages")
      .then((response) => response.json())
      .then((json) => {
        console.log(json)
        setData(json.imageDB)})
      .catch((error) => console.error(error));
  }, []);

  return <Table data={data} />;
};

export default Prev;