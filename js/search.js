//var a;



//1. API url

const url = "https://jsonplaceholder.typicode.com/users";



//2. Fetch users from the API url

function fetchUsers() {
    const url = './Items.json';  // 로컬 JSON 파일의 위치

    fetch(url)
    .then(response => response.json())
    .then(json => {
        // 'items' 필드의 데이터를 추출하여 data 변수에 저장
        const data = json.items;

        // data를 사용하는 함수, 예를 들어 렌더링 함수에 data를 전달
        renderUsers(data);
    })
    .catch(error => {
        console.error('Error fetching data: ', error);
    });
}


//3. render the users in the DOM

function renderUsers(usersData) {
	const ul = document.getElementById("user-list-container");
	
	//3.1 render an li tag for each user
	usersData.forEach((user, index) => {
		const li = document.createElement("li");
		li.style.position = 'relative';
		li.style.display = 'none';
		//<span>${index + 1}.</span>
		li.innerHTML = `
			<span class="name">${user.name}</span>
			<span class="username">${user.username}</span>
		`;

		//3.2 append the current user li   tag to the ul tag
		ul.appendChild(li);
	});
}




//4. add a search function to the DOM

function searchUsersByUsername() {
	var input = document.getElementById("search");
	const ul = document.getElementById("user-list-container");
	var inputValue = input.value.toUpperCase();
	if(inputValue == "" ){
			inputValue="c";
		}
	
	const usersList = ul.querySelectorAll("li") // array of all the li tags
	//loop through all the users and render the ones that matches the search
	for(let index = 0; index < usersList.length; index++) {
		const usernameSpanTag = usersList[index].querySelector(".username");
		const nameSpanTag = usersList[index].querySelector(".name");
		const usernameSpanTagValue = usernameSpanTag.innerText.toUpperCase();
		const nameSpanTagValue = nameSpanTag.innerText.toUpperCase();
		const isMatch = usernameSpanTagValue.indexOf(inputValue) > -1;
		const isNameMatch = nameSpanTagValue.indexOf(inputValue) > -1;
		
		if(isMatch || isNameMatch) {
			usersList[index].style.display = "block";
		}else {
			usersList[index].style.display = "none";
		}
	}
}


 window.onpopstate = function(event) {
        // 상태가 존재하고, 그 상태 내에 'search' 값이 있을 경우
	    searchUsersByUsername();

    };

//calling the fetch function
fetchUsers();