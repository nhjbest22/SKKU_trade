//var a;

//1. API url

const url = "https://jsonplaceholder.typicode.com/users";

//2. Fetch users from the API url

function fetchUsers() {
    const url = "./Items.json"; // 로컬 JSON 파일의 위치

    fetch(url)
        .then((response) => response.json())
        .then((json) => {
            // 'items' 필드의 데이터를 추출하여 data 변수에 저장
            const data = json.items;

            // data를 사용하는 함수, 예를 들어 렌더링 함수에 data를 전달
            renderUsers(data);
        })
        .catch((error) => {
            console.error("Error fetching data: ", error);
        });
}

//3. render the users in the DOM

function renderUsers(usersData) {
    const ul = document.getElementById("user-list-container");

    //3.1 render an li tag for each user
    usersData.forEach((user, index) => {
        const li = document.createElement("li");
        li.style.position = "relative";
        li.style.display = "none";
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
    if (inputValue == "") {
        inputValue = "c";
    }

    const usersList = ul.querySelectorAll("li"); // array of all the li tags
    //loop through all the users and render the ones that matches the search
    for (let index = 0; index < usersList.length; index++) {
        const usernameSpanTag = usersList[index].querySelector(".username");
        const nameSpanTag = usersList[index].querySelector(".name");
        const usernameSpanTagValue = usernameSpanTag.innerText.toUpperCase();
        const nameSpanTagValue = nameSpanTag.innerText.toUpperCase();
        const isMatch = usernameSpanTagValue.indexOf(inputValue) > -1;
        const isNameMatch = nameSpanTagValue.indexOf(inputValue) > -1;

        if (isMatch || isNameMatch) {
            usersList[index].style.display = "block";
        } else {
            usersList[index].style.display = "none";
        }
    }
}

window.onpopstate = function (event) {
    // 상태가 존재하고, 그 상태 내에 'search' 값이 있을 경우
    searchUsersByUsername();
};

//calling the fetch function
fetchUsers();

const itemListContainer = document.getElementById("item-list-container");

// Fetch items from localStorage
function fetchItems() {
    const items = JSON.parse(localStorage.getItem("registeredItems")) || [];
    return items;
}

// Display items in the list
function displayItems(items) {
    itemListContainer.innerHTML = "";

    if (items.length === 0) {
        itemListContainer.innerHTML = "<li>등록된 아이템이 없습니다.</li>";
        return;
    }

    items.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.classList.add("item");
        listItem.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <p><strong>가격:</strong> ${item.price}원</p>
      <p><strong>카테고리:</strong> ${item.category}</p>
      <p><strong>거래 장소 및 시간:</strong> ${item.locations.join(", ")}</p>
    `;

        listItem.addEventListener("click", () => {
            window.location.href = `chat_reservation.html?item=${encodeURIComponent(
                item.title
            )}`;
        });

        itemListContainer.appendChild(listItem);
    });
}

// Filter items based on search input
function filterItems() {
    const query = document.getElementById("search").value.toLowerCase();
    const items = fetchItems();
    const filteredItems = items.filter(
        (item) =>
            item.title.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query)
    );
    displayItems(filteredItems);
}

// Initialize item list
document.addEventListener("DOMContentLoaded", () => {
    const items = fetchItems();
    displayItems(items);
});

// 임시 아이템 추가
function addSampleItems() {
    const sampleItems = [
        {
            title: "PS5",
            description: "거의 새 제품",
            price: "400,000",
            category: "취미/게임/음반",
            locations: ["산학협력관, 12:00"],
        },
        {
            title: "중고 노트북",
            description: "i5 프로세서, 8GB RAM",
            price: "500,000",
            category: "전자제품",
            locations: ["반도체관, 15:00"],
        },
        {
            title: "FENDER JAZZ BASS",
            description: "70년대 빈티지 베이스",
            price: "2,500,000",
            category: "악기",
            locations: ["신관B, 14:00"],
        },
    ];

    localStorage.setItem("registeredItems", JSON.stringify(sampleItems));
}

// 페이지 로드 시 샘플 아이템 추가
document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("registeredItems")) {
        addSampleItems();
    }

    // 기존 로직 실행
    const items = fetchItems();
    displayItems(items);
});

localStorage.removeItem("registeredItems");
