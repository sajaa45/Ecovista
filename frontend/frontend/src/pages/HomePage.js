import React, { useEffect, useState } from "react";
import Section from "../components/Section";
import { fetchData } from "../services/dataService";

function HomePage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchData(); // Function in dataService.js
        setData(response);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    loadData();
  }, []);

  return (
    <div>
      <h1>Home</h1>
      {data.map((section, index) => (
        <Section key={index} title={section.title} content={section.content} />
      ))}
    </div>
  );
}

export default HomePage;
