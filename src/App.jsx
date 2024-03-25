import './App.css';
import React, {useState, useEffect } from 'react'
import axios from 'axios';


const App = () => {
const [banList, setBanList] = useState([])
const [imageUrl, setImageUrl] = useState('');
const [breedInfo, setBreedInfo] = useState(null);
const [change, setChange] = useState(false);

const handleAddBanClick = (origin) => {
  if (!banList.includes(origin)) {
    setBanList([...banList, origin]);
  }
};

const removeFromBanList = (country) => {
  setBanList(prevBanList => {
    const updatedList = prevBanList.filter(item => item !== country);
    return updatedList;
  });
};

const fetchData = () => {
  let isBanned = true;
  let imageData, breedData;

  const fetchDataLoop = () => {
    // Make API request
    return axios.get('https://api.thecatapi.com/v1/images/search?limit=1&order=RAND&has_breeds=1&api_key=live_6Aws9k021KwPQUO8Kf66Axb0bRPx0hQXk0yUxtLPKghFJz35L2kWWW0uzA5DRKQT')
      .then((response) => {
        // Extract data from response
        imageData = response.data[0];
        breedData = imageData.breeds.length > 0 ? imageData.breeds[0] : null;

        // Check if breed origin is not in ban list
        if (breedData && !banList.includes(breedData.origin)) {
          isBanned = false;
        } else {
          // Retry fetching data
          return fetchDataLoop();
        }
      });
  };

  return fetchDataLoop().then(() => {
    // Set state with fetched data
    setImageUrl(imageData.url);
    setBreedInfo(breedData);
  });
};


useEffect(() => {
  fetchData().then(() => {
    // This code will execute after the data has been fetched
    // You can perform any additional actions here
  });
}, [change]);

function loadAPI() {
  setChange(!change);
}

const buttonStyle = {
  backgroundColor: 'rgb(46, 169, 56)',
  padding: '10px',
  margin: '5px auto',
  borderRadius: '10px',
  border: 'none',
  width:'32%',
  cursor: 'pointer',
  boxSizing: 'border-box', 
};


  return (
    <div>
      <div className="attributes">
        <h1>Cat Image</h1>
        {imageUrl && <img src={imageUrl} alt="Cat" />}
        {breedInfo && (
          <div>
            <h2>Breed Information</h2>
            <div className='card'>
              <p>Name: {breedInfo.name}</p>
            </div>
            <button onClick={() => handleAddBanClick(breedInfo.origin)} style={buttonStyle}>
              <div className='card'> 
                <p>Origin: {breedInfo.origin}</p>
              </div>
            </button>
            <div className='card'>
              <p>Temperament: {breedInfo.temperament}</p>
            </div>
          </div>
        )}
        <button onClick={loadAPI}>Click Here</button>
      </div>

      <div className="banned-countries">
      <h2>Banned Countries</h2>
      <div className="ban-list">
        {banList.map((country, index) => (
          <button key={index} onClick={() => removeFromBanList(country)} className="ban-item card">{country}</button>
        ))}
      </div>
    </div>


    </div>
  )
}

export default App