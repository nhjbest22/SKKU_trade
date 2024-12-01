document.addEventListener("DOMContentLoaded", () => {
    // Socket.IO 클라이언트 초기화
    const socket = io();

    const sendButton = document.getElementById("sendButton");
    const messageInput = document.getElementById("messageInput");
    const chatWindow = document.getElementById("chatWindow");

    // 사용자 이름 설정 (임시로 랜덤한 이름 생성)
    const username = "사용자" + Math.floor(Math.random() * 1000);

    // 메시지 전송 버튼 클릭 시
    // sendButton.addEventListener("click", () => {
    //     const message = messageInput.value.trim();
    //     if (message !== "") {
    //         // 메시지 보내기
    //         socket.emit("send_message", {
    //             username: username,
    //             message: message,
    //         });

    //         // 입력창 비우기
    //         messageInput.value = "";

    //         // 자신의 메시지를 바로 채팅창에 표시
    //         addMessageToChatWindow(message, "sent");
    //     }
    // });

    // 엔터키로 메시지 전송
    messageInput.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            sendButton.click();
        }
    });

    // 서버로부터 일반 메시지를 받았을 때
    socket.on("receive_message", (data) => {
        // 자신이 보낸 메시지는 이미 표시되었으므로 제외
        if (data.username !== username) {
            addMessageToChatWindow(data.message, "received");
        }
    });

    // 예약 확정 버튼 클릭 시
    const confirmReservationButton =
        document.getElementById("confirmReservation");
    confirmReservationButton.addEventListener("click", function () {
        const date = document.getElementById("dateSelect").value;
        const time = document.getElementById("timeSelect").value;
        const placeKey = document.getElementById("placeSelect").value;
        const place =
            document.getElementById("placeSelect").options[
                document.getElementById("placeSelect").selectedIndex
            ].text;

        if (date === "" || time === "" || placeKey === "") {
            alert("모든 예약 정보를 입력해주세요.");
            return;
        }

        // 예약 확정 메시지 생성
        const reservationMessage = `예약이 확정되었습니다.\n날짜: ${date}\n시간: ${time}\n장소: ${place}`;

        // 예약 메시지 보내기
        socket.emit("reservation_confirmed", {
            username: username,
            message: reservationMessage,
            date: date,
            time: time,
            place: place,
        });

        // 자신의 채팅창에 예약 메시지 추가
        addMessageToChatWindow(reservationMessage, "sent");

        // 예약 상태 업데이트
        alert("거래가 예약되었습니다.");
        const reservationStatus = document.querySelector(
            ".reservation-status span"
        );
        reservationStatus.textContent = "예약 상태: 확정됨";

        // 예약 섹션 비우기 (선택 사항)
        document.getElementById("dateSelect").value = "";
        document.getElementById("timeSelect").value = "";
        document.getElementById("placeSelect").value = "";
        document.getElementById("selectedAddress").value = "";
    });

    // 서버로부터 예약 확정 메시지를 받았을 때
    socket.on("receive_reservation_confirmation", (data) => {
        // 자신이 보낸 메시지는 이미 표시되었으므로 제외
        if (data.username !== username) {
            addMessageToChatWindow(data.message, "received");
        }
    });

    // 메시지를 채팅창에 추가하는 함수
    // 메시지를 채팅창에 추가하는 함수
    function addMessageToChatWindow(message, messageType) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", messageType);

        // 타임스탬프 생성
        const timestamp = document.createElement("span");
        timestamp.classList.add("timestamp");
        const currentTime = new Date();
        const hours = currentTime.getHours();
        const minutes = ("0" + currentTime.getMinutes()).slice(-2);
        timestamp.textContent = `${hours}:${minutes}`;

        // 메시지 내용 생성 (\n을 <br>로 변환)
        const messageContent = document.createElement("p");
        const formattedMessage = message.replace(/\n/g, "<br>");
        messageContent.innerHTML = formattedMessage;

        // 메시지에 따라 타임스탬프 위치 조정
        if (messageType === "sent") {
            messageDiv.appendChild(timestamp);
            messageDiv.appendChild(messageContent);
        } else {
            messageDiv.appendChild(messageContent);
            messageDiv.appendChild(timestamp);
        }

        // **예약 확정 메시지인지 확인하고 "평가 남기기" 버튼 추가**
        if (message.startsWith("예약이 확정되었습니다.")) {
            const reviewButton = document.createElement("button");
            reviewButton.textContent = "평가 남기기";
            reviewButton.classList.add("review-button"); // 스타일링을 위한 클래스 추가

            // 버튼 클릭 시 review.html로 이동
            reviewButton.addEventListener("click", function () {
                window.location.href = "review.html";
            });

            // 버튼을 메시지 Div에 추가
            messageDiv.appendChild(reviewButton);
        }

        // 채팅창에 메시지 Div 추가
        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    // 상대방이 보낼 메시지 배열
    const incomingMessages = [
        "네, 안녕하세요",
        "어떤 점이 궁금하신가요?",
        "깨끗합니다. 최상품이에요.",
        "반도체관은 어떠신가요?",
        "오후 3시쯤이 좋을 것 같아요.",
        "감사합니다!",
    ];

    // 메시지 인덱스 초기화
    let messageIndex = 0;

    // 메시지 전송 버튼 클릭 시
    sendButton.addEventListener("click", () => {
        const message = messageInput.value.trim();
        if (message !== "") {
            // 메시지 보내기
            socket.emit("send_message", {
                username: username,
                message: message,
            });

            // 입력창 비우기
            messageInput.value = "";

            // 자신의 메시지를 바로 채팅창에 표시
            addMessageToChatWindow(message, "sent");

            // 상대방의 메시지를 5초 후에 추가
            if (messageIndex < incomingMessages.length) {
                setTimeout(function () {
                    addMessageToChatWindow(
                        incomingMessages[messageIndex],
                        "received"
                    );
                    messageIndex++;
                }, 5000); // 5000ms = 5초 후에 실행
            }
        }
    });

    // Kakao 지도 초기화 및 장소 선택/주소 표시 기능
    var container = document.getElementById("map"); // 지도를 표시할 div
    var options = {
        center: new kakao.maps.LatLng(37.293912, 126.974348), // 초기 중심 좌표
        level: 3, // 지도의 확대 레벨
    };

    var map = new kakao.maps.Map(container, options); // 지도 생성

    // 장소 검색 객체 생성
    var ps = new kakao.maps.services.Places();

    // 장소 선택 시 지도에 마커 표시
    var placeSelect = document.getElementById("placeSelect");
    var selectedAddressInput = document.getElementById("selectedAddress");

    // 장소에 따른 좌표 설정
    var coordinates = {
        place1: {
            lat: 37.296016,
            lng: 126.975816,
            address: "경기 수원시 장안구 서부로 2066(천천동) 산학협력센터",
        }, // 산학관
        place2: {
            lat: 37.291734,
            lng: 126.977677,
            address: "경기 수원시 장안구 일월로90번길 32 반도체관",
        }, // 반도체
        place3: {
            lat: 37.29649,
            lng: 126.971996,
            address: "경기 수원시 장안구 서부로 2066(천천동) 신관A",
        }, // 신관
    };

    placeSelect.addEventListener("change", function () {
        var place = placeSelect.value;

        if (place === "") {
            selectedAddressInput.value = "";
            if (window.marker) {
                window.marker.setMap(null);
            }
            return;
        }

        var coords = coordinates[place];
        console.log(coords); // 디버깅용 로그

        if (coords) {
            var moveLatLon = new kakao.maps.LatLng(coords.lat, coords.lng);
            map.setCenter(moveLatLon);

            // 기존 마커 제거
            if (window.marker) {
                window.marker.setMap(null);
            }

            // 마커 생성
            window.marker = new kakao.maps.Marker({
                position: moveLatLon,
            });

            // 마커 표시
            window.marker.setMap(map);

            // 선택한 주소 표시
            selectedAddressInput.value = coords.address;
        } else {
            selectedAddressInput.value =
                "선택된 장소에 대한 주소 정보가 없습니다.";
        }
    });

    // 지도 클릭 시 장소 선택 및 주소 표시
    kakao.maps.event.addListener(map, "click", function (mouseEvent) {
        var latlng = mouseEvent.latLng;

        // 기존 마커 제거
        if (window.marker) {
            window.marker.setMap(null);
        }

        // 마커 생성
        window.marker = new kakao.maps.Marker({
            position: latlng,
        });

        // 마커 표시
        window.marker.setMap(map);

        // 주소 표시
        geocoder.coord2Address(
            latlng.getLng(),
            latlng.getLat(),
            function (result, status) {
                if (status === kakao.maps.services.Status.OK) {
                    var address = result[0].address.address_name;
                    selectedAddressInput.value = address;
                    // 선택된 장소를 드롭다운 선택으로 동기화 (선택된 장소가 미리 정의된 장소가 아닐 경우)
                    placeSelect.value = "";
                }
            }
        );
    });

    // 주소 검색을 위한 geocoder 객체 생성
    var geocoder = new kakao.maps.services.Geocoder();
});
