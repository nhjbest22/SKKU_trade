document.addEventListener("DOMContentLoaded", () => {
    const map = L.map("map").setView([37.2938, 126.9749], 16);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    let currentMarker = null;
    const locationList = document.getElementById("locationList");
    const nicknameInput = document.getElementById("nicknameInput");
    const saveLocationButton = document.getElementById("saveLocationButton");

    // 로컬스토리지에서 데이터 로드
    function loadLocations() {
        const locations = JSON.parse(localStorage.getItem("preferredLocations")) || [];
        locations.forEach((location) => {
            addLocationToList(location.nickname, location.lat, location.lng, false);
        });
    }

    // 로컬스토리지에 데이터 저장
    function saveLocations() {
        const locations = [];
        document.querySelectorAll(".locationItem").forEach((item) => {
            locations.push({
                nickname: item.textContent.trim(),
                lat: item.dataset.lat,
                lng: item.dataset.lng,
            });
        });
        localStorage.setItem("preferredLocations", JSON.stringify(locations));
    }

    // 위치 목록에 추가
    function addLocationToList(nickname, lat, lng, saveToStorage = true) {
        const listItem = document.createElement("li");
        listItem.className = "flex justify-between items-center border-b py-2";
        listItem.innerHTML = `
            <span class="locationItem cursor-pointer text-blue-600 hover:underline" 
            data-lat="${lat}" data-lng="${lng}">
            ${nickname}
            </span>
            <button class="delete-button text-red-500 hover:text-red-700">삭제</button>
        `;

        // 저장된 위치 클릭 시 지도 이동
        listItem.querySelector(".locationItem").addEventListener("click", (event) => {
            const lat = event.target.dataset.lat;
            const lng = event.target.dataset.lng;
            map.setView([lat, lng], 16);

            // 클릭한 위치에 마커 표시
            if (currentMarker) {
                map.removeLayer(currentMarker);
            }
            currentMarker = L.marker([lat, lng])
                .bindPopup(`${nickname}`)
                .addTo(map)
                .openPopup();
        });

        listItem.querySelector(".delete-button").addEventListener("click", () => {
            listItem.remove();
            saveLocations();
        });

        locationList.appendChild(listItem);

        if (saveToStorage) {
            saveLocations();
        }
    }

    map.on("click", (e) => {
        const { lat, lng } = e.latlng;

        if (currentMarker) {
            map.removeLayer(currentMarker);
        }

        currentMarker = L.marker([lat, lng])
            .addTo(map)
            .openPopup();

        nicknameInput.dataset.lat = lat;
        nicknameInput.dataset.lng = lng;
    });

    saveLocationButton.addEventListener("click", () => {
        const nickname = nicknameInput.value.trim();
        const lat = nicknameInput.dataset.lat;
        const lng = nicknameInput.dataset.lng;

        if (!nickname) {
            alert("거래 장소의 별명을 입력하세요.");
            return;
        } else if (!lat || !lng) {
            alert("거래 장소를 선택하세요.");
            return;
        }

        addLocationToList(nickname, lat, lng);

        nicknameInput.value = "";
        nicknameInput.dataset.lat = "";
        nicknameInput.dataset.lng = "";
        nicknameInput.focus();
        map.removeLayer(currentMarker);
    });

    loadLocations();
});
