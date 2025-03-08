// Controller for UI

// I dont think i need this
//uses search bar query to make API request --> Search Button
/* async function getSearchQuery(event){
  const query = document.getElementById('search-bar').value;
  fetch('search', {
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({query})
  })
  .then(response => response.json())
  .then(data => {
    console.log('REQUEST: ', data)
  })
  .catch(error =>{
    console.error('Error', error);
  });
} */

// make POST requst to Search route  --> Save Button
async function getSongID(event){
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

function testButton(event){
  console.log('Button clicked')
  
}

module.exports = {getSongID, getSearchQuery, testButton}