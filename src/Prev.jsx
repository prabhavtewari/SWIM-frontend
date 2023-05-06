import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table"

const TableRow = ({ filename, timestamp, detected_URL }) => {
  
  function formatDate(timestamp) {
    const date = new Date(timestamp*1);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  
    return formattedDate;
  }
  

  

  return (
    <>
      <tr>
        <td>{filename}</td>
        <td>{formatDate(timestamp)}</td>

        <td colSpan="3">
          <img
            src={detected_URL}

            style={{ maxHeight: "200px" }}
          />
        </td>
      </tr>


    </>
  );
};

const MyTable = ({ data }) => {
  return (
    <table >
    {/* <Table striped bordered hover variant="dark"> */}
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
        setData(json.imageDB.reverse())
      })
      .catch((error) => console.error(error));
  }, []);

  return (
  <div className="Prev">
  <MyTable data={data} />
  </div>
  );
};

export default Prev;