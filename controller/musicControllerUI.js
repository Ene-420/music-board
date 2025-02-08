// Controller for UI

//uses search bar query to make API request
async function apiSearchResult(query){
    const fetch = require('node-fetch');
  
    const url = `https://deezerdevs-deezer.p.rapidapi.com/search?q=${query}`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': process.env.RAPID_API_KEY,
        'x-rapidapi-host': process.env.RAPID_API_HOST
      }
    };
    try {
        const response = await fetch(url, options);
        const result = await response.text();
        return  result;
      } catch (error) {
        console.error(error);
      }
}
// make POST requst to Search route  --> Search Button
 export async function getSongID(event){
  const {dataset} = event.target;
  fetch('save-song', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(dataset)
  })
  .then(response => response.json())
  .then(data =>{
    console.log('REQUEST: ',data)
  })
  .catch(error =>{
    console.error('Error', error);
  });
}