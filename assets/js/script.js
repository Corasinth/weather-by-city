var requestURL = "https://api.github.com/users/corasinth"

var data
function fetchRequest () {
    fetch (requestURL)
    .then(function(response) {
    data = response.json();
    console.log (data)
    }
    )
}


