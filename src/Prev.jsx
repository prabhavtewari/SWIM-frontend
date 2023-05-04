import React, { useEffect, useState } from "react";

const TableRow = ({ file, timestamp, value }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => setIsOpen(!isOpen);

  return (
    <>
      <tr onClick={handleClick}>
        <td>{file}</td>
        <td>{timestamp}</td>
        <td>{value}</td>
      </tr>
      {isOpen && (
        <tr>
          <td colSpan="3">
            <img
              src={`http://localhost:8080/${file}`}
              alt={file}
              style={{ maxHeight: "200px", maxWidth: "200px" }}
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
          <th>File</th>
          <th>Timestamp</th>
          <th>Value</th>
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
    fetch("/api/data")
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error));
  }, []);

  return <Table data={data} />;
};

export default Prev;