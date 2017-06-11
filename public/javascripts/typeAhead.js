const axios = require('axios');

function typeAhead(search) {
  if (!search) {
    return;
  }

  const searchInput = search.querySelector('input[name="search"]')
  const searchResult = search.querySelector('.search__result')  
  

}

export default typeAhead;