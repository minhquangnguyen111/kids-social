import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContentScanner = () => {
   const [url, setUrl] = useState('');
   const [content, setContent] = useState('');
   const [result, setResult] = useState(null);
   const apiKey = 'AIzaSyCdEITgPP-xKriOKS_M9sgPE4nLo0Kdoaw'; // Thay thế bằng khóa API của bạn

   // Sử dụng useEffect để gán giá trị mặc định cho URL khi component được render
   useEffect(() => {
      setUrl(window.location.href); // Lấy URL của trang hiện tại
   }, []);

   const fetchContent = async () => {
      try {
         const response = await fetch(url);
         const text = await response.text();
         setContent(text);
      } catch (error) {
         console.error('Error fetching content:', error);
      }
   };

   const analyzeContent = async () => {
      try {
         const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
            contents: [{ parts: [{ text: content }] }]
         }, {
            headers: {
               'Content-Type': 'application/json'
            }
         });
         setResult(response.data);
      } catch (error) {
         console.error('Error analyzing content:', error);
      }
   };

   return (
      <div>
         <h1>Sensitive Content Scanner</h1>
         <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL to scan"
         />
         <button onClick={fetchContent}>Fetch Content</button>
         <button onClick={analyzeContent}>Analyze Content</button>
         {result && <div>
            <h2>Analysis Result</h2>
            <pre>{JSON.stringify(result, null, 2)}</pre>
         </div>}
      </div>
   );
};

export default ContentScanner;
