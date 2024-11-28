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

    saveLocationButton.addEventListener("click", async () => {
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

        const listItem = document.createElement("li");
        listItem.className = "flex justify-between items-center border-b py-2";
        listItem.innerHTML = `
            <span class="location-item cursor-pointer text-blue-600 hover:underline" 
            data-lat="${lat}" data-lng="${lng}">
            ${nickname}
            </span>
            <button class="delete-button text-red-500 hover:text-red-700">삭제</button>
        `;

        // 저장된 위치 클릭 시 지도 이동
        listItem.querySelector(".location-item").addEventListener("click", (event) => {
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
        });

        locationList.appendChild(listItem);

        nicknameInput.value = "";
        nicknameInput.dataset.lat = "";
        nicknameInput.dataset.lng = "";
        nicknameInput.focus();
        map.removeLayer(currentMarker);
    });
});
